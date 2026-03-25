import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string, currency = "CHF"): string {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(numericPrice);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Rewrite WordPress media URLs from fussmatt.com to wp.fussmatt.com.
 * Since fussmatt.com now points to Vercel, WP media must be served
 * from the wp subdomain.
 */
export function wpMediaUrl(url: string): string {
  if (!url) return url;
  return url
    .replace("https://fussmatt.com/wp-content/", "https://wp.fussmatt.com/wp-content/")
    .replace("http://fussmatt.com/wp-content/", "https://wp.fussmatt.com/wp-content/");
}
