export const locales = ["de", "en", "fr", "it", "nl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  fr: "Fran\u00e7ais",
  it: "Italiano",
  nl: "Nederlands",
};

export const localeFlags: Record<Locale, string> = {
  de: "\uD83C\uDDE9\uD83C\uDDEA",
  en: "\uD83C\uDDEC\uD83C\uDDE7",
  fr: "\uD83C\uDDEB\uD83C\uDDF7",
  it: "\uD83C\uDDEE\uD83C\uDDF9",
  nl: "\uD83C\uDDF3\uD83C\uDDF1",
};

// URL path mapping per locale
export const pathnames = {
  "/": "/",
  "/produkte": {
    de: "/produkte",
    en: "/products",
    fr: "/produits",
    it: "/prodotti",
    nl: "/producten",
  },
  "/produkt/[slug]": {
    de: "/produkt/[slug]",
    en: "/product/[slug]",
    fr: "/produit/[slug]",
    it: "/prodotto/[slug]",
    nl: "/product/[slug]",
  },
  "/warenkorb": {
    de: "/warenkorb",
    en: "/cart",
    fr: "/panier",
    it: "/carrello",
    nl: "/winkelwagen",
  },
  "/kasse": {
    de: "/kasse",
    en: "/checkout",
    fr: "/caisse",
    it: "/cassa",
    nl: "/afrekenen",
  },
} as const;
