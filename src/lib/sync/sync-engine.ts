/**
 * B2B → WooCommerce Sync Engine
 *
 * Core sync logic:
 * 1. Fetch XML feed from supplier
 * 2. Parse products
 * 3. For each product: check if SKU exists in WC
 *    - Exists → update price/stock
 *    - New → create product
 * 4. Handle GTIN validation
 * 5. Queue images for separate batch
 *
 * Uses WooCommerce REST API (not direct DB).
 */

import type { XMLProduct, SyncResult, SyncError, SyncOptions } from "./types";
import { fetchAndParseXML, parseXMLProducts } from "./xml-parser";
import { validateGTIN } from "./gtin";
import { sanitizeProduct } from "./brand-sanitizer";
import { logInfo, logError, logProductCreated, logProductUpdated } from "./logger";

const WP_URL = process.env.WORDPRESS_URL || "";
const WP_USER = process.env.WP_APPLICATION_USER || "";
const WP_PASS = process.env.WP_APPLICATION_PASSWORD || "";
const AUTH_HEADER = `Basic ${Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64")}`;

// ─── WC REST API Helpers ────────────────────────────────

async function wcAPI(
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const url = `${WP_URL}/wp-json/wc/v3${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: AUTH_HEADER,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`WC API ${method} ${endpoint}: ${res.status} ${errorText}`);
  }

  return res.json() as Promise<Record<string, unknown>>;
}

/**
 * Find existing WC product by SKU.
 */
async function findProductBySKU(sku: string): Promise<number | null> {
  try {
    const products = (await wcAPI(`/products?sku=${encodeURIComponent(sku)}&per_page=1`)) as unknown as Array<{ id: number }>;
    if (Array.isArray(products) && products.length > 0) {
      return products[0].id;
    }
  } catch {
    // Not found
  }
  return null;
}

/**
 * Find or create a WC product category by name.
 */
const categoryCache = new Map<string, number>();

async function getOrCreateCategory(name: string): Promise<number> {
  if (categoryCache.has(name)) return categoryCache.get(name)!;

  // Search existing
  try {
    const cats = (await wcAPI(`/products/categories?search=${encodeURIComponent(name)}&per_page=5`)) as unknown as Array<{ id: number; name: string }>;
    if (Array.isArray(cats)) {
      const exact = cats.find((c) => c.name.toLowerCase() === name.toLowerCase());
      if (exact) {
        categoryCache.set(name, exact.id);
        return exact.id;
      }
    }
  } catch {
    // continue to create
  }

  // Create new
  const created = (await wcAPI("/products/categories", "POST", { name })) as { id: number };
  categoryCache.set(name, created.id);
  return created.id;
}

// ─── Product Mapping ────────────────────────────────────

function mapXMLToWC(xmlProduct: XMLProduct, categoryIds: number[], syncImages: boolean): Record<string, unknown> {
  // ─── BRAND SANITIZATION ─── Remove ALL supplier traces ───
  const sanitized = sanitizeProduct({
    title: xmlProduct.title,
    description: xmlProduct.description,
    short_description: xmlProduct.short_description,
    categories: xmlProduct.categories,
    images: xmlProduct.images,
    sku: xmlProduct.sku,
  });

  // Parse vehicle info from title for Fahrzeug attribute
  const vehicleMatch = sanitized.title.match(/passend\s+f[u\u00fc]r\s+(.+?)(?:\s+Baujahr\s+(.+))?$/i);
  const vehicle = vehicleMatch ? vehicleMatch[1].trim() : "";
  const baujahr = vehicleMatch ? vehicleMatch[2]?.trim() || "" : "";

  const attributes: { name: string; visible: boolean; options: string[] }[] = [
    { name: "Material", visible: true, options: ["TPE"] },
  ];

  if (vehicle) {
    attributes.push({
      name: "Fahrzeug",
      visible: true,
      options: [vehicle + (baujahr ? ` ${baujahr}` : "")],
    });
  }

  // Add any XML attributes (sanitized)
  for (const [name, value] of Object.entries(xmlProduct.attributes)) {
    if (!attributes.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
      attributes.push({ name, visible: true, options: [value] });
    }
  }

  const wcProduct: Record<string, unknown> = {
    name: sanitized.title,
    type: "simple",
    sku: xmlProduct.sku,
    regular_price: xmlProduct.regular_price,
    stock_status: xmlProduct.stock_status,
    manage_stock: false, // dropshipping
    weight: xmlProduct.weight,
    status: "publish",
    categories: categoryIds.map((id) => ({ id })),
    attributes,
    description: sanitized.description,
    short_description: sanitized.short_description,
  };

  // Sale price (only if different from regular)
  if (xmlProduct.price && xmlProduct.price !== xmlProduct.regular_price) {
    wcProduct.sale_price = xmlProduct.price;
  }

  // Images — sanitized names and alt texts, NO supplier references
  if (syncImages && sanitized.images.length > 0) {
    wcProduct.images = sanitized.images;
  }

  // GTIN meta
  if (xmlProduct.gtin) {
    const gtinValidation = validateGTIN(xmlProduct.gtin);
    const gtinValue = gtinValidation.corrected || (gtinValidation.valid ? xmlProduct.gtin : undefined);
    if (gtinValue) {
      wcProduct.meta_data = [
        { key: "_global_unique_id", value: gtinValue },
      ];
    }
  }

  return wcProduct;
}

/**
 * Fields to update on existing products (stock sync — fast).
 * NOTE: Price is NOT updated — only stock status changes after initial import.
 * Price is set once during product creation and remains fixed.
 */
function mapXMLToWCUpdate(xmlProduct: XMLProduct): Record<string, unknown> {
  return {
    stock_status: xmlProduct.stock_status,
  };
}

// ─── Main Sync Function ─────────────────────────────────

export async function runSync(options: SyncOptions = {}): Promise<SyncResult> {
  const {
    batchSize = 50,
    offset = 0,
    syncImages = false,
    dryRun = false,
    feedUrl,
  } = options;

  const startTime = Date.now();
  const errors: SyncError[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  logInfo(`Sync started: batch=${batchSize}, offset=${offset}, dryRun=${dryRun}, syncImages=${syncImages}`);

  // 1. Fetch and parse XML
  let allProducts: XMLProduct[];
  try {
    allProducts = await fetchAndParseXML(feedUrl);
    logInfo(`XML feed parsed: ${allProducts.length} total products`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logError(`XML fetch failed: ${msg}`);
    return {
      created: 0, updated: 0, skipped: 0, errors: [{ sku: "", message: msg, type: "parse" }],
      batchOffset: offset, batchSize, totalProducts: 0, hasMore: false,
      duration: Date.now() - startTime,
    };
  }

  // 2. Slice batch
  const batch = allProducts.slice(offset, offset + batchSize);
  logInfo(`Processing batch: ${batch.length} products (offset ${offset})`);

  // 3. Process each product
  for (const xmlProduct of batch) {
    try {
      // Check if SKU exists
      const existingId = await findProductBySKU(xmlProduct.sku);

      if (existingId) {
        // UPDATE existing product (stock/price only — fast)
        if (!dryRun) {
          const updateData = mapXMLToWCUpdate(xmlProduct);
          await wcAPI(`/products/${existingId}`, "PUT", updateData);
        }
        logProductUpdated(xmlProduct.sku, existingId);
        updated++;
      } else {
        // CREATE new product
        const categoryIds: number[] = [];
        for (const catName of xmlProduct.categories) {
          try {
            const catId = await getOrCreateCategory(catName);
            categoryIds.push(catId);
          } catch (catError) {
            logError(`Category creation failed for "${catName}": ${catError}`);
          }
        }

        if (!dryRun) {
          const wcData = mapXMLToWC(xmlProduct, categoryIds, syncImages);

          const result = (await wcAPI("/products", "POST", wcData)) as { id: number };
          logProductCreated(xmlProduct.sku, result.id);
        } else {
          logInfo(`[DRY RUN] Would create: ${xmlProduct.sku} - ${xmlProduct.title}`);
        }
        created++;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      logError(`Failed to sync ${xmlProduct.sku}: ${msg}`);
      errors.push({ sku: xmlProduct.sku, message: msg, type: "api" });
      skipped++;
    }
  }

  const duration = Date.now() - startTime;
  const hasMore = offset + batchSize < allProducts.length;

  logInfo(`Sync batch complete: created=${created}, updated=${updated}, skipped=${skipped}, errors=${errors.length}, duration=${duration}ms, hasMore=${hasMore}`);

  return {
    created, updated, skipped, errors,
    batchOffset: offset, batchSize,
    totalProducts: allProducts.length,
    hasMore,
    duration,
  };
}

/**
 * Run a stock-only sync (faster — only updates price/stock for existing products).
 */
export async function runStockSync(options: SyncOptions = {}): Promise<SyncResult> {
  const { batchSize = 100, offset = 0, feedUrl } = options;
  const startTime = Date.now();
  const errors: SyncError[] = [];
  let updated = 0;
  let skipped = 0;

  logInfo(`Stock sync started: batch=${batchSize}, offset=${offset}`);

  let allProducts: XMLProduct[];
  try {
    allProducts = await fetchAndParseXML(feedUrl);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logError(`XML fetch failed: ${msg}`);
    return {
      created: 0, updated: 0, skipped: 0, errors: [{ sku: "", message: msg, type: "parse" }],
      batchOffset: offset, batchSize, totalProducts: 0, hasMore: false,
      duration: Date.now() - startTime,
    };
  }

  const batch = allProducts.slice(offset, offset + batchSize);

  for (const xmlProduct of batch) {
    try {
      const existingId = await findProductBySKU(xmlProduct.sku);
      if (existingId) {
        await wcAPI(`/products/${existingId}`, "PUT", mapXMLToWCUpdate(xmlProduct));
        updated++;
      } else {
        skipped++; // New product — skip in stock sync
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      errors.push({ sku: xmlProduct.sku, message: msg, type: "api" });
      skipped++;
    }
  }

  const duration = Date.now() - startTime;
  const hasMore = offset + batchSize < allProducts.length;

  logInfo(`Stock sync complete: updated=${updated}, skipped=${skipped}, duration=${duration}ms`);

  return {
    created: 0, updated, skipped, errors,
    batchOffset: offset, batchSize,
    totalProducts: allProducts.length, hasMore, duration,
  };
}

/**
 * Parse XML from string (for testing without fetching).
 */
export async function runSyncFromXML(
  xmlString: string,
  options: SyncOptions = {}
): Promise<SyncResult> {
  const products = parseXMLProducts(xmlString);
  const startTime = Date.now();
  const { batchSize = 50, offset = 0, dryRun = false } = options;
  const errors: SyncError[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  const batch = products.slice(offset, offset + batchSize);

  for (const xmlProduct of batch) {
    try {
      const existingId = await findProductBySKU(xmlProduct.sku);
      if (existingId) {
        if (!dryRun) {
          await wcAPI(`/products/${existingId}`, "PUT", mapXMLToWCUpdate(xmlProduct));
        }
        updated++;
      } else {
        const categoryIds: number[] = [];
        for (const catName of xmlProduct.categories) {
          try { categoryIds.push(await getOrCreateCategory(catName)); } catch { /* */ }
        }
        if (!dryRun) {
          const wcData = mapXMLToWC(xmlProduct, categoryIds, false);
          await wcAPI("/products", "POST", wcData);
        }
        created++;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      errors.push({ sku: xmlProduct.sku, message: msg, type: "api" });
      skipped++;
    }
  }

  return {
    created, updated, skipped, errors,
    batchOffset: offset, batchSize,
    totalProducts: products.length,
    hasMore: offset + batchSize < products.length,
    duration: Date.now() - startTime,
  };
}
