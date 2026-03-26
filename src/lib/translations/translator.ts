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
  if (translation) return applyTranslation(product, translation);

  // No stored translation — apply automatic term replacement
  return autoTranslateProduct(product, locale);
}

/**
 * Apply translations to a batch of products.
 */
export function translateProducts(products: WCProduct[], locale: Locale): WCProduct[] {
  if (locale === "de") return products;
  return products.map((p) => translateProduct(p, locale));
}

// ─── Automatic term-based translation ─────────────────
// Replaces common German terms in product names/descriptions
// when no stored translation exists.

const TERM_DICT: Record<string, Record<string, string>> = {
  en: {
    "Fussmatten": "Floor Mats", "Fussmatten-Set": "Floor Mat Set", "Fussmatte": "Floor Mat",
    "Kofferraummatte": "Trunk Mat", "Kofferraummatten": "Trunk Mats",
    "Kofferraummatten Set": "Trunk Mat Set", "Kofferraummatte Set": "Trunk Mat Set",
    "Fuss-und Kofferraummatten Set": "Floor & Trunk Mat Set",
    "Fuss- und Kofferraummatten Set": "Floor & Trunk Mat Set",
    "Auto Fussmatten": "Car Floor Mats", "Auto-Fussmatten": "Car Floor Mats",
    "LKW Fussmatten": "Truck Floor Mats", "LKW-Fussmatten": "Truck Floor Mats",
    "Premium Auto Fussmatten": "Premium Car Floor Mats",
    "TPE Set": "TPE Set", "TPE": "TPE",
    "passend f\u00fcr": "compatible with", "Passend f\u00fcr": "Compatible with",
    "Passend F\u00fcr": "Compatible with",
    "Baujahr ab": "from year", "Baujahr": "year",
    "aus hochwertigem": "made of premium",
    "Unkategorisiert": "Uncategorized",
    "Ladekantenschutz": "Loading Edge Protection",
    "Befestigungsclips": "Fastening Clips",
    "Klebeband": "Adhesive Tape",
    "Mittelarmlehne": "Center Armrest",
    "Universal": "Universal",
  },
  fr: {
    "Fussmatten": "Tapis de sol", "Fussmatte": "Tapis de sol",
    "Kofferraummatte": "Tapis de coffre", "Kofferraummatten": "Tapis de coffre",
    "Fuss-und Kofferraummatten Set": "Set tapis de sol et coffre",
    "Fuss- und Kofferraummatten Set": "Set tapis de sol et coffre",
    "Auto Fussmatten": "Tapis de sol auto", "Auto-Fussmatten": "Tapis de sol auto",
    "LKW Fussmatten": "Tapis de sol camion",
    "Premium Auto Fussmatten": "Tapis de sol auto premium",
    "passend f\u00fcr": "compatible avec", "Passend f\u00fcr": "Compatible avec",
    "Passend F\u00fcr": "Compatible avec",
    "Baujahr ab": "\u00e0 partir de", "Baujahr": "ann\u00e9e",
    "aus hochwertigem": "en mat\u00e9riau premium",
    "Unkategorisiert": "Non cat\u00e9goris\u00e9",
    "Ladekantenschutz": "Protection de seuil de chargement",
    "Befestigungsclips": "Clips de fixation",
    "Klebeband": "Ruban adh\u00e9sif",
    "Universal": "Universel",
  },
  it: {
    "Fussmatten": "Tappetini", "Fussmatte": "Tappetino",
    "Kofferraummatte": "Tappetino bagagliaio", "Kofferraummatten": "Tappetini bagagliaio",
    "Fuss-und Kofferraummatten Set": "Set tappetini e bagagliaio",
    "Fuss- und Kofferraummatten Set": "Set tappetini e bagagliaio",
    "Auto Fussmatten": "Tappetini auto", "Auto-Fussmatten": "Tappetini auto",
    "LKW Fussmatten": "Tappetini camion",
    "Premium Auto Fussmatten": "Tappetini auto premium",
    "passend f\u00fcr": "compatibile con", "Passend f\u00fcr": "Compatibile con",
    "Passend F\u00fcr": "Compatibile con",
    "Baujahr ab": "dall'anno", "Baujahr": "anno",
    "aus hochwertigem": "in materiale premium",
    "Unkategorisiert": "Non categorizzato",
    "Ladekantenschutz": "Protezione bordo di carico",
    "Befestigungsclips": "Clip di fissaggio",
    "Universal": "Universale",
  },
  nl: {
    "Fussmatten": "Vloermatten", "Fussmatte": "Vloermat",
    "Kofferraummatte": "Kofferbakmat", "Kofferraummatten": "Kofferbakmatten",
    "Fuss-und Kofferraummatten Set": "Vloer- en kofferbakmattenset",
    "Fuss- und Kofferraummatten Set": "Vloer- en kofferbakmattenset",
    "Auto Fussmatten": "Automatten", "Auto-Fussmatten": "Automatten",
    "LKW Fussmatten": "Vrachtwagen vloermatten",
    "Premium Auto Fussmatten": "Premium automatten",
    "passend f\u00fcr": "passend voor", "Passend f\u00fcr": "Passend voor",
    "Passend F\u00fcr": "Passend voor",
    "Baujahr ab": "bouwjaar vanaf", "Baujahr": "bouwjaar",
    "aus hochwertigem": "van hoogwaardig",
    "Unkategorisiert": "Niet gecategoriseerd",
    "Ladekantenschutz": "Laaddrempelbescherming",
    "Befestigungsclips": "Bevestigingsclips",
    "Universal": "Universeel",
  },
};

/** Replace known German terms in a text string */
function autoTranslateText(text: string, locale: string): string {
  const dict = TERM_DICT[locale];
  if (!dict) return text;
  let result = text;
  // Sort keys by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const de of sortedKeys) {
    result = result.split(de).join(dict[de]);
  }
  return result;
}

/** Auto-translate product using term dictionary */
function autoTranslateProduct(product: WCProduct, locale: Locale): WCProduct {
  const loc = locale as string;
  if (!TERM_DICT[loc]) return product;

  return {
    ...product,
    name: autoTranslateText(product.name, loc),
    description: autoTranslateText(product.description, loc),
    short_description: autoTranslateText(product.short_description, loc),
    categories: product.categories.map((cat) => ({
      ...cat,
      name: autoTranslateText(cat.name, loc),
    })),
  };
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
