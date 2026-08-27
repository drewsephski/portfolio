import type Stripe from "stripe";
import { marketplaceBySlug } from "@/app/marketplace/catalog";
import { getStripeClient, getStripeWebhookSecret } from "@/app/marketplace/stripe";

const handledEvents = new Set<Stripe.Event.Type>([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
]);

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing Stripe signature" }, { status: 400 });

  let event: Stripe.Event;
  let webhookSecret: string;

  try {
    webhookSecret = getStripeWebhookSecret();
  } catch (error) {
    console.error("Stripe webhook is not configured", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Webhook is not configured" }, { status: 500 });
  }

  try {
    event = getStripeClient().webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.warn("Rejected Stripe webhook", error instanceof Error ? error.message : "Invalid signature");
    return Response.json({ error: "Invalid Stripe signature" }, { status: 400 });
  }

  if (handledEvents.has(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    const slug = session.metadata?.pontail_slug;
    if (session.metadata?.catalog !== "pontail_marketplace" || !slug || !marketplaceBySlug.has(slug)) {
      return Response.json({ received: true });
    }

    console.info("Processed Stripe checkout event", {
      eventId: event.id,
      eventType: event.type,
      sessionId: session.id,
      slug,
    });
  }

  return Response.json({ received: true });
}
