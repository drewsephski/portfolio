import { NextRequest, NextResponse } from "next/server";
import { isDrewsCloneAuthorized, unauthorized } from "../_lib/auth";
import { lookupPhoneWithContact } from "../_lib/contacts";
import { getSql, normalizePhone } from "../_lib/db";

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

type LeadRow = {
  phone: string;
  name: string;
  email: string;
  last_purpose: string;
  last_call_at: string | Date | null;
  notes: string;
  call_count: number;
  created_at: string | Date;
  updated_at: string | Date;
};

type LeadPayload = {
  phone: string;
  name: string;
  email: string;
  lastPurpose: string;
  lastCallAt: string | null;
  notes: string;
  callCount: number;
  createdAt: string;
  updatedAt: string;
};

type UpsertInput = {
  phone: string;
  name?: string;
  email?: string;
  lastPurpose?: string;
  notes?: string;
  lastCallAt?: string;
  action?: "lookup" | "upsert";
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
  const message =
    data?.message && typeof data.message === "object"
      ? (data.message as Record<string, unknown>)
      : data;
  let toolCalls: ToolCall[] =
    (message?.toolCalls as ToolCall[]) ||
    (message?.toolCallList as ToolCall[]) ||
    (message?.toolCall ? [message.toolCall as ToolCall] : []) ||
    [];
  if (
    (!toolCalls || toolCalls.length === 0) &&
    Array.isArray(data?.toolWithToolCallList)
  ) {
    toolCalls = (data.toolWithToolCallList as Array<{ toolCall?: ToolCall }>)
      .map((item) => item?.toolCall)
      .filter(Boolean) as ToolCall[];
  }
  return toolCalls || [];
}

function rowToLead(row: LeadRow): LeadPayload {
  return {
    phone: row.phone,
    name: row.name,
    email: row.email,
    lastPurpose: row.last_purpose,
    lastCallAt: row.last_call_at ? new Date(row.last_call_at).toISOString() : null,
    notes: row.notes,
    callCount: row.call_count,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function leadSummary(lead: LeadPayload): string {
  const parts = [lead.name || "Unknown", lead.phone];
  if (lead.lastPurpose) {
    parts.push(lead.lastPurpose);
  }
  parts.push(`${lead.callCount} call(s)`);
  return parts.filter(Boolean).join(" · ");
}

function parseLastCallAt(value: unknown): Date | null {
  if (value == null || value === "") {
    return null;
  }
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d;
    }
  }
  return null;
}

function strField(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseUpsertInput(source: Record<string, unknown>): UpsertInput | null {
  const phoneRaw =
    (typeof source.phone === "string" ? source.phone : undefined) ??
    (typeof source.Phone === "string" ? source.Phone : undefined);
  if (!phoneRaw) {
    return null;
  }
  const phone = normalizePhone(phoneRaw);
  if (!phone) {
    return null;
  }

  const actionRaw = strField(source.action) ?? strField(source.Action);
  let action: "lookup" | "upsert" | undefined;
  if (actionRaw === "lookup" || actionRaw === "upsert") {
    action = actionRaw;
  }

  return {
    phone,
    name: strField(source.name) ?? strField(source.Name),
    email: strField(source.email) ?? strField(source.Email),
    lastPurpose:
      strField(source.lastPurpose) ??
      strField(source.last_purpose) ??
      strField(source.LastPurpose),
    notes: strField(source.notes) ?? strField(source.Notes),
    lastCallAt:
      strField(source.lastCallAt) ??
      strField(source.last_call_at) ??
      strField(source.LastCallAt),
    action,
  };
}

async function lookupLead(phone: string): Promise<{ found: boolean; lead?: LeadPayload }> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DREWS_CLONE_DATABASE_URL is not configured");
  }
  const rows = await sql`
    SELECT phone, name, email, last_purpose, last_call_at, notes, call_count, created_at, updated_at
    FROM drews_clone_leads
    WHERE phone = ${phone}
  `;
  const row = rows[0] as LeadRow | undefined;
  if (!row) {
    return { found: false };
  }
  return { found: true, lead: rowToLead(row) };
}

