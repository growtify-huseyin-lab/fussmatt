#!/usr/bin/env node
/**
 * One-time product translation script.
 *
 * Fetches all published products from WooCommerce, translates their
 * names / short descriptions / categories using a comprehensive term
 * dictionary, and writes the result to data/product-translations.json.
 *
 * Usage:
 *   node scripts/translate-products.mjs
 *
 * The generated JSON is read at build-time by the Next.js app —
 * no runtime filesystem writes on Vercel.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const OUT_FILE = path.join(DATA_DIR, "product-translations.json");

// ─── Config ──────────────────────────────────────────
const API = process.env.WORDPRESS_URL
  ? `${process.env.WORDPRESS_URL}/wp-json/wc/v3/products`
  : "https://wp.fussmatt.com/wp-json/wc/v3/products";
const CK = process.env.WC_CONSUMER_KEY  || "ck_65b5ec059995a06a5f64e658ab6cadf5b027bfd3";
const CS = process.env.WC_CONSUMER_SECRET || "cs_cfb0d604189b9da2c3eafa44a006c00ed84c1abb";

const LOCALES = ["en", "fr", "it", "nl"];

// ─── Term dictionaries ───────────────────────────────
// Longer phrases MUST come first so they match before shorter substrings.
const TERMS = {
  en: [
    // Product type prefixes (longest first)
    ["5D Premium Auto Fussmatten TPE Set", "5D Premium Car Floor Mats TPE Set"],
    ["5D Premium Auto Fussmatten Set", "5D Premium Car Floor Mats Set"],
    ["5D Premium Auto Fussmatten", "5D Premium Car Floor Mats"],
    ["5D Premium Kofferraummatte", "5D Premium Trunk Mat"],
    ["3D Auto Fussmatten Set", "3D Car Floor Mats Set"],
    ["3D Auto Fussmatten", "3D Car Floor Mats"],
    ["3D Kofferraummatte", "3D Trunk Mat"],
    ["Fuss-und Kofferraummatten Set", "Floor & Trunk Mat Set"],
    ["Fuss- und Kofferraummatten Set", "Floor & Trunk Mat Set"],
    ["LKW Fussmatten", "Truck Floor Mats"],
    ["Auto Fussmatten", "Car Floor Mats"],
    ["Fussmatten-Set", "Floor Mat Set"],
    ["Fussmatten Set", "Floor Mat Set"],
    ["Fussmatten", "Floor Mats"],
    ["Fussmatte", "Floor Mat"],
    ["Kofferraummatten", "Trunk Mats"],
    ["Kofferraummatte", "Trunk Mat"],
    // Phrases
    ["passend f\u00fcr", "for"],
    ["Passend f\u00fcr", "For"],
    ["Passend F\u00fcr", "For"],
    ["Kompatibel f\u00fcr", "Compatible with"],
    ["Baujahr ab", "from"],
    ["ab Baujahr", "from"],
    [" ab ", " from "],
    ["Baujahr", "Year"],
    ["aus hochwertigem", "made of premium"],
    ["aus Hochwertigem", "made of Premium"],
    // Variant product names
    ["3D Gummimatte", "3D Rubber Mat"],
    ["3D Kofferraum Matte", "3D Trunk Mat"],
    ["5D Kofferraum Matte", "5D Trunk Mat"],
    ["Gummimatte", "Rubber Mat"],
    ["Kofferraum Matte", "Trunk Mat"],
    // Vehicle types
    ["Kleinbus", "Minibus"],
    ["Pickup", "Pickup"],
    ["Limousine", "Sedan"],
    ["Kombi", "Estate"],
    ["Cabrio", "Convertible"],
    ["Coup\u00e9", "Coupe"],
    ["Automatik", "Automatic"],
    ["Allrad", "AWD"],
    ["Serie", "Series"],
    // Categories
    ["Unkategorisiert", "Uncategorized"],
    ["Ladekantenschutz", "Loading Edge Protection"],
    ["Befestigungsclips", "Fastening Clips"],
    ["Mittelarmlehne", "Center Armrest"],
    ["Klebeband", "Adhesive Tape"],
    ["Universal Fussmatten", "Universal Floor Mats"],
    ["5D Fussmatten", "5D Floor Mats"],
    ["3D Fussmatten", "3D Floor Mats"],
    ["Passend f\u00fcr LKW-Truck Fussmatten", "Truck Floor Mats"],
    ["Passend f\u00fcr Kleinbus Pickup Fussmatten", "Minibus & Pickup Floor Mats"],
  ],
  fr: [
    ["5D Premium Auto Fussmatten TPE Set", "Set de tapis de sol 5D Premium TPE"],
    ["5D Premium Auto Fussmatten Set", "Set de tapis de sol 5D Premium"],
    ["5D Premium Auto Fussmatten", "Tapis de sol 5D Premium"],
    ["5D Premium Kofferraummatte", "Tapis de coffre 5D Premium"],
    ["3D Auto Fussmatten Set", "Set de tapis de sol 3D"],
    ["3D Auto Fussmatten", "Tapis de sol 3D"],
    ["3D Kofferraummatte", "Tapis de coffre 3D"],
    ["Fuss-und Kofferraummatten Set", "Set tapis de sol et coffre"],
    ["Fuss- und Kofferraummatten Set", "Set tapis de sol et coffre"],
    ["LKW Fussmatten", "Tapis de sol camion"],
    ["Auto Fussmatten", "Tapis de sol auto"],
    ["Fussmatten", "Tapis de sol"],
    ["Fussmatte", "Tapis de sol"],
    ["Kofferraummatten", "Tapis de coffre"],
    ["Kofferraummatte", "Tapis de coffre"],
    ["passend f\u00fcr", "pour"],
    ["Passend f\u00fcr", "Pour"],
    ["Passend F\u00fcr", "Pour"],
    ["Kompatibel f\u00fcr", "Compatible avec"],
    ["Baujahr ab", "\u00e0 partir de"],
    ["ab Baujahr", "\u00e0 partir de"],
    [" ab ", " \u00e0 partir de "],
    ["Baujahr", "Ann\u00e9e"],
    ["aus hochwertigem", "en mat\u00e9riau premium"],
    ["aus Hochwertigem", "en mat\u00e9riau premium"],
    ["3D Gummimatte", "Tapis en caoutchouc 3D"],
    ["3D Kofferraum Matte", "Tapis de coffre 3D"],
    ["Gummimatte", "Tapis en caoutchouc"],
    ["Kofferraum Matte", "Tapis de coffre"],
    ["Kleinbus", "Minibus"],
    ["Limousine", "Berline"],
    ["Kombi", "Break"],
    ["Cabrio", "Cabriolet"],
    ["Automatik", "Automatique"],
    ["Serie", "S\u00e9rie"],
    ["Unkategorisiert", "Non cat\u00e9goris\u00e9"],
    ["Universal Fussmatten", "Tapis de sol universels"],
    ["5D Fussmatten", "Tapis de sol 5D"],
    ["3D Fussmatten", "Tapis de sol 3D"],
  ],
  it: [
    ["5D Premium Auto Fussmatten TPE Set", "Set tappetini auto 5D Premium TPE"],
    ["5D Premium Auto Fussmatten Set", "Set tappetini auto 5D Premium"],
    ["5D Premium Auto Fussmatten", "Tappetini auto 5D Premium"],
    ["5D Premium Kofferraummatte", "Tappetino bagagliaio 5D Premium"],
    ["3D Auto Fussmatten Set", "Set tappetini auto 3D"],
    ["3D Auto Fussmatten", "Tappetini auto 3D"],
    ["3D Kofferraummatte", "Tappetino bagagliaio 3D"],
    ["Fuss-und Kofferraummatten Set", "Set tappetini e bagagliaio"],
    ["Fuss- und Kofferraummatten Set", "Set tappetini e bagagliaio"],
    ["LKW Fussmatten", "Tappetini camion"],
    ["Auto Fussmatten", "Tappetini auto"],
    ["Fussmatten", "Tappetini"],
    ["Fussmatte", "Tappetino"],
    ["Kofferraummatten", "Tappetini bagagliaio"],
    ["Kofferraummatte", "Tappetino bagagliaio"],
    ["passend f\u00fcr", "per"],
    ["Passend f\u00fcr", "Per"],
    ["Passend F\u00fcr", "Per"],
    ["Kompatibel f\u00fcr", "Compatibile con"],
    ["Baujahr ab", "dall'anno"],
    ["ab Baujahr", "dall'anno"],
    [" ab ", " dall'anno "],
    ["Baujahr", "Anno"],
    ["aus hochwertigem", "in materiale premium"],
    ["aus Hochwertigem", "in materiale premium"],
    ["3D Gummimatte", "Tappetino in gomma 3D"],
    ["3D Kofferraum Matte", "Tappetino bagagliaio 3D"],
    ["Gummimatte", "Tappetino in gomma"],
    ["Kofferraum Matte", "Tappetino bagagliaio"],
    ["Kleinbus", "Minibus"],
    ["Limousine", "Berlina"],
    ["Kombi", "Station wagon"],
    ["Cabrio", "Cabriolet"],
    ["Automatik", "Automatico"],
    ["Serie", "Serie"],
    ["Unkategorisiert", "Non categorizzato"],
    ["Universal Fussmatten", "Tappetini universali"],
    ["5D Fussmatten", "Tappetini 5D"],
    ["3D Fussmatten", "Tappetini 3D"],
  ],
  nl: [
    ["5D Premium Auto Fussmatten TPE Set", "5D Premium automatten TPE set"],
    ["5D Premium Auto Fussmatten Set", "5D Premium automatten set"],
    ["5D Premium Auto Fussmatten", "5D Premium automatten"],
    ["5D Premium Kofferraummatte", "5D Premium kofferbakmat"],
    ["3D Auto Fussmatten Set", "3D Automatten set"],
    ["3D Auto Fussmatten", "3D Automatten"],
    ["3D Kofferraummatte", "3D Kofferbakmat"],
    ["Fuss-und Kofferraummatten Set", "Vloer- en kofferbakmattenset"],
    ["Fuss- und Kofferraummatten Set", "Vloer- en kofferbakmattenset"],
    ["LKW Fussmatten", "Vrachtwagen vloermatten"],
    ["Auto Fussmatten", "Automatten"],
    ["Fussmatten", "Vloermatten"],
    ["Fussmatte", "Vloermat"],
    ["Kofferraummatten", "Kofferbakmatten"],
    ["Kofferraummatte", "Kofferbakmat"],
    ["passend f\u00fcr", "voor"],
    ["Passend f\u00fcr", "Voor"],
    ["Passend F\u00fcr", "Voor"],
    ["Kompatibel f\u00fcr", "Compatibel met"],
    ["Baujahr ab", "vanaf bouwjaar"],
    ["ab Baujahr", "vanaf bouwjaar"],
    [" ab ", " vanaf "],
    ["Baujahr", "Bouwjaar"],
    ["aus hochwertigem", "van hoogwaardig"],
    ["aus Hochwertigem", "van hoogwaardig"],
    ["3D Gummimatte", "3D Rubbermat"],
    ["3D Kofferraum Matte", "3D Kofferbakmat"],
    ["Gummimatte", "Rubbermat"],
    ["Kofferraum Matte", "Kofferbakmat"],
    ["Kleinbus", "Minibus"],
    ["Limousine", "Sedan"],
    ["Kombi", "Stationwagen"],
    ["Cabrio", "Cabrio"],
    ["Automatik", "Automaat"],
    ["Serie", "Serie"],
    ["Unkategorisiert", "Niet gecategoriseerd"],
    ["Universal Fussmatten", "Universele vloermatten"],
    ["5D Fussmatten", "5D Vloermatten"],
    ["3D Fussmatten", "3D Vloermatten"],
  ],
};

// Attribute label translations
const ATTR_LABELS = {
  en: { Marke: "Brand", Modell: "Model", Fahrzeug: "Vehicle", Material: "Material", Farbe: "Color", Gewicht: "Weight", Lieferumfang: "Scope of delivery", "Passend f\u00fcr": "Compatible with" },
  fr: { Marke: "Marque", Modell: "Mod\u00e8le", Fahrzeug: "V\u00e9hicule", Material: "Mat\u00e9riau", Farbe: "Couleur", Gewicht: "Poids", Lieferumfang: "Contenu", "Passend f\u00fcr": "Compatible avec" },
  it: { Marke: "Marca", Modell: "Modello", Fahrzeug: "Veicolo", Material: "Materiale", Farbe: "Colore", Gewicht: "Peso", Lieferumfang: "Contenuto", "Passend f\u00fcr": "Compatibile con" },
  nl: { Marke: "Merk", Modell: "Model", Fahrzeug: "Voertuig", Material: "Materiaal", Farbe: "Kleur", Gewicht: "Gewicht", Lieferumfang: "Leveringsomvang", "Passend f\u00fcr": "Passend voor" },
};

// ─── Helpers ─────────────────────────────────────────

function translateText(text, locale) {
  if (!text) return text;
  let result = text;
  for (const [de, translated] of TERMS[locale]) {
    // Use split/join for global replacement (no regex needed)
    result = result.split(de).join(translated);
  }
  return result;
}

async function fetchAllProducts() {
  const products = [];
  let page = 1;
  while (true) {
    const url = `${API}?per_page=100&page=${page}&status=publish&consumer_key=${CK}&consumer_secret=${CS}`;
    console.log(`  Fetching page ${page}...`);
    const res = await fetch(url);
    if (!res.ok) { console.error(`API error: ${res.status}`); break; }
    const batch = await res.json();
    if (!batch.length) break;
    products.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return products;
}

// ─── Main ────────────────────────────────────────────

async function main() {
  console.log("=== FussMatt Product Translation Script ===\n");
  console.log("Fetching all published products...");
  const products = await fetchAllProducts();
  console.log(`Fetched ${products.length} products.\n`);

  // Build translation store: { [productId]: { en: {...}, fr: {...}, ... } }
  const store = {};
  let translated = 0;

  for (const product of products) {
    const entry = {};

    for (const locale of LOCALES) {
      const name = translateText(product.name, locale);
      const desc = translateText(product.description || "", locale);
      const shortDesc = translateText(product.short_description || "", locale);

      // Translate categories
      const categories = {};
      for (const cat of product.categories || []) {
        categories[cat.id] = translateText(cat.name, locale);
      }

      // Translate attribute labels
      const attributes = {};
      for (const attr of product.attributes || []) {
        const label = ATTR_LABELS[locale]?.[attr.name] || attr.name;
        // Also translate attribute option values
        const options = (attr.options || []).map(opt => translateText(opt, locale));
        attributes[attr.id] = { name: label, options };
      }

      entry[locale] = { name, description: desc, short_description: shortDesc, categories, attributes };
    }

    store[product.id] = entry;
    translated++;

    if (translated % 100 === 0) {
      console.log(`  Translated ${translated}/${products.length}...`);
    }
  }

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  // Write output
  fs.writeFileSync(OUT_FILE, JSON.stringify(store, null, 0), "utf-8");
  const sizeMB = (fs.statSync(OUT_FILE).size / 1024 / 1024).toFixed(2);
  console.log(`\n=== Done! ===`);
  console.log(`Translated ${translated} products × ${LOCALES.length} locales`);
  console.log(`Output: ${OUT_FILE} (${sizeMB} MB)`);
}

main().catch(console.error);
