import "server-only";

import Stripe from "stripe";
import { marketplaceBySlug } from "./catalog";
import { getStripeClient } from "./stripe";

export async function verifyPaidPurchase(slug: string, sessionId: string) {
  const product = marketplaceBySlug.get(slug);
  if (!product || !sessionId.startsWith("cs_")) return null;

  let session: Stripe.Checkout.Session;

  try {
    session = await getStripeClient().checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeInvalidRequestError) return null;
    throw error;
  }

  if (
    session.status !== "complete" ||
    !["paid", "no_payment_required"].includes(session.payment_status) ||
    session.metadata?.pontail_slug !== product.slug
  ) {
    return null;
  }

  const containsExpectedPrice = session.line_items?.data.some((item) => {
    const priceId = typeof item.price === "string" ? item.price : item.price?.id;
    return priceId === product.stripePriceId;
  });

  return containsExpectedPrice ? { product, session } : null;
}