async function upsertLead(input: UpsertInput): Promise<LeadPayload> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DREWS_CLONE_DATABASE_URL is not configured");
  }

  const lastCallAt = parseLastCallAt(input.lastCallAt) ?? new Date();

  const existingRows = await sql`
    SELECT phone, name, email, last_purpose, last_call_at, notes, call_count, created_at, updated_at
    FROM drews_clone_leads
    WHERE phone = ${input.phone}
  `;

  if (existingRows.length > 0) {
    const existing = existingRows[0] as LeadRow;
    const name = input.name ?? existing.name;
    const email = input.email ?? existing.email;
    const notes = input.notes ?? existing.notes;
    const lastPurpose = input.lastPurpose ?? existing.last_purpose;

    const rows = await sql`
      UPDATE drews_clone_leads
      SET
        name = ${name},
        email = ${email},
        notes = ${notes},
        last_purpose = ${lastPurpose},
        last_call_at = ${lastCallAt.toISOString()}::timestamptz,
        call_count = call_count + 1,
        updated_at = NOW()
      WHERE phone = ${input.phone}
      RETURNING phone, name, email, last_purpose, last_call_at, notes, call_count, created_at, updated_at
    `;
    return rowToLead(rows[0] as LeadRow);
  }

  const rows = await sql`
    INSERT INTO drews_clone_leads (
      phone, name, email, last_purpose, last_call_at, notes, call_count
    ) VALUES (
      ${input.phone},
      ${input.name ?? ""},
      ${input.email ?? ""},
      ${input.lastPurpose ?? ""},
      ${lastCallAt.toISOString()}::timestamptz,
      ${input.notes ?? ""},
      1
    )
    RETURNING phone, name, email, last_purpose, last_call_at, notes, call_count, created_at, updated_at
  `;
  return rowToLead(rows[0] as LeadRow);
}

export async function GET(req: NextRequest) {
  const phoneParam = req.nextUrl.searchParams.get("phone");
  if (!phoneParam) {
    return NextResponse.json({ ok: true, service: "drews-clone-leads" });
  }

  if (!isDrewsCloneAuthorized(req)) {
    return unauthorized();
  }

  const phone = normalizePhone(phoneParam);
  if (!phone) {
    return NextResponse.json({ error: "Invalid or missing phone" }, { status: 400 });
  }

  try {
    const result = await lookupPhoneWithContact(phone, lookupLead);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database error";
    console.error("drews_clone_leads_get_failed", message);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!isDrewsCloneAuthorized(req)) {
    return unauthorized();
  }

  let data: Record<string, unknown> = {};
  try {
    data = (await req.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }

  const toolCalls = extractToolCalls(data);

  if (toolCalls.length > 0) {
    const results: Array<{ toolCallId: string; result: string }> = [];
    for (const tc of toolCalls) {
      const tcid = tc.id || tc.toolCallId || "unknown";
      const args = extractToolCallArgs(tc);
      const merged = { ...data, ...args };
      const input = parseUpsertInput(merged);
      if (!input) {
        results.push({
          toolCallId: tcid,
          result: JSON.stringify({ error: "Invalid or missing phone" }),
        });
        continue;
      }
      try {
        if (input.action === "lookup") {
          const outcome = await lookupPhoneWithContact(input.phone, lookupLead);
          results.push({
            toolCallId: tcid,
            result: JSON.stringify(outcome),
          });
        } else {
          const lead = await upsertLead(input);
          results.push({
            toolCallId: tcid,
            result: JSON.stringify(lead),
          });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Database error";
        console.error("drews_clone_leads_tool_call_failed", message);
        results.push({
          toolCallId: tcid,
          result: JSON.stringify({ error: "Service unavailable" }),
        });
      }
    }
    return NextResponse.json({ results });
  }

  const input = parseUpsertInput(data);
  if (!input) {
    return NextResponse.json({ error: "Invalid or missing phone" }, { status: 400 });
  }

  try {
    if (input.action === "lookup") {
      const outcome = await lookupPhoneWithContact(input.phone, lookupLead);
      return NextResponse.json(outcome);
    }
    const lead = await upsertLead(input);
    return NextResponse.json({ ok: true, lead });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database error";
    console.error("drews_clone_leads_post_failed", message);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
