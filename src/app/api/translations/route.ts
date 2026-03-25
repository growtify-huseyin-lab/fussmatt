import { NextRequest, NextResponse } from "next/server";
import {
  getFullStore,
  getTranslationStats,
  setProductTranslation,
  bulkSetTranslations,
} from "@/lib/translations";
import type { TranslatableProductFields } from "@/lib/translations";
import type { Locale } from "@/i18n/config";

const SYNC_SECRET = process.env.SYNC_SECRET_KEY;

function isAuthorized(request: NextRequest): boolean {
  const key = request.nextUrl.searchParams.get("key") ||
    request.headers.get("x-api-key");
  return !!SYNC_SECRET && key === SYNC_SECRET;
}

/**
 * GET /api/translations?key=SECRET
 * Returns translation store & stats.
 *
 * Query params:
 *   ?productId=123  — get translations for a specific product
 *   (no params)     — get full store + stats
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const productId = request.nextUrl.searchParams.get("productId");

  if (productId) {
    const store = getFullStore();
    const translations = store[Number(productId)] || {};
    return NextResponse.json({ productId: Number(productId), translations });
  }

  const stats = getTranslationStats();
  const store = getFullStore();
  return NextResponse.json({ stats, store });
}

/**
 * POST /api/translations
 * Save a product translation.
 *
 * Body:
 *   { productId: 123, locale: "en", fields: { name: "...", description: "..." } }
 *
 * Or bulk:
 *   { entries: [{ productId: 123, locale: "en", fields: {...} }, ...] }
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Bulk mode
    if (body.entries && Array.isArray(body.entries)) {
      const entries = body.entries as {
        productId: number;
        locale: Exclude<Locale, "de">;
        fields: TranslatableProductFields;
      }[];
      bulkSetTranslations(entries);
      return NextResponse.json({
        success: true,
        message: `Saved ${entries.length} translations`,
      });
    }

    // Single mode
    const { productId, locale, fields } = body as {
      productId: number;
      locale: Exclude<Locale, "de">;
      fields: TranslatableProductFields;
    };

    if (!productId || !locale || !fields) {
      return NextResponse.json(
        { error: "Missing required fields: productId, locale, fields" },
        { status: 400 }
      );
    }

    if ((locale as string) === "de") {
      return NextResponse.json(
        { error: "Cannot translate to source language (de)" },
        { status: 400 }
      );
    }

    setProductTranslation(productId, locale, fields);

    return NextResponse.json({
      success: true,
      message: `Translation saved for product ${productId} [${locale}]`,
    });
  } catch (error) {
    console.error("Translation save error:", error);
    return NextResponse.json(
      { error: "Failed to save translation" },
      { status: 500 }
    );
  }
}
