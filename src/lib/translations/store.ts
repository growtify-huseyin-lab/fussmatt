import fs from "fs";
import path from "path";
import type { TranslationStore, ProductTranslations, TranslatableProductFields } from "./types";
import type { Locale } from "@/i18n/config";

/**
 * JSON file-based translation store.
 *
 * Translations are persisted to disk so they survive server restarts.
 * In production this could be swapped for a DB or KV store.
 *
 * File location: <project>/data/product-translations.json
 */

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "product-translations.json");

// ─── Read / Write helpers ───────────────────────────────
// Cache the parsed store in memory (24 MB JSON, parse once)
let _cachedStore: TranslationStore | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): TranslationStore {
  if (_cachedStore) return _cachedStore;
  ensureDataDir();
  if (!fs.existsSync(STORE_PATH)) return {};
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    _cachedStore = JSON.parse(raw) as TranslationStore;
    return _cachedStore;
  } catch {
    return {};
  }
}

function writeStore(store: TranslationStore) {
  ensureDataDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

// ─── Public API ─────────────────────────────────────────

/**
 * Get all translations for a single product.
 */
export function getProductTranslations(productId: number): ProductTranslations | undefined {
  const store = readStore();
  return store[productId];
}

/**
 * Get a product's translated fields for a specific locale.
 * Returns `undefined` if no translation exists.
 */
export function getProductTranslation(
  productId: number,
  locale: Locale
): TranslatableProductFields | undefined {
  if (locale === "de") return undefined; // German is source
  const store = readStore();
  return store[productId]?.[locale as Exclude<Locale, "de">];
}

/**
 * Save (upsert) a translation for a product + locale.
 */
export function setProductTranslation(
  productId: number,
  locale: Exclude<Locale, "de">,
  fields: TranslatableProductFields
) {
  const store = readStore();
  if (!store[productId]) store[productId] = {};
  store[productId][locale] = fields;
  writeStore(store);
}

/**
 * Bulk save translations for multiple products.
 */
export function bulkSetTranslations(
  entries: { productId: number; locale: Exclude<Locale, "de">; fields: TranslatableProductFields }[]
) {
  const store = readStore();
  for (const entry of entries) {
    if (!store[entry.productId]) store[entry.productId] = {};
    store[entry.productId][entry.locale] = entry.fields;
  }
  writeStore(store);
}

/**
 * Delete all translations for a product.
 */
export function deleteProductTranslations(productId: number) {
  const store = readStore();
  delete store[productId];
  writeStore(store);
}

/**
 * Get all product IDs that have translations.
 */
export function getTranslatedProductIds(): number[] {
  const store = readStore();
  return Object.keys(store).map(Number);
}

/**
 * Get the full store (for admin/debug).
 */
export function getFullStore(): TranslationStore {
  return readStore();
}

/**
 * Check if a product has a translation for a given locale.
 */
export function hasTranslation(productId: number, locale: Locale): boolean {
  if (locale === "de") return true; // source always "translated"
  const store = readStore();
  return !!store[productId]?.[locale as Exclude<Locale, "de">];
}

/**
 * Get translation coverage stats.
 */
export function getTranslationStats(): {
  totalProducts: number;
  byLocale: Record<string, number>;
} {
  const store = readStore();
  const ids = Object.keys(store);
  const stats: Record<string, number> = { en: 0, fr: 0, it: 0, nl: 0 };

  for (const id of ids) {
    const translations = store[Number(id)];
    for (const locale of Object.keys(stats)) {
      if (translations[locale as Exclude<Locale, "de">]) {
        stats[locale]++;
      }
    }
  }

  return { totalProducts: ids.length, byLocale: stats };
}
