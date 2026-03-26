/**
 * Locale-aware WooCommerce API.
 *
 * This wraps the base WC API and applies product translations
 * based on the current locale.
 *
 * Usage in server components:
 *   import { getLocalizedProducts } from "@/lib/woocommerce-i18n";
 *   const products = await getLocalizedProducts("en", { per_page: 20 });
 */

import type { Locale } from "@/i18n/config";
import type { WCProduct, WCCategory } from "@/types/woocommerce";
import {
  getProducts,
  getProductsWithTotal,
  getProductBySlug,
  getProductById,
  getProductVariations,
  getCategories,
  getCategoryBySlug,
  searchProducts,
} from "./woocommerce";
import { translateProduct, translateProducts } from "./translations";

// ─── Localized Products ─────────────────────────────────

/** Filter out products that have no images */
function withImages(products: WCProduct[]): WCProduct[] {
  return products.filter((p) => p.images && p.images.length > 0 && p.images[0].src);
}

export async function getLocalizedProducts(
  locale: Locale,
  params: Record<string, string | number> = {}
): Promise<WCProduct[]> {
  const products = await getProducts(params);
  return withImages(translateProducts(products, locale));
}

export async function getLocalizedProductsWithTotal(
  locale: Locale,
  params: Record<string, string | number> = {}
): Promise<{ products: WCProduct[]; total: number; totalPages: number }> {
  const { products, total, totalPages } = await getProductsWithTotal(params);
  return { products: withImages(translateProducts(products, locale)), total, totalPages };
}

export async function getLocalizedProductBySlug(
  locale: Locale,
  slug: string
): Promise<WCProduct | null> {
  const product = await getProductBySlug(slug);
  if (!product) return null;
  return translateProduct(product, locale);
}

export async function getLocalizedProductById(
  locale: Locale,
  id: number
): Promise<WCProduct> {
  const product = await getProductById(id);
  return translateProduct(product, locale);
}

export async function searchLocalizedProducts(
  locale: Locale,
  query: string
): Promise<WCProduct[]> {
  // Always search in German (source), then translate results
  const products = await searchProducts(query);
  return withImages(translateProducts(products, locale));
}

// ─── Category translations ──────────────────────────────

const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    "5D Fussmatten": "5D Floor Mats", "3D Fussmatten": "3D Floor Mats",
    "Kofferraummatte": "Trunk Mats", "Kofferraummatten": "Trunk Mats",
    "Fuss-und Kofferraummatten Set": "Floor & Trunk Mat Set",
    "Universal Fussmatten": "Universal Floor Mats",
    "Passend f\u00fcr LKW-Truck Fussmatten": "Truck Floor Mats",
    "Passend f\u00fcr Kleinbus Pickup Fussmatten": "Van & Pickup Floor Mats",
    "Ladekantenschutz": "Loading Edge Protection",
    "Befestigungsclips": "Fastening Clips",
    "Klebeband": "Adhesive Tape",
    "Mittelarmlehne": "Center Armrest",
    "Auto Marken": "Car Brands",
    "Unkategorisiert": "Uncategorized",
  },
  fr: {
    "5D Fussmatten": "Tapis de sol 5D", "3D Fussmatten": "Tapis de sol 3D",
    "Kofferraummatte": "Tapis de coffre", "Kofferraummatten": "Tapis de coffre",
    "Fuss-und Kofferraummatten Set": "Set tapis sol et coffre",
    "Universal Fussmatten": "Tapis de sol universels",
    "Passend f\u00fcr LKW-Truck Fussmatten": "Tapis camion",
    "Passend f\u00fcr Kleinbus Pickup Fussmatten": "Tapis fourgon et pickup",
    "Ladekantenschutz": "Protection seuil de chargement",
    "Befestigungsclips": "Clips de fixation",
    "Klebeband": "Ruban adh\u00e9sif",
    "Auto Marken": "Marques auto",
    "Unkategorisiert": "Non cat\u00e9goris\u00e9",
  },
  it: {
    "5D Fussmatten": "Tappetini 5D", "3D Fussmatten": "Tappetini 3D",
    "Kofferraummatte": "Tappetino bagagliaio", "Kofferraummatten": "Tappetini bagagliaio",
    "Fuss-und Kofferraummatten Set": "Set tappetini e bagagliaio",
    "Universal Fussmatten": "Tappetini universali",
    "Passend f\u00fcr LKW-Truck Fussmatten": "Tappetini camion",
    "Passend f\u00fcr Kleinbus Pickup Fussmatten": "Tappetini furgone e pickup",
    "Ladekantenschutz": "Protezione bordo di carico",
    "Befestigungsclips": "Clip di fissaggio",
    "Auto Marken": "Marche auto",
    "Unkategorisiert": "Non categorizzato",
  },
  nl: {
    "5D Fussmatten": "5D Vloermatten", "3D Fussmatten": "3D Vloermatten",
    "Kofferraummatte": "Kofferbakmat", "Kofferraummatten": "Kofferbakmatten",
    "Fuss-und Kofferraummatten Set": "Vloer- en kofferbakmattenset",
    "Universal Fussmatten": "Universele vloermatten",
    "Passend f\u00fcr LKW-Truck Fussmatten": "Vrachtwagen vloermatten",
    "Passend f\u00fcr Kleinbus Pickup Fussmatten": "Busje en pickup vloermatten",
    "Ladekantenschutz": "Laaddrempelbescherming",
    "Befestigungsclips": "Bevestigingsclips",
    "Auto Marken": "Automerken",
    "Unkategorisiert": "Niet gecategoriseerd",
  },
};

function translateCategory(cat: WCCategory, locale: Locale): WCCategory {
  if (locale === "de") return cat;
  const dict = CATEGORY_TRANSLATIONS[locale];
  if (!dict) return cat;
  return { ...cat, name: dict[cat.name] || cat.name };
}

export async function getLocalizedCategories(
  locale: Locale,
  params: Record<string, string | number> = {}
): Promise<WCCategory[]> {
  const categories = await getCategories(params);
  return categories.map((c) => translateCategory(c, locale));
}

export async function getLocalizedCategoryBySlug(
  locale: Locale,
  slug: string
): Promise<WCCategory | null> {
  const cat = await getCategoryBySlug(slug);
  if (!cat) return null;
  return translateCategory(cat, locale);
}

// ─── Variations (pass-through) ──────────────────────────
// Variation names are typically attribute values — translated via product attributes.

export { getProductVariations } from "./woocommerce";
