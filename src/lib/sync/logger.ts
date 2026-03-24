/**
 * Sync Logger
 *
 * Writes logs to /data/sync-logs/YYYY-MM-DD.log
 */

import fs from "fs";
import path from "path";
import type { SyncLog } from "./types";

const LOG_DIR = path.join(process.cwd(), "data", "sync-logs");

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function getLogFile(): string {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return path.join(LOG_DIR, `${date}.log`);
}

export function log(entry: SyncLog) {
  ensureLogDir();
  const line = JSON.stringify({
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  }) + "\n";

  fs.appendFileSync(getLogFile(), line, "utf-8");

  // Also console log for dev
  const icon = entry.action === "error" ? "\u274c" : entry.action === "product_created" ? "\u2795" : entry.action === "product_updated" ? "\u267b\ufe0f" : "\u2139\ufe0f";
  console.log(`[SYNC] ${icon} ${entry.message}`);
}

export function logInfo(message: string, data?: Record<string, unknown>) {
  log({ timestamp: new Date().toISOString(), action: "info", message, data });
}

export function logError(message: string, data?: Record<string, unknown>) {
  log({ timestamp: new Date().toISOString(), action: "error", message, data });
}

export function logProductCreated(sku: string, wcId: number) {
  log({
    timestamp: new Date().toISOString(),
    action: "product_created",
    message: `Created: ${sku} → WC#${wcId}`,
    data: { sku, wcId },
  });
}

export function logProductUpdated(sku: string, wcId: number) {
  log({
    timestamp: new Date().toISOString(),
    action: "product_updated",
    message: `Updated: ${sku} → WC#${wcId}`,
    data: { sku, wcId },
  });
}

/**
 * Read today's log entries.
 */
export function readTodayLog(): SyncLog[] {
  const file = getLogFile();
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, "utf-8").trim().split("\n");
  return lines.filter(Boolean).map((line) => JSON.parse(line) as SyncLog);
}
