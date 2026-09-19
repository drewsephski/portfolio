import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ToolCall = {
  id?: string;
  toolCallId?: string;
  name?: string;
  function?: {
    name?: string;
    arguments?: string | Record<string, unknown>;
    parameters?: string | Record<string, unknown>;
  };
  arguments?: string | Record<string, unknown>;
  parameters?: string | Record<string, unknown>;
};

function parseArgSource(value: unknown): Record<string, unknown> {
  if (value == null) {
    return {};
  }
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
      return {};
    } catch {
      return { raw: value };
    }
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function isNonEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length > 0;
}

/** Merge tool-call arg sources; later non-empty sources override earlier keys. */
function extractToolCallArgs(tc: ToolCall): Record<string, unknown> {
  const fn = tc.function ?? {};
  const sources = [
    parseArgSource(fn.arguments),
    parseArgSource(tc.arguments),
    parseArgSource(tc.parameters),
    parseArgSource(fn.parameters),
  ];

  let merged: Record<string, unknown> = {};
  for (const source of sources) {
    if (isNonEmptyObject(source)) {
      merged = { ...merged, ...source };
    }
  }
  if (isNonEmptyObject(merged)) {
    return merged;
  }
  return sources.find((s) => typeof s === "object") ?? {};
}

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
    const fn = tc.function ?? {};
    const name = fn.name || tc.name || "email_drew_booking";
    const args = extractToolCallArgs(tc);
    bookings.push({ tool: name, args });
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
    booking: bookings[0]?.args ?? {},
  });

  return NextResponse.json({ results });
}
