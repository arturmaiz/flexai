import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

export const FREE_PLAN_LIMIT = 3;
