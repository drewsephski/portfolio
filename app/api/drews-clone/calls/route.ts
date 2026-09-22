import { NextRequest, NextResponse } from "next/server";
import { bumpLeadFromCall } from "../_lib/bump-lead-from-call";
import {
  isDrewsCloneWebhookIngestAuthorized,
  unauthorized,
} from "../_lib/auth";
import {
  asRecord,
  getSql,
  normalizePhone,
  parseTimestamp,
  strField,
} from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DREWS_CLONE_ASSISTANT_ID = "5aa57a90-3fcf-47b3-ba73-ec81ab97270c";

type ParsedCall = {
  callId: string;
  assistantId?: string;
  phone?: string;
  callerName?: string;
  callerEmail?: string;
  startedAt: Date | null;
  endedAt: Date | null;
  durationSeconds: number | null;
  endedReason?: string;
  summary?: string;
  transcript?: string;
  recordingUrl?: string;
  booked: boolean;
  bookingSummary?: string;
  bookingStart: Date | null;
  bookingEnd: Date | null;
  calendarLink?: string;
  raw: Record<string, unknown>;
};

function intField(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) {
      return Math.round(n);
    }
  }
  return null;
}

function boolField(value: unknown): boolean {
  if (value === true || value === "true" || value === 1 || value === "1") {
    return true;
  }
  return false;
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    const s = strField(value);
    if (s) {
      return s;
    }
  }
  return undefined;
}

function extractPhoneFromCustomer(customer: Record<string, unknown> | undefined): string | undefined {
  if (!customer) {
    return undefined;
  }
  return firstString(customer.number, customer.phoneNumber, customer.phone);
}

function parseNormalizedPayload(data: Record<string, unknown>): ParsedCall | null {
  const callId = firstString(data.callId, data.call_id);
  if (!callId) {
    return null;
  }

  const raw =
    asRecord(data.raw) ??
    (Object.keys(data).length > 0 ? { ...data } : {});

  return {
    callId,
    assistantId: firstString(data.assistantId, data.assistant_id),
    phone: firstString(data.phone),
    callerName: firstString(data.callerName, data.caller_name),
    callerEmail: firstString(data.callerEmail, data.caller_email),
    startedAt: parseTimestamp(data.startedAt ?? data.started_at),
    endedAt: parseTimestamp(data.endedAt ?? data.ended_at),
    durationSeconds: intField(data.durationSeconds ?? data.duration_seconds),
    endedReason: firstString(data.endedReason, data.ended_reason),
    summary: firstString(data.summary),
    transcript: firstString(data.transcript),
    recordingUrl: firstString(data.recordingUrl, data.recording_url),
    booked: boolField(data.booked),
    bookingSummary: firstString(data.bookingSummary, data.booking_summary),
    bookingStart: parseTimestamp(data.bookingStart ?? data.booking_start),
    bookingEnd: parseTimestamp(data.bookingEnd ?? data.booking_end),
    calendarLink: firstString(data.calendarLink, data.calendar_link),
    raw,
  };
}

