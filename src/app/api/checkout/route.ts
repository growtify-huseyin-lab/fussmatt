import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createOrder } from "@/lib/woocommerce";

const ALLOWED_COUNTRIES = ["DE", "AT", "CH", "FR", "IT", "NL"];
const MAX_QUANTITY = 100;
const MAX_LINE_ITEMS = 50;

const STRIPE_LOCALE_MAP: Record<string, string> = {
  de: "de",
  en: "en",
  fr: "fr",
  it: "it",
  tr: "tr",
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateAddress(addr: Record<string, unknown>, label: string): string | null {
  if (!addr || typeof addr !== "object") return `${label} fehlt`;
  const { first_name, last_name, address_1, city, postcode, country, email } = addr as Record<string, string>;
  if (!first_name?.trim()) return `${label}: Vorname fehlt`;
  if (!last_name?.trim()) return `${label}: Nachname fehlt`;
  if (!address_1?.trim()) return `${label}: Adresse fehlt`;
  if (!city?.trim()) return `${label}: Stadt fehlt`;
  if (!postcode?.trim()) return `${label}: PLZ fehlt`;
  if (!country || !ALLOWED_COUNTRIES.includes(country)) return `${label}: Ung&#252;ltiges Land`;
  if (label === "billing" && (!email || !validateEmail(email))) return `${label}: Ung&#252;ltige E-Mail`;
  return null;
}

function validateLineItems(items: unknown): string | null {
  if (!Array.isArray(items) || items.length === 0) return "Warenkorb ist leer";
  if (items.length > MAX_LINE_ITEMS) return `Maximal ${MAX_LINE_ITEMS} Positionen erlaubt`;

  for (const item of items) {
    if (!item || typeof item !== "object") return "Ung&#252;ltige Position";
    const { product_id, quantity, name, price } = item as Record<string, unknown>;
    if (!product_id || typeof product_id !== "number" || product_id <= 0) return "Ung&#252;ltige Produkt-ID";
    if (!quantity || typeof quantity !== "number" || quantity < 1 || quantity > MAX_QUANTITY) {
      return `Menge muss zwischen 1 und ${MAX_QUANTITY} liegen`;
    }
    if (!name || typeof name !== "string") return "Produktname fehlt";
    if (!price || typeof price !== "number" || price <= 0) return "Ung&#252;ltiger Preis";
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Zahlungssystem ist nicht konfiguriert. Bitte kontaktieren Sie den Support." },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Validate billing address
    const billingError = validateAddress(body.billing, "billing");
    if (billingError) {
      return NextResponse.json({ error: billingError }, { status: 400 });
    }

    // Validate line items (extended with name + price for Stripe)
    const lineItemsError = validateLineItems(body.line_items);
    if (lineItemsError) {
      return NextResponse.json({ error: lineItemsError }, { status: 400 });
    }

    // 1. Create WC order (pending, unpaid)
    const wcOrderData = {
      payment_method: "stripe",
      payment_method_title: "Kreditkarte",
      set_paid: false,
      status: "pending",
      billing: {
        first_name: String(body.billing.first_name).trim(),
        last_name: String(body.billing.last_name).trim(),
        company: String(body.billing.company || "").trim(),
        address_1: String(body.billing.address_1).trim(),
        address_2: String(body.billing.address_2 || "").trim(),
        city: String(body.billing.city).trim(),
        state: String(body.billing.state || "").trim(),
        postcode: String(body.billing.postcode).trim(),
        country: String(body.billing.country).trim(),
        email: String(body.billing.email).trim().toLowerCase(),
        phone: String(body.billing.phone || "").trim(),
      },
      shipping: {
        first_name: String((body.shipping || body.billing).first_name).trim(),
        last_name: String((body.shipping || body.billing).last_name).trim(),
        company: String((body.shipping || body.billing).company || "").trim(),
        address_1: String((body.shipping || body.billing).address_1).trim(),
        address_2: String((body.shipping || body.billing).address_2 || "").trim(),
        city: String((body.shipping || body.billing).city).trim(),
        state: String((body.shipping || body.billing).state || "").trim(),
        postcode: String((body.shipping || body.billing).postcode).trim(),
        country: String((body.shipping || body.billing).country).trim(),
      },
      line_items: (body.line_items as Array<Record<string, unknown>>).map((item) => ({
        product_id: Number(item.product_id),
        variation_id: Number(item.variation_id) || 0,
        quantity: Number(item.quantity),
      })),
    };

    const wcOrder = await createOrder(wcOrderData) as { id: number; total: string };

    // 2. Create Stripe Checkout Session
    const locale = body.locale || "de";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: String(body.billing.email).trim().toLowerCase(),
      locale: (STRIPE_LOCALE_MAP[locale] || "de") as "de" | "en" | "fr" | "it" | "tr",
      line_items: (body.line_items as Array<Record<string, unknown>>).map((item) => ({
        price_data: {
          currency: "chf",
          product_data: {
            name: String(item.name),
          },
          unit_amount: Math.round(Number(item.price) * 100), // cents
        },
        quantity: Number(item.quantity),
      })),
      metadata: {
        wc_order_id: String(wcOrder.id),
      },
      success_url: `${siteUrl}/${locale}/bestellung-bestaetigung?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/kasse`,
    });

    return NextResponse.json({
      sessionUrl: session.url,
      orderId: wcOrder.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Bezahlvorgang konnte nicht gestartet werden. Bitte versuchen Sie es erneut." },
      { status: 500 }
    );
  }
}
