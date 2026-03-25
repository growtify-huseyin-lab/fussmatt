import { NextRequest, NextResponse } from "next/server";
import { runSyncFromXML } from "@/lib/sync";
import fs from "fs";
import path from "path";

const SYNC_SECRET = process.env.SYNC_SECRET_KEY;

/**
 * POST /api/sync/test?key=SECRET
 *
 * Runs sync using the local test XML file (data/test-feed.xml).
 * Useful for testing without hitting the real B2B feed.
 */
export async function POST(request: NextRequest) {
  // Disable in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const body = await request.json();
  const { key, dryRun = false } = body;

  if (!SYNC_SECRET || key !== SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const testFile = path.join(process.cwd(), "data", "test-feed.xml");
  if (!fs.existsSync(testFile)) {
    return NextResponse.json({ error: "Test feed file not found" }, { status: 404 });
  }

  const xmlString = fs.readFileSync(testFile, "utf-8");
  const result = await runSyncFromXML(xmlString, { dryRun });

  return NextResponse.json({ success: true, action: "test", dryRun, result });
}
