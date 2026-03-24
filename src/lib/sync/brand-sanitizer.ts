/**
 * Brand Sanitizer
 *
 * Removes ALL traces of supplier/competitor brands from product data.
 * Everything must appear as if it's FussMatt's own product.
 *
 * Cleaned brands:
 * - "fussmattenprofi" (B2B supplier)
 * - "MyFußmatten" / "myfussmatten.ch" (sister brand)
 * - Any URL references to other domains
 */

const SUPPLIER_PATTERNS = [
  // B2B supplier
  /fussmattenprofi/gi,
  /fussmatten\s*profi/gi,
  /fussmattenprofis/gi,
  /fussmatten-profi/gi,
  /mattenprofi/gi,
  // Sister brand — MyFußmatten
  /MyFu(?:ss|ß)matten/gi,
  /myfussmatten\.ch/gi,
  /myfußmatten\.ch/gi,
  /myfussmatten/gi,
  /myfußmatten/gi,
  /myfu(?:ss|ß)matten/gi,
  // Catch URLs
  /https?:\/\/(?:www\.)?myfussmatten\.ch\/?/gi,
  /beim\s+MyFu(?:ss|ß)matten!?/gi,
  /hier\s+beim\s+FussMatt!?/gi,  // cleanup after first pass
];

const BRAND_NAME = "FussMatt";
const BRAND_URL = "fussmatt.com";

/**
 * Sanitize a text string — remove all supplier references, replace with our brand.
 */
export function sanitizeText(text: string): string {
  let result = text;
  for (const pattern of SUPPLIER_PATTERNS) {
    result = result.replace(pattern, BRAND_NAME);
  }
  // Clean up domain references
  result = result.replace(/myfussmatten\.ch/gi, BRAND_URL);
  result = result.replace(/fussmattenprofi\.com/gi, BRAND_URL);
  // Clean double brand names from regex passes
  result = result.replace(/FussMatt\s*FussMatt/g, BRAND_NAME);
  // Clean "hier beim FussMatt!" → "hier bei FussMatt!"
  result = result.replace(/beim\s+FussMatt/g, "bei FussMatt");
  return result;
}

/**
 * Generate a clean, SEO-friendly image alt text from product title.
 * No supplier references, includes brand name.
 */
export function generateImageAlt(productTitle: string, index: number): string {
  const cleanTitle = sanitizeText(productTitle);
  if (index === 0) {
    return `${cleanTitle} | ${BRAND_NAME}`;
  }
  return `${cleanTitle} - Ansicht ${index + 1} | ${BRAND_NAME}`;
}

/**
 * Generate a clean image filename for SEO.
 * Used for the image "name" field in WooCommerce (affects alt/title attributes).
 */
export function generateImageName(sku: string, index: number): string {
  const cleanSku = sku.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return `fussmatt-${cleanSku}-${index + 1}`;
}

/**
 * Generate a product description from the title (since supplier provides none).
 * Creates a structured, SEO-friendly German description.
 */
