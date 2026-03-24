/**
 * CSV Product Importer
 *
 * Imports products from MyFussmatten CSV export into WooCommerce.
 *
 * Rules:
 * - CSV = master data source (descriptions, GTIN, attributes, price)
 * - Price = CSV price + 9 CHF markup
 * - All "MyFußmatten" references → "FussMatt"
 * - SKU-based matching (create or update)
 * - XML feed (separate) only updates stock status
 */

import { sanitizeText } from "./brand-sanitizer";
import { validateGTIN } from "./gtin";
import { logInfo, logError, logProductCreated, logProductUpdated } from "./logger";
import type { SyncResult, SyncError } from "./types";

const WP_URL = process.env.WORDPRESS_URL || "http://fussmatt.local";
const WP_USER = process.env.WP_APPLICATION_USER || "";
const WP_PASS = process.env.WP_APPLICATION_PASSWORD || "";
const AUTH_HEADER = `Basic ${Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64")}`;

const PRICE_MARKUP_CHF = 9; // +9 CHF on all products

// ─── WC API ─────────────────────────────────────────────

async function wcAPI(endpoint: string, method = "GET", body?: Record<string, unknown>) {
  const res = await fetch(`${WP_URL}/wp-json/wc/v3${endpoint}`, {
    method,
    headers: { Authorization: AUTH_HEADER, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WC API ${method} ${endpoint}: ${res.status} ${err.slice(0, 200)}`);
  }
  return res.json();
}

async function findProductBySKU(sku: string): Promise<number | null> {
  try {
    const products = await wcAPI(`/products?sku=${encodeURIComponent(sku)}&per_page=1`) as Array<{ id: number }>;
    return Array.isArray(products) && products.length > 0 ? products[0].id : null;
  } catch { return null; }
}

const categoryCache = new Map<string, number>();
async function getOrCreateCategory(name: string): Promise<number> {
  if (categoryCache.has(name)) return categoryCache.get(name)!;
  try {
    const cats = await wcAPI(`/products/categories?search=${encodeURIComponent(name)}&per_page=5`) as Array<{ id: number; name: string }>;
    const exact = cats.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exact) { categoryCache.set(name, exact.id); return exact.id; }
  } catch { /* continue */ }
  const created = await wcAPI("/products/categories", "POST", { name }) as { id: number };
  categoryCache.set(name, created.id);
  return created.id;
}

// ─── CSV Row Interface ──────────────────────────────────

export interface CSVProductRow {
  Sku: string;
  Title: string;
  Content: string;
  "Short Description": string;
  "Global Unique Id": string;
  Price: string;
  "Regular Price": string;
  "Sale Price": string;
  "Stock Status": string;
  "Attribute Value (pa_marke)": string;
  "Attribute Value (pa_modell)": string;
  "Attribute Value (pa_jahr)": string;
  "Attribute Value (pa_years)": string;
  "Attribute Value (pa_material)": string;
  "Attribute Value (pa_passgenau)": string;
  "Attribute Value (pa_location)": string;
  "Attribute Value (pa_gewicht-in-kg)": string;
  "Attribute Value (pa_typ)": string;
  "Attribute Value (pa_color)": string;
  "Product categories": string;
  "Image URL": string;
  "Image Alt Text": string;
  Weight: string;
  [key: string]: string;
}

// ─── Price Calculation ──────────────────────────────────

function calculatePrice(csvPrice: string): string {
  const price = parseFloat(csvPrice) || 0;
  if (price <= 0) return "0";
  return (price + PRICE_MARKUP_CHF).toFixed(2);
}

// ─── Map CSV Row to WC Product ──────────────────────────

function mapCSVToWC(row: CSVProductRow, categoryIds: number[], syncImages: boolean) {
  const title = sanitizeText(row.Title || "");
  const description = sanitizeText(row.Content || "");
  const shortDescription = sanitizeText(row["Short Description"] || "");

  // Price with +9 CHF markup — use "Regular Price" and "Sale Price" fields
  const csvRegular = row["Regular Price"]?.trim() || row.Price?.trim() || "0";
  const csvSale = row["Sale Price"]?.trim() || "";
  const regularPrice = calculatePrice(csvRegular);
  const salePrice = csvSale ? calculatePrice(csvSale) : "";

  // Attributes — only use real values (filter out "yes"/"no" meta values)
  const attributes: { name: string; visible: boolean; options: string[] }[] = [];

  function addAttr(name: string, rawValue: string | undefined) {
    const val = rawValue?.trim();
    // Skip empty, "yes", "no", pure numbers that look like IDs
    if (!val || val === "yes" || val === "no" || /^\d{1,3}$/.test(val)) return;
    attributes.push({ name, visible: true, options: [val] });
  }

  const marke = row["Attribute Value (pa_marke)"]?.trim();
  const modell = row["Attribute Value (pa_modell)"]?.trim();
  const kompatibilitat = row["Attribute Value (pa_kompatibilitat)"]?.trim();

  // Use kompatibilitat as model if pa_modell is just "yes"
  const realMarke = (marke && marke !== "yes" && marke !== "no") ? marke : undefined;
  const realModell = (modell && modell !== "yes" && modell !== "no") ? modell
    : (kompatibilitat && kompatibilitat !== "yes") ? kompatibilitat : undefined;

  if (realMarke) attributes.push({ name: "Marke", visible: true, options: [realMarke] });
  if (realModell) attributes.push({ name: "Modell", visible: true, options: [realModell] });

  attributes.push({ name: "Material", visible: true, options: ["TPE"] });

  addAttr("Passgenau", row["Attribute Value (pa_passgenau)"]);
  addAttr("Qualit\u00e4t", row["Attribute Value (pa_qualitat)"]);

  // Build Fahrzeug attribute for vehicle filter
  if (realMarke || realModell) {
    // Parse vehicle info from title as fallback
    const titleMatch = title.match(/passend\s+f[u\u00fc]r\s+(.+?)(?:\s+Baujahr\s+(.+))?$/i);
    const vehicle = titleMatch ? titleMatch[1].trim() : (realModell || realMarke || "");
    const baujahr = titleMatch ? titleMatch[2]?.trim() || "" : "";
    const fullVehicle = baujahr ? `${vehicle} ${baujahr}` : vehicle;
    if (fullVehicle) attributes.push({ name: "Fahrzeug", visible: true, options: [fullVehicle] });
  }

  const wcProduct: Record<string, unknown> = {
    name: title,
    type: "simple",
    sku: row.Sku,
    regular_price: regularPrice,
    stock_status: (row["Stock Status"] || "instock").toLowerCase().includes("instock") ? "instock" : "outofstock",
    manage_stock: false,
    weight: row.Weight || "",
    status: "publish",
    categories: categoryIds.map((id) => ({ id })),
    attributes,
    description,
    short_description: shortDescription,
  };

  if (salePrice && salePrice !== regularPrice) {
    wcProduct.sale_price = salePrice;
  }

  // Images
  if (syncImages && row["Image URL"]) {
    const imageUrls = row["Image URL"].split("|").map((u) => u.trim()).filter(Boolean);
    const altTexts = (row["Image Alt Text"] || "").split("|").map((a) => sanitizeText(a.trim()));
    wcProduct.images = imageUrls.map((src, i) => ({
      src,
      name: `fussmatt-${row.Sku.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${i + 1}`,
      alt: altTexts[i] || `${title} | FussMatt`,
    }));
  }

  // GTIN — WooCommerce uses "global_unique_id" as a top-level field (not meta_data)
  const gtin = row["Global Unique Id"]?.trim();
  if (gtin) {
    const validation = validateGTIN(gtin);
    const gtinValue = validation.corrected || (validation.valid ? gtin : undefined);
    if (gtinValue) {
      wcProduct.global_unique_id = gtinValue;
    }
  }

  return wcProduct;
}

// ─── Main CSV Import ────────────────────────────────────

export interface CSVImportOptions {
  batchSize?: number;
  offset?: number;
  dryRun?: boolean;
  syncImages?: boolean;
}

export async function importFromCSV(
  rows: CSVProductRow[],
  options: CSVImportOptions = {}
): Promise<SyncResult> {
  const { batchSize = 50, offset = 0, dryRun = false, syncImages = false } = options;
  const startTime = Date.now();
  const errors: SyncError[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  // Filter to only products with SKU
  const validRows = rows.filter((r) => r.Sku?.trim());
  const batch = validRows.slice(offset, offset + batchSize);

  logInfo(`CSV import started: batch=${batchSize}, offset=${offset}, total=${validRows.length}, dryRun=${dryRun}`);

  for (const row of batch) {
    try {
      const sku = row.Sku.trim();

      // Parse categories
      const categoryNames = (row["Product categories"] || "")
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      const categoryIds: number[] = [];
      for (const catName of categoryNames) {
        try { categoryIds.push(await getOrCreateCategory(catName)); } catch { /* skip */ }
      }

      const existingId = await findProductBySKU(sku);

      if (existingId) {
        // Update existing product with full data from CSV
        if (!dryRun) {
          const wcData = mapCSVToWC(row, categoryIds, syncImages);
          delete wcData.sku; // Don't update SKU
          await wcAPI(`/products/${existingId}`, "PUT", wcData);
        }
        logProductUpdated(sku, existingId);
        updated++;
      } else {
        // Create new product
        if (!dryRun) {
          const wcData = mapCSVToWC(row, categoryIds, syncImages);
          const result = await wcAPI("/products", "POST", wcData) as { id: number };
          logProductCreated(sku, result.id);
        } else {
          logInfo(`[DRY RUN] Would create: ${sku} - ${sanitizeText(row.Title)} - Price: ${calculatePrice(row["Regular Price"] || row.Price)}`);
        }
        created++;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      logError(`CSV import failed for ${row.Sku}: ${msg}`);
      errors.push({ sku: row.Sku, message: msg, type: "api" });
      skipped++;
    }
  }

  const duration = Date.now() - startTime;
  const hasMore = offset + batchSize < validRows.length;

  logInfo(`CSV import batch done: created=${created}, updated=${updated}, skipped=${skipped}, errors=${errors.length}, hasMore=${hasMore}, duration=${duration}ms`);

  return {
    created, updated, skipped, errors,
    batchOffset: offset, batchSize,
    totalProducts: validRows.length, hasMore, duration,
  };
}
