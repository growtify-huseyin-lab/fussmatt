import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fussmatt.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/kasse", "/checkout", "/caisse", "/cassa", "/afrekenen"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
