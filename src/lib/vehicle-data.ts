/**
 * Vehicle Data — Brand → Model → Year mapping
 *
 * This is populated from WooCommerce product attributes.
 * The "Fahrzeug" attribute contains entries like:
 *   "BMW 3er (G20) 2019-2025"
 *   "VW Golf 8 (CD) 2020-2025"
 *
 * We parse these into a structured hierarchy for the filter.
 * In production this will be auto-generated from the imported products.
 */

export interface VehicleBrand {
  name: string;
  slug: string;
  models: VehicleModel[];
}

export interface VehicleModel {
  name: string;          // "3er (G20)"
  slug: string;
  years: string;         // "2019-2025"
  fullName: string;      // "BMW 3er (G20) 2019-2025"
}

/**
 * Parse a vehicle attribute string into brand + model + years.
 * Examples:
 *   "BMW 3er (G20) 2019-2025" → { brand: "BMW", model: "3er (G20)", years: "2019-2025" }
 *   "VW Golf 8 (CD) 2020-2025" → { brand: "VW", model: "Golf 8 (CD)", years: "2020-2025" }
 */
export function parseVehicleString(str: string): {
  brand: string;
  model: string;
  years: string;
} | null {
  // Match pattern: "Brand ModelName (Code) YYYY-YYYY" or "Brand ModelName YYYY-YYYY"
  const match = str.match(/^([A-Za-z\-]+(?:\s[A-Za-z\-]+)?)\s+(.+?)\s+(\d{4}[-–]\d{4}|\w+\s\d{4})$/);
  if (match) {
    return { brand: match[1].trim(), model: match[2].trim(), years: match[3].trim() };
  }

  // Try simpler pattern: "Brand Rest"
  const simpleMatch = str.match(/^([A-Za-z\-]+)\s+(.+)$/);
  if (simpleMatch) {
    const yearsMatch = simpleMatch[2].match(/(\d{4}[-–]\d{4}|\w+\s\d{4})$/);
    if (yearsMatch) {
      const model = simpleMatch[2].replace(yearsMatch[0], "").trim();
      return { brand: simpleMatch[1], model, years: yearsMatch[0] };
    }
    return { brand: simpleMatch[1], model: simpleMatch[2], years: "" };
  }

  return null;
}

/**
 * Build brand→model hierarchy from product attributes.
 * Call this with the "Fahrzeug" attribute values from all products.
 */
export function buildVehicleHierarchy(vehicleStrings: string[]): VehicleBrand[] {
  const brandMap = new Map<string, Map<string, VehicleModel>>();

  for (const str of vehicleStrings) {
    const parsed = parseVehicleString(str);
    if (!parsed) continue;

    if (!brandMap.has(parsed.brand)) {
      brandMap.set(parsed.brand, new Map());
    }

    const models = brandMap.get(parsed.brand)!;
    const modelKey = `${parsed.model} ${parsed.years}`;

    if (!models.has(modelKey)) {
      models.set(modelKey, {
        name: parsed.model,
        slug: slugify(`${parsed.brand}-${parsed.model}-${parsed.years}`) || `${slugify(parsed.brand)}-${Date.now()}`,
        years: parsed.years,
        fullName: str,
      });
    }
  }

  // Sort brands alphabetically, ensure unique slugs
  const brands: VehicleBrand[] = [];
  const sortedBrands = [...brandMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const usedBrandSlugs = new Set<string>();

  for (const [brandName, models] of sortedBrands) {
    let brandSlug = slugify(brandName);
    if (usedBrandSlugs.has(brandSlug)) {
      brandSlug = `${brandSlug}-${usedBrandSlugs.size}`;
    }
    usedBrandSlugs.add(brandSlug);

    // Deduplicate model slugs
    const usedModelSlugs = new Set<string>();
    const uniqueModels: VehicleModel[] = [];
    for (const m of [...models.values()].sort((a, b) => a.name.localeCompare(b.name))) {
      let mSlug = m.slug;
      if (usedModelSlugs.has(mSlug)) {
        mSlug = `${mSlug}-${usedModelSlugs.size}`;
      }
      usedModelSlugs.add(mSlug);
      uniqueModels.push({ ...m, slug: mSlug });
    }

    brands.push({ name: brandName, slug: brandSlug, models: uniqueModels });
  }

  return brands;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Fetch vehicle hierarchy from WooCommerce products.
 */
export async function fetchVehicleHierarchy(): Promise<VehicleBrand[]> {
  const WP_URL = process.env.WORDPRESS_URL;
  if (!WP_URL) return [];
  const WC_KEY = process.env.WC_CONSUMER_KEY || "";
  const WC_SECRET = process.env.WC_CONSUMER_SECRET || "";
  const WP_USER = process.env.WP_APPLICATION_USER || "";
  const WP_PASS = process.env.WP_APPLICATION_PASSWORD || "";

  try {
    // Build URL with auth
    const url = new URL(`${WP_URL}/wp-json/wc/v3/products?per_page=100&status=publish`);
    const headers: Record<string, string> = {};
    if (WP_USER && WP_PASS) {
      headers["Authorization"] = `Basic ${Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64")}`;
    } else if (WC_KEY && WC_SECRET) {
      url.searchParams.set("consumer_key", WC_KEY);
      url.searchParams.set("consumer_secret", WC_SECRET);
    }

    const res = await fetch(url.toString(), {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const products = (await res.json()) as Array<{
      attributes: Array<{ name: string; options: string[] }>;
    }>;

    const vehicleStrings: string[] = [];
    for (const product of products) {
      const fahrzeugAttr = product.attributes.find(
        (a) => a.name.toLowerCase() === "fahrzeug" || a.name.toLowerCase() === "vehicle"
      );
      if (fahrzeugAttr?.options) {
        vehicleStrings.push(...fahrzeugAttr.options);
      }
    }

    return buildVehicleHierarchy(vehicleStrings);
  } catch {
    return [];
  }
}
