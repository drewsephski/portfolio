import { getAgentPrompt } from "@/app/marketplace/deliverable";
import { verifyPaidPurchase } from "@/app/marketplace/purchase";

export async function GET(request: Request, context: RouteContext<"/api/purchases/[slug]">) {
  const { slug } = await context.params;
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return Response.json({ error: "Session ID is required" }, { status: 400 });

  try {
    const purchase = await verifyPaidPurchase(slug, sessionId);
    if (!purchase) return Response.json({ error: "Paid purchase not found" }, { status: 403 });

    return Response.json(
      {
        purchased: true,
        agentPrompt: getAgentPrompt(purchase.product.name, purchase.product.kind),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Unable to verify Stripe purchase", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Purchase verification is temporarily unavailable" }, { status: 500 });
  }
}
