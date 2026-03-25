import type { WCProduct, WCCategory, WCProductVariation } from "@/types/woocommerce";

const WORDPRESS_URL = process.env.WORDPRESS_URL || "";
const WC_KEY = process.env.WC_CONSUMER_KEY || "";
const WC_SECRET = process.env.WC_CONSUMER_SECRET || "";
const WP_USER = process.env.WP_APPLICATION_USER || "";
const WP_APP_PASS = process.env.WP_APPLICATION_PASSWORD || "";

// Use Application Password auth for local, consumer key/secret for production
const useAppPassword = !!WP_USER && !!WP_APP_PASS;
const AUTH_HEADER = useAppPassword
  ? `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString("base64")}`
  : "";

async function wcFetch<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  options: RequestInit = {}
): Promise<T> {
  const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3${endpoint}`);

  // Add consumer key/secret for production (query param auth)
  if (!useAppPassword && WC_KEY && WC_SECRET) {
    url.searchParams.set("consumer_key", WC_KEY);
    url.searchParams.set("consumer_secret", WC_SECRET);
  }

  // Add query params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };
  if (useAppPassword) {
    headers["Authorization"] = AUTH_HEADER;
  }

  const res = await fetch(url.toString(), {
    ...options,
    headers,
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`WC API Error [${res.status}]: ${errorBody}`);
    throw new Error(`WooCommerce API error: ${res.status}`);
  }

  return res.json();
}

// ─── Products ───────────────────────────────────────────
export async function getProducts(params: Record<string, string | number> = {}): Promise<WCProduct[]> {
  return wcFetch<WCProduct[]>("/products", {
    per_page: 20,
    status: "publish",
    ...params,
  });
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const products = await wcFetch<WCProduct[]>("/products", { slug });
  return products[0] || null;
}

export async function getProductById(id: number): Promise<WCProduct> {
  return wcFetch<WCProduct>(`/products/${id}`);
}

export async function getProductVariations(productId: number): Promise<WCProductVariation[]> {
  return wcFetch<WCProductVariation[]>(`/products/${productId}/variations`, {
    per_page: 100,
  });
}

// ─── Categories ─────────────────────────────────────────
export async function getCategories(params: Record<string, string | number> = {}): Promise<WCCategory[]> {
  return wcFetch<WCCategory[]>("/products/categories", {
    per_page: 100,
    hide_empty: 1,
    ...params,
  });
}

export async function getCategoryBySlug(slug: string): Promise<WCCategory | null> {
  const categories = await wcFetch<WCCategory[]>("/products/categories", { slug });
  return categories[0] || null;
}

// ─── Orders ─────────────────────────────────────────────
export async function createOrder(orderData: Record<string, unknown>) {
  return wcFetch("/orders", {}, {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

// ─── Search ─────────────────────────────────────────────
export async function searchProducts(query: string): Promise<WCProduct[]> {
  return wcFetch<WCProduct[]>("/products", {
    search: query,
    per_page: 20,
    status: "publish",
  });
}
