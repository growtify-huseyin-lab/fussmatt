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

// NOTE: Localized URL paths (e.g. /en/products instead of /en/produkte)
// intentionally deferred to post-launch. All locales currently use German
// path segments. This avoids the complexity of rewriting file-system routes,
// updating middleware, and managing redirects before launch.
// See: https://next-intl.dev/docs/routing#pathnames
