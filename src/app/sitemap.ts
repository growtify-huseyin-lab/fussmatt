import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { fetchVehicleHierarchy } from "@/lib/vehicle-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fussmatt.com";

function localeAlternates(path: string) {
  return { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // ─── Static pages ─────────────────────────────────────
  const staticPages = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/produkte", priority: 0.8, freq: "daily" as const },
    { path: "/ratgeber", priority: 0.7, freq: "weekly" as const },
  ];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.freq,
        priority: page.priority,
        alternates: localeAlternates(page.path),
      });
    }
  }

  // ─── Brand pages (/marke/[brand]/) ────────────────────
  try {
    const brands = await fetchVehicleHierarchy();
    for (const brand of brands) {
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/marke/${brand.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: localeAlternates(`/marke/${brand.slug}`),
        });

        // Model pages (/marke/[brand]/[model]/)
        for (const model of brand.models) {
          entries.push({
            url: `${SITE_URL}/${locale}/marke/${brand.slug}/${model.slug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
            alternates: localeAlternates(`/marke/${brand.slug}/${model.slug}`),
          });
        }
      }
    }
  } catch { /* vehicle data not available */ }

  // ─── Category pages (/kategorie/[slug]/) ──────────────
  try {
    const WP_URL = process.env.WORDPRESS_URL || "http://fussmatt.local";
    const auth = `Basic ${Buffer.from(`${process.env.WP_APPLICATION_USER}:${process.env.WP_APPLICATION_PASSWORD}`).toString("base64")}`;
    const res = await fetch(`${WP_URL}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=1`, {
      headers: { Authorization: auth },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const categories = (await res.json()) as Array<{ slug: string }>;
      for (const cat of categories) {
        for (const locale of locales) {
          entries.push({
            url: `${SITE_URL}/${locale}/kategorie/${cat.slug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
            alternates: localeAlternates(`/kategorie/${cat.slug}`),
          });
        }
      }
    }
  } catch { /* */ }

  // ─── Product pages (/produkt/[slug]/) ─────────────────
  try {
    const WP_URL = process.env.WORDPRESS_URL || "http://fussmatt.local";
    const auth = `Basic ${Buffer.from(`${process.env.WP_APPLICATION_USER}:${process.env.WP_APPLICATION_PASSWORD}`).toString("base64")}`;
    const res = await fetch(`${WP_URL}/wp-json/wc/v3/products?per_page=100&status=publish`, {
      headers: { Authorization: auth },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const products = (await res.json()) as Array<{ slug: string; date_modified: string }>;
      for (const product of products) {
        for (const locale of locales) {
          entries.push({
            url: `${SITE_URL}/${locale}/produkt/${product.slug}`,
            lastModified: new Date(product.date_modified),
            changeFrequency: "daily",
            priority: 0.9,
            alternates: localeAlternates(`/produkt/${product.slug}`),
          });
        }
      }
    }
  } catch { /* */ }

  // ─── Ratgeber pages ───────────────────────────────────
  const guides = ["3d-vs-5d-fussmatten-unterschied", "tpe-fussmatten-material-vorteile", "auto-fussmatten-kaufberatung"];
  for (const slug of guides) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/ratgeber/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: localeAlternates(`/ratgeber/${slug}`),
      });
    }
  }

  return entries;
}
