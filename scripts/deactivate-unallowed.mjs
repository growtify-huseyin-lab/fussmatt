#!/usr/bin/env node
/**
 * ONE-TIME SCRIPT: Deactivate products not in allowed categories
 *
 * Allowed category slugs (from produkte/page.tsx):
 *   5d-fussmatten, 3d-fussmatten, passend-fuer-lkw-truck-fussmatten,
 *   passend-fuer-kleinbus-pickup-fussmatten, universal-fussmatten,
 *   kofferraummatte, fuss-und-kofferraummatten-set
 *
 * Also deactivates products with NO images.
 *
 * Usage: node scripts/deactivate-unallowed.mjs [--dry-run]
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch { /* no .env.local */ }

const WP_URL = process.env.WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
const WP_USER = process.env.WP_APPLICATION_USER;
const WP_APP_PASS = process.env.WP_APPLICATION_PASSWORD;

if (!WP_URL) { console.error("WORDPRESS_URL not set"); process.exit(1); }

const DRY_RUN = process.argv.includes("--dry-run");
if (DRY_RUN) console.log("🔍 DRY RUN MODE — no changes will be made\n");

const ALLOWED_SLUGS = [
  "5d-fussmatten",
  "3d-fussmatten",
  "passend-fuer-lkw-truck-fussmatten",
  "passend-fuer-kleinbus-pickup-fussmatten",
  "universal-fussmatten",
  "kofferraummatte",
  "fuss-und-kofferraummatten-set",
];

// ─── Auth helper ────────────────────────────────────────
function buildUrl(endpoint, params = {}) {
  const url = new URL(`${WP_URL}/wp-json/wc/v3${endpoint}`);
  if (WC_KEY && WC_SECRET) {
    url.searchParams.set("consumer_key", WC_KEY);
    url.searchParams.set("consumer_secret", WC_SECRET);
  }
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

function authHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (WP_USER && WP_APP_PASS) {
    headers["Authorization"] = `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString("base64")}`;
  }
  return headers;
}

// ─── Fetch all categories ───────────────────────────────
async function fetchAllCategories() {
  const cats = [];
  let page = 1;
  while (true) {
    const res = await fetch(buildUrl("/products/categories", { per_page: 100, page }), { headers: authHeaders() });
    if (!res.ok) break;
    const data = await res.json();
    if (data.length === 0) break;
    cats.push(...data);
    page++;
  }
  return cats;
}

// ─── Fetch all published products ───────────────────────
async function fetchAllProducts() {
  const products = [];
  let page = 1;
  while (true) {
    const res = await fetch(buildUrl("/products", { per_page: 100, page, status: "publish" }), { headers: authHeaders() });
    if (!res.ok) { console.error(`API error page ${page}: ${res.status}`); break; }
    const data = await res.json();
    if (data.length === 0) break;
    products.push(...data);
    console.log(`  Fetched page ${page} (${data.length} products, total: ${products.length})`);
    page++;
  }
  return products;
}

// ─── Update product status ──────────────────────────────
async function setProductDraft(id, name) {
  if (DRY_RUN) {
    console.log(`  [DRY] Would set draft: #${id} "${name}"`);
    return true;
  }
  const res = await fetch(buildUrl(`/products/${id}`), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status: "draft" }),
  });
  if (!res.ok) {
    console.error(`  ❌ Failed to draft #${id}: ${res.status}`);
    return false;
  }
  return true;
}

// ─── Main ───────────────────────────────────────────────
async function main() {
  console.log("📦 Fetching categories...");
  const allCats = await fetchAllCategories();

  // Build set of allowed category IDs (including children)
  const allowedCatIds = new Set();

  function addCatAndChildren(slug) {
    const cat = allCats.find(c => c.slug === slug);
    if (cat) {
      allowedCatIds.add(cat.id);
      // Also add child categories
      const children = allCats.filter(c => c.parent === cat.id);
      for (const child of children) {
        allowedCatIds.add(child.id);
      }
    }
  }

  for (const slug of ALLOWED_SLUGS) {
    addCatAndChildren(slug);
  }

  console.log(`✅ Allowed category IDs: [${[...allowedCatIds].join(", ")}] (${allowedCatIds.size} categories)`);
  console.log(`   Slugs: ${ALLOWED_SLUGS.join(", ")}\n`);

  console.log("📦 Fetching all published products...");
  const products = await fetchAllProducts();
  console.log(`\n📊 Total published products: ${products.length}\n`);

  // Classify products
  const toDeactivate = [];
  const toKeep = [];
  const noImage = [];

  for (const p of products) {
    const productCatIds = (p.categories || []).map(c => c.id);
    const hasAllowedCategory = productCatIds.some(id => allowedCatIds.has(id));
    const hasImages = p.images && p.images.length > 0 && p.images[0]?.src;

    if (!hasAllowedCategory) {
      toDeactivate.push({ id: p.id, name: p.name, reason: "not in allowed categories", cats: (p.categories || []).map(c => c.name).join(", ") });
    } else if (!hasImages) {
      noImage.push({ id: p.id, name: p.name, reason: "no images" });
      toDeactivate.push({ id: p.id, name: p.name, reason: "no images", cats: (p.categories || []).map(c => c.name).join(", ") });
    } else {
      toKeep.push({ id: p.id, name: p.name });
    }
  }

  console.log(`📊 Classification:`);
  console.log(`   ✅ Keep active: ${toKeep.length}`);
  console.log(`   ❌ Deactivate (wrong category): ${toDeactivate.filter(p => p.reason === "not in allowed categories").length}`);
  console.log(`   🖼️  Deactivate (no images): ${noImage.length}`);
  console.log(`   📋 Total to deactivate: ${toDeactivate.length}\n`);

  if (toDeactivate.length === 0) {
    console.log("🎉 No products need deactivation!");
    return;
  }

  // Show first 20 products to deactivate
  console.log("📋 Products to deactivate (first 20):");
  for (const p of toDeactivate.slice(0, 20)) {
    console.log(`   #${p.id} "${p.name}" — ${p.reason} [${p.cats}]`);
  }
  if (toDeactivate.length > 20) {
    console.log(`   ... and ${toDeactivate.length - 20} more\n`);
  }

  // Deactivate
  console.log(`\n🚀 ${DRY_RUN ? "DRY RUN:" : "Deactivating"} ${toDeactivate.length} products...`);
  let success = 0;
  let fail = 0;

  for (let i = 0; i < toDeactivate.length; i++) {
    const p = toDeactivate[i];
    const ok = await setProductDraft(p.id, p.name);
    if (ok) success++; else fail++;
    if ((i + 1) % 50 === 0) console.log(`   Progress: ${i + 1}/${toDeactivate.length}`);
  }

  console.log(`\n✅ Done! ${success} deactivated, ${fail} failed`);
  console.log(`📊 Remaining active products: ${toKeep.length}`);
}

main().catch(console.error);