function parseVapiEndOfCallPayload(data: Record<string, unknown>): ParsedCall | null {
  const message = asRecord(data.message);
  const call = asRecord(data.call) ?? asRecord(message?.call);
  if (!call) {
    return null;
  }

  const callId = firstString(call.id, call.callId);
  if (!callId) {
    return null;
  }

  const customer = asRecord(call.customer);
  const analysis = asRecord(data.analysis) ?? asRecord(message?.analysis);
  const artifact = asRecord(data.artifact) ?? asRecord(message?.artifact);

  const summary =
    firstString(
      data.summary,
      message?.summary,
      analysis?.summary,
      artifact?.summary,
      asRecord(analysis?.structuredData)?.summary
    ) ?? undefined;

  const transcript =
    firstString(
      data.transcript,
      message?.transcript,
      artifact?.transcript,
      artifact?.messagesTranscript
    ) ?? undefined;

  const recording = asRecord(artifact?.recording);
  const recordingUrl =
    firstString(
      data.recordingUrl,
      data.recording_url,
      message?.recordingUrl,
      artifact?.recordingUrl,
      recording?.url
    ) ?? undefined;

  const startedAt =
    parseTimestamp(call.startedAt ?? call.startTime ?? data.startedAt ?? message?.startedAt) ??
    null;
  const endedAt =
    parseTimestamp(call.endedAt ?? call.endTime ?? data.endedAt ?? message?.endedAt) ?? null;

  let durationSeconds = intField(
    data.durationSeconds ??
      data.duration ??
      call.durationSeconds ??
      call.duration ??
      message?.durationSeconds
  );
  if (durationSeconds == null && startedAt && endedAt) {
    durationSeconds = Math.max(
      0,
      Math.round((endedAt.getTime() - startedAt.getTime()) / 1000)
    );
  }

  const booking = asRecord(data.booking) ?? asRecord(message?.booking);

  return {
    callId,
    assistantId: firstString(call.assistantId, call.assistant_id),
    phone: extractPhoneFromCustomer(customer),
    callerName: firstString(customer?.name, call.callerName),
    callerEmail: firstString(customer?.email, call.callerEmail),
    startedAt,
    endedAt,
    durationSeconds,
    endedReason: firstString(data.endedReason, message?.endedReason, call.endedReason),
    summary,
    transcript,
    recordingUrl,
    booked: boolField(data.booked ?? booking?.booked),
    bookingSummary: firstString(booking?.summary, booking?.bookingSummary),
    bookingStart: parseTimestamp(booking?.start ?? booking?.bookingStart),
    bookingEnd: parseTimestamp(booking?.end ?? booking?.bookingEnd),
    calendarLink: firstString(booking?.calendarLink, booking?.link),
    raw: data,
  };
}

function parseCallPayload(data: Record<string, unknown>): ParsedCall | null {
  const normalized = parseNormalizedPayload(data);
  if (normalized) {
    return normalized;
  }
  return parseVapiEndOfCallPayload(data);
}

function shouldSkipAssistant(assistantId?: string): boolean {
  if (!assistantId) {
    return false;
  }
  return assistantId !== DREWS_CLONE_ASSISTANT_ID;
}

function toIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function emptyText(value?: string): string {
  return value ?? "";
}

async function upsertCall(parsed: ParsedCall): Promise<void> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DREWS_CLONE_DATABASE_URL is not configured");
  }

  const rawJson = JSON.stringify(parsed.raw);
  const storedPhone = parsed.phone ? normalizePhone(parsed.phone) : null;
  const disposition = parsed.booked ? "booked" : "needs_you";

  await sql`
    INSERT INTO drews_clone_calls (
      call_id,
      assistant_id,
      phone,
      caller_name,
      caller_email,
      started_at,
      ended_at,
      duration_seconds,
      ended_reason,
      summary,
      transcript,
      recording_url,
      booked,
      booking_summary,
      booking_start,
      booking_end,
      calendar_link,
      raw_json,
      disposition,
      created_at
    ) VALUES (
      ${parsed.callId},
      ${parsed.assistantId ?? null},
      ${storedPhone},
      ${emptyText(parsed.callerName)},
      ${emptyText(parsed.callerEmail)},
      ${toIso(parsed.startedAt)}::timestamptz,
      ${toIso(parsed.endedAt)}::timestamptz,
      ${parsed.durationSeconds},
      ${emptyText(parsed.endedReason)},
      ${emptyText(parsed.summary)},
      ${emptyText(parsed.transcript)},
      ${emptyText(parsed.recordingUrl)},
      ${parsed.booked},
      ${emptyText(parsed.bookingSummary)},
      ${toIso(parsed.bookingStart)}::timestamptz,
      ${toIso(parsed.bookingEnd)}::timestamptz,
      ${emptyText(parsed.calendarLink)},
      ${rawJson}::jsonb,
      ${disposition},
      NOW()
    )
    ON CONFLICT (call_id) DO UPDATE SET
      assistant_id = EXCLUDED.assistant_id,
      phone = EXCLUDED.phone,
      caller_name = EXCLUDED.caller_name,
      caller_email = EXCLUDED.caller_email,
      started_at = EXCLUDED.started_at,
      ended_at = EXCLUDED.ended_at,
      duration_seconds = EXCLUDED.duration_seconds,
      ended_reason = EXCLUDED.ended_reason,
      summary = EXCLUDED.summary,
      transcript = EXCLUDED.transcript,
      recording_url = EXCLUDED.recording_url,
      booked = EXCLUDED.booked,
      booking_summary = EXCLUDED.booking_summary,
      booking_start = EXCLUDED.booking_start,
      booking_end = EXCLUDED.booking_end,
      calendar_link = EXCLUDED.calendar_link,
      raw_json = EXCLUDED.raw_json,
      disposition = CASE
        WHEN EXCLUDED.booked THEN 'booked'
        ELSE drews_clone_calls.disposition
      END,
      created_at = drews_clone_calls.created_at
  `;
}

