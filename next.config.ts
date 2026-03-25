import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Serve all images as WebP (or AVIF if browser supports)
    formats: ["image/avif", "image/webp"],
    // Use unoptimized in dev (LocalWP hostname resolution issue)
    // Remove this in production!
    unoptimized: process.env.NODE_ENV === "development",
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fussmatt.com",
      },
      {
        protocol: "https",
        hostname: "wp.fussmatt.com",
      },
      {
        protocol: "http",
        hostname: "fussmatt.local",
      },
      {
        protocol: "https",
        hostname: "**.fussmattenprofi.com",
      },
      {
        protocol: "https",
        hostname: "cdn.fussmattenprofi.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
