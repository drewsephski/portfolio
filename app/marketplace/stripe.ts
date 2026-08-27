import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripeClient() {
  if (stripeClient) return stripeClient;

  const apiKey = process.env.STRIPE_RESTRICTED_KEY ?? process.env.STRIPE_SECRET_KEY;
  if (!apiKey) throw new Error("Stripe API key is not configured");

  stripeClient = new Stripe(apiKey, { apiVersion: "2026-08-26.dahlia" });
  return stripeClient;
}

export function getStripeWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Stripe webhook secret is not configured");
  return secret;
}