type CallRow = {
  call_id: string;
  assistant_id: string | null;
  phone: string | null;
  caller_name: string | null;
  caller_email: string | null;
  started_at: string | Date | null;
  ended_at: string | Date | null;
  duration_seconds: number | null;
  ended_reason: string | null;
  summary: string | null;
  transcript: string | null;
  recording_url: string | null;
  booked: boolean;
  booking_summary: string | null;
  booking_start: string | Date | null;
  booking_end: string | Date | null;
  calendar_link: string | null;
  created_at: string | Date;
};

function rowToJson(row: CallRow) {
  return {
    callId: row.call_id,
    assistantId: row.assistant_id,
    phone: row.phone,
    callerName: row.caller_name,
    callerEmail: row.caller_email,
    startedAt: row.started_at ? new Date(row.started_at).toISOString() : null,
    endedAt: row.ended_at ? new Date(row.ended_at).toISOString() : null,
    durationSeconds: row.duration_seconds,
    endedReason: row.ended_reason,
    summary: row.summary,
    transcript: row.transcript,
    recordingUrl: row.recording_url,
    booked: row.booked,
    bookingSummary: row.booking_summary,
    bookingStart: row.booking_start ? new Date(row.booking_start).toISOString() : null,
    bookingEnd: row.booking_end ? new Date(row.booking_end).toISOString() : null,
    calendarLink: row.calendar_link,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const callIdParam = req.nextUrl.searchParams.get("callId");
  const phoneParam = req.nextUrl.searchParams.get("phone");

  if (!callIdParam && !phoneParam) {
    return NextResponse.json({ ok: true, service: "drews-clone-calls" });
  }

  if (!isDrewsCloneWebhookIngestAuthorized(req)) {
    return unauthorized();
  }

  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    if (callIdParam) {
      const rows = await sql`
        SELECT
          call_id, assistant_id, phone, caller_name, caller_email,
          started_at, ended_at, duration_seconds, ended_reason,
          summary, transcript, recording_url, booked,
          booking_summary, booking_start, booking_end, calendar_link,
          created_at
        FROM drews_clone_calls
        WHERE call_id = ${callIdParam}
      `;
      const row = rows[0] as CallRow | undefined;
      if (!row) {
        return NextResponse.json({ found: false });
      }
      return NextResponse.json({ found: true, call: rowToJson(row) });
    }

    const phone = normalizePhone(phoneParam ?? "");
    if (!phone) {
      return NextResponse.json({ error: "Invalid or missing phone" }, { status: 400 });
    }

    const rows = await sql`
      SELECT
        call_id, assistant_id, phone, caller_name, caller_email,
        started_at, ended_at, duration_seconds, ended_reason,
        summary, transcript, recording_url, booked,
        booking_summary, booking_start, booking_end, calendar_link,
        created_at
      FROM drews_clone_calls
      WHERE phone = ${phone}
      ORDER BY COALESCE(ended_at, started_at, created_at) DESC NULLS LAST
      LIMIT 20
    `;

    return NextResponse.json({
      phone,
      calls: (rows as CallRow[]).map(rowToJson),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database error";
    console.error("drews_clone_calls_get_failed", message);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!isDrewsCloneWebhookIngestAuthorized(req)) {
    return unauthorized();
  }

  let data: Record<string, unknown> = {};
  try {
    data = (await req.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }

  const parsed = parseCallPayload(data);
  if (!parsed?.callId) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "missing callId",
    });
  }

  if (shouldSkipAssistant(parsed.assistantId)) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "assistant not allowed",
    });
  }

  try {
    await upsertCall(parsed);

    let leadUpserted = false;
    if (parsed.phone) {
      const normalized = normalizePhone(parsed.phone);
      if (normalized) {
        leadUpserted = await bumpLeadFromCall({
          phone: parsed.phone,
          callerName: parsed.callerName,
          callerEmail: parsed.callerEmail,
          summary: parsed.summary,
          lastCallAt: parsed.endedAt ?? parsed.startedAt,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      callId: parsed.callId,
      ...(leadUpserted ? { leadUpserted: true } : {}),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database error";
    console.error("drews_clone_calls_post_failed", message);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
