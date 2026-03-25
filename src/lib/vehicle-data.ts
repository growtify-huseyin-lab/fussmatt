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
 * Known car brands — used to correctly split "Brand Model Years" strings.
 * Multi-word brands (Alfa Romeo, Land Rover) MUST come before single-word
 * variants so the longest match wins.
 */
const KNOWN_BRANDS: string[] = [
  "Alfa Romeo", "Aston Martin", "Land Rover", "Mercedes Benz", "Mercedes-Benz",
  "Rolls Royce", "Rolls-Royce", "Great Wall",
  "Aiways", "Alfa", "Alpine", "Audi", "BMW", "BYD", "Bentley", "Cadillac",
  "Chevrolet", "Chrysler", "Citroen", "Citro&#235;n", "Cupra", "DS",
  "Dacia", "Daewoo", "Daihatsu", "Dodge", "FAW", "Ferrari", "Fiat", "Ford",
  "Genesis", "Honda", "Hummer", "Hyundai", "Infiniti", "Isuzu", "Iveco",
  "Jaguar", "Jeep", "Kia", "Lada", "Lamborghini", "Lancia", "Lexus",
  "Lincoln", "Lotus", "MAN", "MG", "MINI", "Maserati", "Mazda", "McLaren",
  "Mercedes", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Polestar",
  "Porsche", "Renault", "Rover", "Saab", "Seat", "SEAT", "Skoda",
  "Smart", "SsangYong", "Subaru", "Suzuki", "Tesla", "Toyota",
  "Volkswagen", "Volvo", "VW", "DAF", "Scania", "MAN", "Iveco",
];

/**
 * Parse a vehicle attribute string into brand + model + years.
 * Examples:
 *   "BMW 3er (G20) 2019-2025" &#8594; { brand: "BMW", model: "3er (G20)", years: "2019-2025" }
 *   "VW Golf 8 (CD) 2020-2025" &#8594; { brand: "VW", model: "Golf 8 (CD)", years: "2020-2025" }
 *   "Alfa Romeo Giulietta Baujahr ab 2013" &#8594; { brand: "Alfa Romeo", model: "Giulietta", years: "Baujahr ab 2013" }
 */
export function parseVehicleString(str: string): {
  brand: string;
  model: string;
  years: string;
} | null {
  const trimmed = str.trim();
  if (!trimmed) return null;

  // 1. Try known brands (longest match first)
  let matchedBrand = "";
  const lower = trimmed.toLowerCase();
  for (const b of KNOWN_BRANDS) {
    const bLower = b.toLowerCase();
    if (lower.startsWith(bLower + " ") || lower === bLower) {
      if (b.length > matchedBrand.length) {
        matchedBrand = b;
      }
    }
  }

  if (!matchedBrand) {
    // Fallback: first word is brand
    const spaceIdx = trimmed.indexOf(" ");
    if (spaceIdx === -1) return null;
    matchedBrand = trimmed.substring(0, spaceIdx);
  }

  // Use original casing from input for brand
  const brandFromInput = trimmed.substring(0, matchedBrand.length);
  const rest = trimmed.substring(matchedBrand.length).trim();
  if (!rest) return null;

  // 2. Extract years from the end
  const yearsPatterns = [
    /\b(Baujahr\s+ab\s+\d{4})$/i,
    /\b(ab\s+Baujahr\s+\d{4})$/i,
    /\b(ab\s+\d{4})$/i,
    /\b(\d{4}\s*[-\u2013]\s*\d{4})$/,
    /\b(seit\s+\d{4})$/i,
  ];

  let years = "";
  let modelPart = rest;

  for (const pattern of yearsPatterns) {
    const ym = rest.match(pattern);
    if (ym) {
      years = ym[1].trim();
      modelPart = rest.substring(0, rest.length - ym[0].length).trim();
      break;
    }
  }

  // Clean up model name (remove trailing parentheses if empty)
  modelPart = modelPart.replace(/\(\s*\)\s*$/, "").trim();

  if (!modelPart) return null;

  return { brand: brandFromInput, model: modelPart, years };
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
    // Build auth params
    const authHeaders: Record<string, string> = {};
    const authParams: Record<string, string> = {};
    if (WP_USER && WP_PASS) {
      authHeaders["Authorization"] = `Basic ${Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64")}`;
    } else if (WC_KEY && WC_SECRET) {
      authParams["consumer_key"] = WC_KEY;
      authParams["consumer_secret"] = WC_SECRET;
    }

    // Paginate through all products to build complete hierarchy
    const vehicleStrings: string[] = [];
    let page = 1;
    const maxPages = 15; // safety limit

    while (page <= maxPages) {
      const url = new URL(`${WP_URL}/wp-json/wc/v3/products`);
      url.searchParams.set("per_page", "100");
      url.searchParams.set("page", String(page));
      url.searchParams.set("status", "publish");
      for (const [k, v] of Object.entries(authParams)) {
        url.searchParams.set(k, v);
      }

      const res = await fetch(url.toString(), {
        headers: authHeaders,
        next: { revalidate: 3600 },
      });

      if (!res.ok) break;

      const products = (await res.json()) as Array<{
        attributes: Array<{ name: string; options: string[] }>;
      }>;

      if (products.length === 0) break;

      for (const product of products) {
        const fahrzeugAttr = product.attributes.find(
          (a) => a.name.toLowerCase() === "fahrzeug" || a.name.toLowerCase() === "vehicle"
        );
        if (fahrzeugAttr?.options) {
          vehicleStrings.push(...fahrzeugAttr.options);
        }
      }

      if (products.length < 100) break;
      page++;
    }

    return buildVehicleHierarchy(vehicleStrings);
  } catch {
    return [];
  }
}
