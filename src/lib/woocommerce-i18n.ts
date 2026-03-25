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

// ─── Categories (pass-through for now) ──────────────────
// Category translations can be added to the store later.

export async function getLocalizedCategories(
  locale: Locale,
  params: Record<string, string | number> = {}
): Promise<WCCategory[]> {
  // TODO: Apply category translations when store supports it
  void locale;
  return getCategories(params);
}

export async function getLocalizedCategoryBySlug(
  locale: Locale,
  slug: string
): Promise<WCCategory | null> {
  void locale;
  return getCategoryBySlug(slug);
}

// ─── Variations (pass-through) ──────────────────────────
// Variation names are typically attribute values — translated via product attributes.

export { getProductVariations } from "./woocommerce";
