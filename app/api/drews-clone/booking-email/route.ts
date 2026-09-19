import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ToolCall = {
  id?: string;
  toolCallId?: string;
  name?: string;
  function?: { name?: string; arguments?: string | Record<string, unknown> };
  arguments?: string | Record<string, unknown>;
};

type BookingEntry = { tool: string; args: Record<string, unknown> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseToolCall(value: unknown): ToolCall | null {
  if (!isRecord(value)) return null;
  return value as ToolCall;
}

function extractToolCalls(data: Record<string, unknown>): ToolCall[] {
  const message = isRecord(data.message) ? data.message : data;

  const fromMessage = message.toolCalls ?? message.toolCallList;
  if (Array.isArray(fromMessage) && fromMessage.length > 0) {
    return fromMessage.map(parseToolCall).filter((tc): tc is ToolCall => tc !== null);
  }

  if (isRecord(message.toolCall)) {
    const single = parseToolCall(message.toolCall);
    if (single) return [single];
  }

  const withList = data.toolWithToolCallList;
  if (Array.isArray(withList)) {
    return withList
      .map((item) => (isRecord(item) ? parseToolCall(item.toolCall) : null))
      .filter((tc): tc is ToolCall => tc !== null);
  }

  return [];
}

function parseArguments(raw: string | Record<string, unknown> | undefined): Record<string, unknown> {
  if (raw === undefined) return {};
  if (typeof raw === "object") return raw;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : { raw };
  } catch {
    return { raw };
  }
}

function normalizeAuthorization(authRaw: string): { authorization: string; token: string } {
  let authorization = authRaw.trim();
  if (authorization.toLowerCase().startsWith("authorization:")) {
    authorization = authorization.split(":").slice(1).join(":").trim();
  }
  if (!authorization.toLowerCase().startsWith("bearer ")) {
    authorization = `Bearer ${authorization}`;
  }
  const token = authorization.slice(7).trim();
  return { authorization, token };
}

async function fireWebhook(booking: Record<string, unknown>) {
  const url = process.env.DREWS_CLONE_WEBHOOK_URL;
  const authRaw = process.env.DREWS_CLONE_WEBHOOK_AUTH;
  if (!url || !authRaw) {
    console.error("drews-clone-booking: missing DREWS_CLONE_WEBHOOK_URL or DREWS_CLONE_WEBHOOK_AUTH");
    return;
  }

  const { authorization, token } = normalizeAuthorization(authRaw);

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.error("drews-clone-booking: webhook_forward_failed", message);
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "drews-clone-booking-bridge" });
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
  }

  let data: Record<string, unknown> = {};
  try {
    const parsed: unknown = await req.json();
    if (isRecord(parsed)) data = parsed;
  } catch {
    data = {};
  }

  const toolCalls = extractToolCalls(data);
  const bookings: BookingEntry[] = [];
  const results = toolCalls.map((tc) => {
    const toolCallId = tc.id ?? tc.toolCallId ?? "unknown";
    const fn = tc.function ?? {};
    const name = fn.name ?? tc.name ?? "email_drew_booking";
    const args = parseArguments(fn.arguments ?? tc.arguments);
    bookings.push({ tool: name, args });
    return {
      toolCallId,
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
