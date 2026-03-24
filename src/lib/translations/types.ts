import type { Locale } from "@/i18n/config";

/**
 * Fields of a WooCommerce product that can be translated.
 */
export interface TranslatableProductFields {
  name: string;
  description: string;
  short_description: string;
  /** Category names, keyed by category ID */
  categories?: Record<number, string>;
  /** Attribute labels, keyed by attribute ID */
  attributes?: Record<number, { name: string; options: string[] }>;
}

/**
 * A single product's translations across locales.
 * Key = locale code (en, fr, it, nl). German (de) is the source — never stored.
 */
export type ProductTranslations = {
  [L in Exclude<Locale, "de">]?: TranslatableProductFields;
};

/**
 * The full translation store: product ID → translations.
 */
export type TranslationStore = Record<number, ProductTranslations>;

/**
 * Status of a translation job.
 */
export interface TranslationJobStatus {
  productId: number;
  locale: Locale;
  status: "pending" | "completed" | "failed";
  error?: string;
  updatedAt: string;
}
