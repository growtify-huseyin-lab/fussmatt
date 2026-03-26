import type { MetadataRoute } from "next";
import { fetchVehicleHierarchy } from "@/lib/vehicle-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fussmatt.com";

function wcFetchUrl(endpoint: string): { url: string; headers: Record<string, string> } {
  const WP_URL = process.env.WORDPRESS_URL;
  if (!WP_URL) return { url: "", headers: {} };
  const WP_USER = process.env.WP_APPLICATION_USER || "";
  const WP_PASS = process.env.WP_APPLICATION_PASSWORD || "";
  const WC_KEY = process.env.WC_CONSUMER_KEY || "";
  const WC_SECRET = process.env.WC_CONSUMER_SECRET || "";
  const u = new URL(`${WP_URL}/wp-json/wc/v3${endpoint}`);
  const headers: Record<string, string> = {};
  if (WP_USER && WP_PASS) {
    headers["Authorization"] = `Basic ${Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64")}`;
  } else if (WC_KEY && WC_SECRET) {
    u.searchParams.set("consumer_key", WC_KEY);
    u.searchParams.set("consumer_secret", WC_SECRET);
  }
  return { url: u.toString(), headers };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static pages
  const staticPages = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/produkte", priority: 0.8, freq: "daily" as const },
    { path: "/ratgeber", priority: 0.7, freq: "weekly" as const },
    { path: "/kontakt", priority: 0.5, freq: "monthly" as const },
    { path: "/agb", priority: 0.3, freq: "monthly" as const },
    { path: "/datenschutz", priority: 0.3, freq: "monthly" as const },
    { path: "/impressum", priority: 0.3, freq: "monthly" as const },
    { path: "/versand", priority: 0.4, freq: "monthly" as const },
    { path: "/widerruf", priority: 0.3, freq: "monthly" as const },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${SITE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.freq,
      priority: page.priority,
    });
  }

  // Brand pages
  try {
    const brands = await fetchVehicleHierarchy();
    for (const brand of brands) {
      entries.push({
        url: `${SITE_URL}/marke/${brand.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
      for (const model of brand.models) {
        entries.push({
          url: `${SITE_URL}/marke/${brand.slug}/${model.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch { /* */ }

  // Category pages
  try {
    const catReq = wcFetchUrl("/products/categories?per_page=100&hide_empty=1");
    if (!catReq.url) throw new Error("No WP URL");
    const res = await fetch(catReq.url, { headers: catReq.headers, next: { revalidate: 3600 } });
    if (res.ok) {
      const categories = (await res.json()) as Array<{ slug: string }>;
      for (const cat of categories) {
        entries.push({
          url: `${SITE_URL}/kategorie/${cat.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch { /* */ }

  // Product pages
  try {
    const prodReq = wcFetchUrl("/products?per_page=100&status=publish");
    if (!prodReq.url) throw new Error("No WP URL");
    const res = await fetch(prodReq.url, { headers: prodReq.headers, next: { revalidate: 3600 } });
    if (res.ok) {
      const products = (await res.json()) as Array<{ slug: string; date_modified: string }>;
      for (const product of products) {
        entries.push({
          url: `${SITE_URL}/produkt/${product.slug}`,
          lastModified: new Date(product.date_modified),
          changeFrequency: "daily",
          priority: 0.9,
        });
      }
    }
  } catch { /* */ }

  // Ratgeber pages
  const guides = ["3d-vs-5d-fussmatten-unterschied", "tpe-fussmatten-material-vorteile", "auto-fussmatten-kaufberatung"];
  for (const slug of guides) {
    entries.push({
      url: `${SITE_URL}/ratgeber/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
