import { marketplaceBySlug } from "@/app/marketplace/catalog";
import { getStripeClient } from "@/app/marketplace/stripe";

const INTEGRATION_IDENTIFIER = "pontail_marketplace_qjkmvzra";

function getReturnOrigin(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) return new URL(configuredUrl).origin;

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin) {
    try {
      if (new URL(requestOrigin).origin !== getReturnOrigin(request)) {
        return Response.json({ error: "Cross-origin checkout requests are not allowed" }, { status: 403 });
      }
    } catch {
      return Response.json({ error: "Invalid request origin" }, { status: 403 });
    }
  }

  let slug: unknown;

  try {
    ({ slug } = (await request.json()) as { slug?: unknown });
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof slug !== "string") {
    return Response.json({ error: "A product slug is required" }, { status: 400 });
  }

  const product = marketplaceBySlug.get(slug);
  if (!product) return Response.json({ error: "Product not found" }, { status: 404 });

  try {
    const origin = getReturnOrigin(request);
    const session = await getStripeClient().checkout.sessions.create({
      mode: "payment",
      integration_identifier: INTEGRATION_IDENTIFIER,
      allow_promotion_codes: true,
      client_reference_id: product.slug,
      customer_creation: "always",
      line_items: [{ price: product.stripePriceId, quantity: 1 }],
      metadata: {
        catalog: "pontail_marketplace",
        offering_kind: product.kind,
        pontail_slug: product.slug,
      },
      payment_intent_data: {
        metadata: {
          catalog: "pontail_marketplace",
          offering_kind: product.kind,
          pontail_slug: product.slug,
        },
      },
      success_url: `${origin}/${product.slug}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${product.slug}`,
    });

    if (!session.url) throw new Error("Stripe did not return a Checkout URL");
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Unable to create Stripe Checkout Session", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Checkout is temporarily unavailable" }, { status: 500 });
  }
}
