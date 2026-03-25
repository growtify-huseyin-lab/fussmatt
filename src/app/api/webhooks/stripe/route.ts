import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrder } from "@/lib/woocommerce";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

const stripeInstance = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" })
  : null;

export async function POST(request: NextRequest) {
  if (!stripeInstance || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripeInstance.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const wcOrderId = session.metadata?.wc_order_id;

    if (wcOrderId) {
      try {
        await updateOrder(Number(wcOrderId), {
          status: "processing",
          set_paid: true,
          transaction_id: session.payment_intent as string,
        });
        console.log(`Order #${wcOrderId} marked as paid (Stripe PI: ${session.payment_intent})`);
      } catch (err) {
        console.error(`Failed to update WC order #${wcOrderId}:`, err);
        return NextResponse.json({ error: "Order update failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