export function generateDescription(title: string, category: string): string {
  const cleanTitle = sanitizeText(title);

  // Parse vehicle info from title
  // Example: "5D Premium Auto Fussmatten TPE Set passend für Mercedes CLA (1.Gen) Baujahr 2013-2018"
  const vehicleMatch = cleanTitle.match(/passend\s+f[u\u00fc]r\s+(.+?)(?:\s+Baujahr\s+(.+))?$/i);
  const vehicle = vehicleMatch ? vehicleMatch[1].trim() : "";
  const baujahr = vehicleMatch ? vehicleMatch[2]?.trim() || "" : "";

  const is5D = category.includes("5D") || cleanTitle.includes("5D");
  const isKofferraum = category.toLowerCase().includes("kofferraum") || cleanTitle.toLowerCase().includes("kofferraum");
  const isUniversal = category.toLowerCase().includes("universal");

  let desc = `<p>`;

  if (isKofferraum) {
    desc += `Premium Kofferraummatte aus hochwertigem TPE-Material`;
    if (vehicle) desc += ` f\u00fcr ${vehicle}`;
    if (baujahr) desc += ` (Baujahr ${baujahr})`;
    desc += `. Passgenaue Fertigung per 3D-Vermessung. Sch\u00fctzt Ihren Kofferraum zuverl\u00e4ssig vor Schmutz, Feuchtigkeit und Kratzern.</p>`;
  } else if (isUniversal) {
    desc += `Universelle Auto-Fussmatten aus TPE-Material. Anpassbare Gr\u00f6sse f\u00fcr verschiedene Fahrzeugmodelle. Wasserdicht und rutschfest.</p>`;
  } else {
    desc += `${is5D ? "Premium 5D" : "3D"} Auto-Fussmatten aus hochwertigem TPE-Material`;
    if (vehicle) desc += ` f\u00fcr ${vehicle}`;
    if (baujahr) desc += ` (Baujahr ${baujahr})`;
    desc += `. Millimetergenau gefertigt per 3D-Vermessung f\u00fcr perfekte Passform.</p>`;
  }

  // Add feature list
  desc += `<ul>`;
  desc += `<li>Material: TPE (Thermoplastisches Elastomer) \u2013 geruchlos &amp; umweltfreundlich</li>`;

  if (!isUniversal && vehicle) {
    desc += `<li>Passgenau f\u00fcr ${vehicle}${baujahr ? ` (${baujahr})` : ""}</li>`;
  }

  if (is5D) {
    desc += `<li>Erh\u00f6hte R\u00e4nder f\u00fcr maximalen Schutz (5D-Design)</li>`;
  } else if (!isKofferraum) {
    desc += `<li>3D-geformte R\u00e4nder f\u00fcr optimalen Schutz</li>`;
  }

  desc += `<li>Wasserdicht, rutschfest &amp; extrem langlebig</li>`;
  desc += `<li>Flexibel von -40\u00b0C bis +80\u00b0C</li>`;
  desc += `<li>Einfache Montage \u2013 ohne Zuschneiden</li>`;
  desc += `<li>100% recycelbar</li>`;
  desc += `</ul>`;

  return desc;
}

/**
 * Generate a short description from the title.
 */
export function generateShortDescription(title: string, category: string): string {
  const cleanTitle = sanitizeText(title);
  const is5D = category.includes("5D") || cleanTitle.includes("5D");
  const isKofferraum = category.toLowerCase().includes("kofferraum");

  const vehicleMatch = cleanTitle.match(/passend\s+f[u\u00fc]r\s+(.+?)(?:\s+Baujahr\s+(.+))?$/i);
  const vehicle = vehicleMatch ? vehicleMatch[1].trim() : "";

  if (isKofferraum) {
    return `Premium TPE Kofferraummatte${vehicle ? ` f\u00fcr ${vehicle}` : ""}. Passgenau, wasserdicht, rutschfest.`;
  }

  return `${is5D ? "Premium 5D" : "3D"} TPE Auto-Fussmatten${vehicle ? ` f\u00fcr ${vehicle}` : ""}. Passgenau, wasserdicht, langlebig.`;
}

/**
 * Rewrite product title — keep clean, remove any supplier traces, ensure FussMatt branding.
 */
export function sanitizeTitle(title: string): string {
  return sanitizeText(title);
}

/**
 * Full product sanitization — apply all cleanups.
 */
export function sanitizeProduct(product: {
  title: string;
  description?: string;
  short_description?: string;
  categories: string[];
  images: string[];
  sku: string;
}): {
  title: string;
  description: string;
  short_description: string;
  images: { src: string; name: string; alt: string }[];
} {
  const title = sanitizeTitle(product.title);
  const mainCategory = product.categories[0] || "";

  return {
    title,
    description: product.description
      ? sanitizeText(product.description)
      : generateDescription(title, mainCategory),
    short_description: product.short_description
      ? sanitizeText(product.short_description)
      : generateShortDescription(title, mainCategory),
    images: product.images.map((src, i) => ({
      src, // Keep original CDN URL — it must work
      name: generateImageName(product.sku, i),
      alt: generateImageAlt(title, i),
    })),
  };
}
