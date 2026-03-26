// v1: Only German. Other locales deferred to v2.
export const locales = ["de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
};

export const localeFlags: Record<Locale, string> = {
  de: "\uD83C\uDDE9\uD83C\uDDEA",
};

// NOTE: Localized URL paths (e.g. /en/products instead of /en/produkte)
// intentionally deferred to post-launch. All locales currently use German
// path segments. This avoids the complexity of rewriting file-system routes,
// updating middleware, and managing redirects before launch.
// See: https://next-intl.dev/docs/routing#pathnames
