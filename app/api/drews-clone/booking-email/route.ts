import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOOL_EMAIL_DREW_BOOKING = "email_drew_booking";
const TOOL_EMAIL_VIP_FOLLOWUP = "email_vip_followup";

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

/** Args forwarded to Cursor when Vapi invokes `email_vip_followup`. */
type VipFollowupPayload = {
  toEmail?: string;
  mode?: string;
  callSummary?: string;
  personalHook?: string;
  voiceAgentIdea?: string;
  toName?: string;
  toPhone?: string;
  subjectHint?: string;
};

type BookingEntry = { tool: string; args: Record<string, unknown> };

type DrewsCloneBookingWebhook = {
  type: "drews-clone-booking-email";
  source: string;
  bookings: BookingEntry[];
  booking: Record<string, unknown>;
};

type DrewsCloneVipFollowupWebhook = {
  type: "drews-clone-vip-followup";
  source: string;
  bookings: BookingEntry[];
  booking: Record<string, unknown>;
  vipFollowup: VipFollowupPayload;
};

type DrewsCloneWebhookPayload = DrewsCloneBookingWebhook | DrewsCloneVipFollowupWebhook;

function toVipFollowupPayload(args: Record<string, unknown>): VipFollowupPayload {
  const pick = (key: keyof VipFollowupPayload): string | undefined => {
    const value = args[key];
    return typeof value === "string" ? value : undefined;
  };
  return {
    toEmail: pick("toEmail"),
    mode: pick("mode"),
    callSummary: pick("callSummary"),
    personalHook: pick("personalHook"),
    voiceAgentIdea: pick("voiceAgentIdea"),
    toName: pick("toName"),
    toPhone: pick("toPhone"),
    subjectHint: pick("subjectHint"),
  };
}

function toolResultMessage(toolName: string): string {
  if (toolName === TOOL_EMAIL_VIP_FOLLOWUP) {
    return "VIP follow-up email queued.";
  }
  return "Booking notification queued for Drew by email.";
}

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

function extractToolCalls(data: Record<string, unknown>): ToolCall[] {
  const messageRaw = data.message;
  const message =
    messageRaw && typeof messageRaw === "object" && messageRaw !== null
      ? (messageRaw as Record<string, unknown>)
      : data;
  let toolCalls: ToolCall[] =
    (message.toolCalls as ToolCall[] | undefined) ||
    (message.toolCallList as ToolCall[] | undefined) ||
    (message.toolCall ? [message.toolCall as ToolCall] : []) ||
    [];
  if ((!toolCalls || toolCalls.length === 0) && Array.isArray(data.toolWithToolCallList)) {
    toolCalls = data.toolWithToolCallList
      .map((item: unknown) => {
        if (typeof item === "object" && item !== null && "toolCall" in item) {
          return (item as { toolCall?: ToolCall }).toolCall;
        }
        return undefined;
      })
      .filter((tc): tc is ToolCall => Boolean(tc));
  }
  return toolCalls || [];
}

async function fireWebhook(payload: DrewsCloneWebhookPayload) {
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
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    console.error(
      "webhook_forward_failed",
      err instanceof Error ? err.message : String(err),
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "drews-clone-booking-bridge" });
}

export async function POST(req: NextRequest) {
  let data: Record<string, unknown> = {};
  try {
    const parsed: unknown = await req.json();
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      data = parsed as Record<string, unknown>;
    }
  } catch {
    data = {};
  }

  const toolCalls = extractToolCalls(data);
  const bookings: BookingEntry[] = [];
  const results = toolCalls.map((tc) => {
    const tcid = tc.id || tc.toolCallId || "unknown";
    const fn = tc.function ?? {};
    const name = fn.name || tc.name || TOOL_EMAIL_DREW_BOOKING;
    const args = extractToolCallArgs(tc);
    bookings.push({ tool: name, args });
    return {
      toolCallId: tcid,
      result: toolResultMessage(name),
    };
  });

  if (results.length === 0) {
    results.push({ toolCallId: "unknown", result: "ok" });
  }

  const source = "vercel-drewsepeczi.xyz";
  const booking = bookings[0]?.args ?? {};
  const vipEntry = bookings.find((b) => b.tool === TOOL_EMAIL_VIP_FOLLOWUP);

  if (vipEntry) {
    void fireWebhook({
      type: "drews-clone-vip-followup",
      source,
      bookings,
      booking,
      vipFollowup: toVipFollowupPayload(vipEntry.args),
    });
  } else {
    void fireWebhook({
      type: "drews-clone-booking-email",
      source,
      bookings,
      booking,
    });
  }

  return NextResponse.json({ results });
}
