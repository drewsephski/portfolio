import { NextRequest, NextResponse } from "next/server";
import { isVapiServerWebhookAuthorized, unauthorized } from "../../_lib/auth";
import { handleVapiWebhookBody } from "../../_lib/vapi-webhook/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, service: "drews-clone-vapi-webhook" });
}

export async function POST(req: NextRequest) {
  if (!isVapiServerWebhookAuthorized(req)) {
    return unauthorized();
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const result = await handleVapiWebhookBody(body);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "handler_failed";
    console.error("drews_clone_vapi_webhook_failed", message);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
