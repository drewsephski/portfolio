import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ToolCall = {
  id?: string;
  toolCallId?: string;
  name?: string;
  function?: { name?: string; arguments?: string | Record<string, unknown> };
  arguments?: string | Record<string, unknown>;
};

function extractToolCalls(data: any): ToolCall[] {
  const message = data?.message && typeof data.message === "object" ? data.message : data;
  let toolCalls: ToolCall[] =
    message?.toolCalls ||
    message?.toolCallList ||
    (message?.toolCall ? [message.toolCall] : []) ||
    [];
  if ((!toolCalls || toolCalls.length === 0) && Array.isArray(data?.toolWithToolCallList)) {
    toolCalls = data.toolWithToolCallList.map((item: any) => item?.toolCall).filter(Boolean);
  }
  return toolCalls || [];
}

async function fireWebhook(booking: Record<string, unknown>) {
  const url = process.env.DREWS_CLONE_WEBHOOK_URL;
  const authRaw = process.env.DREWS_CLONE_WEBHOOK_AUTH;
  if (!url || !authRaw) {
    console.error("missing DREWS_CLONE_WEBHOOK_URL or DREWS_CLONE_WEBHOOK_AUTH");
    return;
  }
  let authorization = authRaw.trim();
  if (authorization.toLowerCase().startsWith("authorization:")) {
    authorization = authorization.split(":").slice(1).join(":").trim();
  }
  if (!authorization.toLowerCase().startsWith("bearer ")) {
    authorization = `Bearer ${authorization}`;
  }
  const token = authorization.slice(7).trim();
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        "X-Automation-Key": token,
        "User-Agent": "drews-clone-booking-bridge/vercel",
      },
      body: JSON.stringify(booking),
    });
  } catch (err: any) {
    console.error("webhook_forward_failed", err?.message || err);
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "drews-clone-booking-bridge" });
}

export async function POST(req: NextRequest) {
  let data: any = {};
  try {
    data = await req.json();
  } catch {
    data = {};
  }

  const toolCalls = extractToolCalls(data);
  const bookings: Array<{ tool: string; args: Record<string, unknown> }> = [];
  const results = toolCalls.map((tc) => {
    const tcid = tc.id || tc.toolCallId || "unknown";
    const fn = tc.function || {};
    const name = fn.name || tc.name || "email_drew_booking";
    let args: any = fn.arguments ?? tc.arguments ?? {};
    if (typeof args === "string") {
      try {
        args = JSON.parse(args);
      } catch {
        args = { raw: args };
      }
    }
    bookings.push({ tool: name, args: args as Record<string, unknown> });
    return {
      toolCallId: tcid,
      result: "Booking notification queued for Drew by email.",
    };
  });

  if (results.length === 0) {
    results.push({ toolCallId: "unknown", result: "ok" });
  }

  void fireWebhook({
    type: "drews-clone-booking-email",
    source: "vercel-drewsepeczi.xyz",
    bookings,
  });

  return NextResponse.json({ results });
}
