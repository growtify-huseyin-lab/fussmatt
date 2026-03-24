/**
 * B2B XML Feed → WooCommerce Sync Types
 */

export interface XMLProduct {
  sku: string;
  title: string;
  price: string;           // sale price
  regular_price: string;
  stock_status: "instock" | "outofstock";
  weight: string;           // kg
  images: string[];         // URLs
  categories: string[];
  attributes: Record<string, string>;  // name → value
  gtin?: string;            // EAN/GTIN-13
  description?: string;
  short_description?: string;
}

export interface SyncResult {
  created: number;
  updated: number;
  skipped: number;
  errors: SyncError[];
  batchOffset: number;
  batchSize: number;
  totalProducts: number;
  hasMore: boolean;
  duration: number;         // ms
}

export interface SyncError {
  sku: string;
  message: string;
  type: "parse" | "api" | "validation" | "image";
}

export interface SyncOptions {
  batchSize?: number;       // default 50
  offset?: number;          // default 0
  syncImages?: boolean;     // default false (separate batch)
  dryRun?: boolean;         // default false
  feedUrl?: string;         // override feed URL
}

export interface SyncLog {
  timestamp: string;
  action: "sync_start" | "sync_end" | "product_created" | "product_updated" | "product_skipped" | "error" | "info";
  message: string;
  data?: Record<string, unknown>;
}
