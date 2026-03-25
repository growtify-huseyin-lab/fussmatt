import { NextRequest, NextResponse } from "next/server";
import { runSync, runStockSync, readTodayLog } from "@/lib/sync";

const SYNC_SECRET = process.env.SYNC_SECRET_KEY;

/**
 * GET /api/sync?key=SECRET
 * Returns today's sync logs and status.
 *
 * GET /api/sync?key=SECRET&action=status
 * Returns sync status overview.
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!SYNC_SECRET || key !== SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = readTodayLog();
  return NextResponse.json({
    date: new Date().toISOString().split("T")[0],
    totalEntries: logs.length,
    logs: logs.slice(-50), // last 50 entries
  });
}

/**
 * POST /api/sync
 *
 * Body:
 * {
 *   "key": "SECRET",
 *   "action": "full" | "stock",
 *   "batchSize": 50,
 *   "offset": 0,
 *   "dryRun": false,
 *   "syncImages": false,
 *   "feedUrl": "https://..." (optional override)
 * }
 *
 * Actions:
 *   "full"  — Full sync: creates new products + updates existing
 *   "stock" — Stock sync: only updates price/stock for existing products
 *
 * Self-chaining:
 *   If hasMore=true in response, call again with the returned nextOffset.
 *   cron-job.org can chain calls using the nextUrl in the response.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      key,
      action = "full",
      batchSize = 50,
      offset = 0,
      dryRun = false,
      syncImages = false,
      feedUrl,
    } = body;

    // Auth check
    if (!SYNC_SECRET || key !== SYNC_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate action
    if (!["full", "stock"].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "full" or "stock".' },
        { status: 400 }
      );
    }

    // Run sync
    const result = action === "stock"
      ? await runStockSync({ batchSize, offset, feedUrl })
      : await runSync({ batchSize, offset, dryRun, syncImages, feedUrl });

    // Build response with self-chaining info
    const response: Record<string, unknown> = {
      success: true,
      action,
      result,
    };

    // If there are more products, provide the next URL for chaining
    if (result.hasMore) {
      const nextOffset = offset + batchSize;
      response.nextOffset = nextOffset;
      response.nextUrl = `/api/sync`;
      response.nextBody = {
        key: "[SECRET]",
        action,
        batchSize,
        offset: nextOffset,
        dryRun,
        syncImages,
        feedUrl,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Sync API error:", error);
    return NextResponse.json(
      { error: "Sync failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
