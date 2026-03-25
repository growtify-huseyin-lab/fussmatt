import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    WORDPRESS_URL: process.env.WORDPRESS_URL?.substring(0, 40) + "...",
    WC_KEY_SET: !!process.env.WC_CONSUMER_KEY,
    WC_SECRET_SET: !!process.env.WC_CONSUMER_SECRET,
    WP_USER: process.env.WP_APPLICATION_USER || "(empty)",
  });
}
