import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

export function getStripe(): Stripe | null {
  if (!STRIPE_SECRET_KEY) return null;
  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });
}

export const stripe = getStripe();
