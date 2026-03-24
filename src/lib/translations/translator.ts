import type { WCProduct } from "@/types/woocommerce";
import type { TranslatableProductFields } from "./types";
import type { Locale } from "@/i18n/config";
import { getProductTranslation } from "./store";

/**
 * Apply stored translations to a WooCommerce product.
 *
 * - If locale is "de", returns the product as-is (source language).
 * - If a translation exists, merges translated fields into the product.
 * - If no translation exists, returns the original German product (fallback).
 *
 * This is a pure function — it does NOT mutate the original product.
 */
export function translateProduct(product: WCProduct, locale: Locale): WCProduct {
  if (locale === "de") return product;

  const translation = getProductTranslation(product.id, locale);
  if (!translation) return product; // fallback to German

  return applyTranslation(product, translation);
}

/**
 * Apply translations to a batch of products.
 */
export function translateProducts(products: WCProduct[], locale: Locale): WCProduct[] {
  if (locale === "de") return products;
  return products.map((p) => translateProduct(p, locale));
}

/**
 * Merge translated fields into a product object.
 */
function applyTranslation(
  product: WCProduct,
  translation: TranslatableProductFields
): WCProduct {
  const translated = { ...product };

  // Core fields
  if (translation.name) translated.name = translation.name;
  if (translation.description) translated.description = translation.description;
  if (translation.short_description) translated.short_description = translation.short_description;

  // Categories
  if (translation.categories) {
    translated.categories = product.categories.map((cat) => ({
      ...cat,
      name: translation.categories?.[cat.id] ?? cat.name,
    }));
  }

  // Attributes
  if (translation.attributes) {
    translated.attributes = product.attributes.map((attr) => {
      const attrTranslation = translation.attributes?.[attr.id];
      if (!attrTranslation) return attr;
      return {
        ...attr,
        name: attrTranslation.name || attr.name,
        options: attrTranslation.options?.length ? attrTranslation.options : attr.options,
      };
    });
  }

  return translated;
}

/**
 * Extract translatable fields from a product (for sending to a translation service).
 */
export function extractTranslatableFields(product: WCProduct): TranslatableProductFields {
  return {
    name: product.name,
    description: product.description,
    short_description: product.short_description,
    categories: Object.fromEntries(
      product.categories.map((c) => [c.id, c.name])
    ),
    attributes: Object.fromEntries(
      product.attributes.map((a) => [a.id, { name: a.name, options: a.options }])
    ),
  };
}

/**
 * Strip HTML tags for translation (some translation APIs work better with plain text).
 * Preserves the HTML structure for later re-wrapping.
 */
export function stripHtmlForTranslation(html: string): {
  text: string;
  segments: { placeholder: string; original: string }[];
} {
  const segments: { placeholder: string; original: string }[] = [];
  let counter = 0;

  // Replace HTML tags with placeholders
  const text = html.replace(/<[^>]+>/g, (match) => {
    const placeholder = `{{TAG_${counter++}}}`;
    segments.push({ placeholder, original: match });
    return placeholder;
  });

  return { text, segments };
}

/**
 * Restore HTML tags after translation.
 */
export function restoreHtmlAfterTranslation(
  translatedText: string,
  segments: { placeholder: string; original: string }[]
): string {
  let result = translatedText;
  for (const seg of segments) {
    result = result.replace(seg.placeholder, seg.original);
  }
  return result;
}
