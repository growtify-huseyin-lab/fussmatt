import { NextRequest, NextResponse } from "next/server";
import { importFromCSV, type CSVProductRow } from "@/lib/sync/csv-importer";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

const SYNC_SECRET = process.env.SYNC_SECRET_KEY || "fussmatt-sync-2026";
const CSV_PATH = path.join(process.cwd(), "data", "products-export.csv");

// Cache parsed rows in memory (42MB CSV → parse once)
let cachedRows: CSVProductRow[] | null = null;

function getRows(): CSVProductRow[] {
  if (cachedRows) return cachedRows;

  if (!fs.existsSync(CSV_PATH)) {
    throw new Error("CSV file not found. Copy to data/products-export.csv first.");
  }

  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
  const parsed = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  // Filter: only DE language rows with valid SKU (avoid WPML duplicates)
  cachedRows = parsed.filter((r) => {
    const sku = r.Sku?.trim();
    const lang = (r["WPML Language Code"] || "de").trim().toLowerCase();
    return sku && !sku.startsWith("http") && sku.length < 30 && lang === "de";
  }) as unknown as CSVProductRow[];

  return cachedRows;
}

/**
 * POST /api/import
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, batchSize = 50, offset = 0, dryRun = false, syncImages = false } = body;

    if (key !== SYNC_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = getRows();
    const result = await importFromCSV(rows, { batchSize, offset, dryRun, syncImages });

    const response: Record<string, unknown> = {
      success: true,
      action: "csv-import",
      priceMarkup: "+9 CHF",
      currency: "CHF",
      result,
    };

    if (result.hasMore) {
      response.nextOffset = offset + batchSize;
      response.nextBody = { key: "[SECRET]", batchSize, offset: offset + batchSize, dryRun, syncImages };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Import failed", message: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/import?key=SECRET — Preview stats
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (key !== SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = getRows();
    const withGTIN = rows.filter((r) => r["Global Unique Id"]?.trim()).length;
    const withMarke = rows.filter((r) => {
      const v = r["Attribute Value (pa_marke)"]?.trim();
      return v && v !== "yes" && v !== "no";
    }).length;

    // Price sample
    const sample = rows[0];
    const samplePrice = parseFloat(sample?.["Regular Price"] || sample?.Price || "0");

    return NextResponse.json({
      totalProducts: rows.length,
      withGTIN,
      withMarke,
      priceMarkup: "+9 CHF",
      sampleOriginalPrice: samplePrice,
      sampleFinalPrice: samplePrice + 9,
      currency: "CHF",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
