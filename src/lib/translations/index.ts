// Re-export everything for convenient imports
export { getProductTranslation, setProductTranslation, bulkSetTranslations, getTranslationStats, hasTranslation, getFullStore } from "./store";
export { translateProduct, translateProducts, extractTranslatableFields, stripHtmlForTranslation, restoreHtmlAfterTranslation } from "./translator";
export type { TranslatableProductFields, ProductTranslations, TranslationStore, TranslationJobStatus } from "./types";
