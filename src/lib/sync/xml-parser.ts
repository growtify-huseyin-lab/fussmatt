/**
 * B2B XML Feed Parser
 *
 * Fetches and parses the supplier XML feed into structured product data.
 * Handles various XML structures gracefully with fallbacks.
 */

import type { XMLProduct } from "./types";

const DEFAULT_FEED_URL = process.env.B2B_FEED_URL || "https://b2b.fussmattenprofi.com/api/feed/15/export.xml";

/**
 * Fetch and parse the B2B XML feed.
 */
export async function fetchAndParseXML(feedUrl?: string): Promise<XMLProduct[]> {
  const url = feedUrl || DEFAULT_FEED_URL;

  const response = await fetch(url, {
    headers: { "User-Agent": "FussMatt-Sync/1.0" },
    signal: AbortSignal.timeout(60000), // 60s timeout
  });

  if (!response.ok) {
    throw new Error(`XML feed fetch failed: ${response.status} ${response.statusText}`);
  }

  const xmlText = await response.text();
  return parseXMLProducts(xmlText);
}

/**
 * Parse XML string into product array.
 * Uses regex-based parsing (no external dependency needed).
 */
export function parseXMLProducts(xml: string): XMLProduct[] {
  const products: XMLProduct[] = [];

  // Extract all <product> blocks
  const productBlocks = xml.match(/<product[^>]*>[\s\S]*?<\/product>/gi) || [];

  for (const block of productBlocks) {
    try {
      const product = parseProductBlock(block);
      if (product && product.sku) {
        products.push(product);
      }
    } catch {
      // Skip malformed product blocks
    }
  }

  return products;
}

/**
 * Parse a single <product> XML block.
 *
 * Real feed structure (fussmattenprofi B2B):
 *   <Product>
 *     <Id>4020</Id>
 *     <Sku>FTPE-1140</Sku>
 *     <Price>59.9</Price>
 *     <InStock>True</InStock>
 *     <Categories><Category>5D Fussmatten</Category></Categories>
 *     <Titles><Title lang="DE">...</Title></Titles>
 *     <Images><Image pos="0">https://cdn...</Image></Images>
 *   </Product>
 */
function parseProductBlock(block: string): XMLProduct | null {
  const sku = extractTag(block, "Sku") || extractTag(block, "sku");
  if (!sku) return null;

  // Title: try <Title lang="DE"> first, then <Title>, then <title>
  const titleDE = block.match(/<Title\s+lang=["']DE["'][^>]*>([\s\S]*?)<\/Title>/i);
  const title = titleDE ? decodeXMLEntities(titleDE[1].trim())
    : extractTag(block, "Title") || extractTag(block, "title") || extractTag(block, "name") || "";

  // Price: feed only has one price field
  const price = extractTag(block, "Price") || extractTag(block, "price") || "0";
  const regularPrice = extractTag(block, "regular_price") || price;

  // Stock: feed uses "True"/"False" instead of "instock"/"outofstock"
  const inStockRaw = extractTag(block, "InStock") || extractTag(block, "stock_status") || "false";
  const stockStatus: "instock" | "outofstock" =
    inStockRaw.toLowerCase() === "true" || inStockRaw.toLowerCase() === "instock"
      ? "instock" : "outofstock";

  const weight = extractTag(block, "weight") || extractTag(block, "Weight") || "0";
  const gtin = extractTag(block, "gtin") || extractTag(block, "ean") || extractTag(block, "Gtin") || undefined;
  const description = extractTag(block, "description") || extractTag(block, "Description") || "";
  const shortDescription = extractTag(block, "short_description") || "";

  // Parse images (try both cases: <Image> and <image>)
  const images = [
    ...extractMultipleTags(block, "Image"),
    ...extractMultipleTags(block, "image"),
  ]
    .map((url) => decodeXMLEntities(url.trim()))
    .filter((url) => url.startsWith("http"));

  // Parse categories (try both cases)
  const categories = [
    ...extractMultipleTags(block, "Category"),
    ...extractMultipleTags(block, "category"),
  ]
    .map((c) => c.trim())
    .filter(Boolean);

  // Parse attributes
  const attributes: Record<string, string> = {};
  const attrMatches = block.matchAll(/<attribute\s+name=["']([^"']+)["'][^>]*>([\s\S]*?)<\/attribute>/gi);
  for (const match of attrMatches) {
    attributes[match[1].trim()] = match[2].trim();
  }

  // Also try <attribute><name>...</name><value>...</value></attribute> format
  const attrBlocks = block.match(/<attribute>[\s\S]*?<\/attribute>/gi) || [];
  for (const attrBlock of attrBlocks) {
    const name = extractTag(attrBlock, "name");
    const value = extractTag(attrBlock, "value");
    if (name && value) {
      attributes[name] = value;
    }
  }

  return {
    sku,
    title,
    price,
    regular_price: regularPrice,
    stock_status: stockStatus,
    weight,
    images,
    categories,
    attributes,
    gtin,
    description,
    short_description: shortDescription,
  };
}

/**
 * Extract text content of a single XML tag.
 */
function extractTag(xml: string, tagName: string): string | null {
  // Try CDATA first
  const cdataRegex = new RegExp(`<${tagName}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tagName}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Regular tag
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = xml.match(regex);
  if (match) return decodeXMLEntities(match[1].trim());

  // Self-closing with value attribute
  const attrRegex = new RegExp(`<${tagName}[^>]*value=["']([^"']*?)["'][^>]*/?>`, "i");
  const attrMatch = xml.match(attrRegex);
  if (attrMatch) return attrMatch[1].trim();

  return null;
}

/**
 * Extract all instances of a tag.
 */
function extractMultipleTags(xml: string, tagName: string): string[] {
  const results: string[] = [];
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const value = match[1].trim();
    // Handle CDATA
    const cdataMatch = value.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
    results.push(cdataMatch ? cdataMatch[1].trim() : decodeXMLEntities(value));
  }
  return results;
}

/**
 * Decode common XML entities.
 */
function decodeXMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

/**
 * Parse XML from a local file (for testing).
 */
export async function parseXMLFile(filePath: string): Promise<XMLProduct[]> {
  const fs = await import("fs");
  const xml = fs.readFileSync(filePath, "utf-8");
  return parseXMLProducts(xml);
}
