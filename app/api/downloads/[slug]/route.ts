import { createReadStream } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { verifyPaidPurchase } from "@/app/marketplace/purchase";

export async function GET(request: Request, context: RouteContext<"/api/downloads/[slug]">) {
  const { slug } = await context.params;
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return Response.json({ error: "Session ID is required" }, { status: 400 });

  try {
    const purchase = await verifyPaidPurchase(slug, sessionId);
    if (!purchase) return Response.json({ error: "Paid purchase not found" }, { status: 403 });

    const filename = `${purchase.product.slug}-nextjs.zip`;
    const file = createReadStream(join(process.cwd(), "private", "downloads", filename));
    const stream = Readable.toWeb(file) as unknown as BodyInit;

    return new Response(stream, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/zip",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Unable to deliver marketplace download", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Download is temporarily unavailable" }, { status: 500 });
  }
}
