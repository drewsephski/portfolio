import { bumpLeadFromCall } from "../bump-lead-from-call";
import { getSql, normalizePhone } from "../db";
import { runCursorForwardAfterPersist } from "./cursor-forward-db";
import type { ParsedEndOfCallReport } from "./parse";

export type PersistEndOfCallResult = {
  callId: string;
  inserted: boolean;
  cursorForwardStatus: string;
  leadUpserted: boolean;
};

function toIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function emptyLegacyText(value: string | null | undefined): string {
  return value ?? "";
}

export async function insertWebhookEvent(
  vapiCallId: string | null,
  messageType: string,
  dedupeKey: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DREWS_CLONE_DATABASE_URL is not configured");
  }

  const rows = await sql`
    INSERT INTO drews_clone_webhook_events (
      vapi_call_id,
      message_type,
      dedupe_key,
      payload
    ) VALUES (
      ${vapiCallId},
      ${messageType},
      ${dedupeKey},
      ${JSON.stringify(payload)}::jsonb
    )
    ON CONFLICT (dedupe_key) DO NOTHING
    RETURNING id
  `;

  return rows.length > 0;
}

export async function persistEndOfCallReport(
  parsed: ParsedEndOfCallReport,
  options?: { skipCursorForward?: boolean }
): Promise<PersistEndOfCallResult> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DREWS_CLONE_DATABASE_URL is not configured");
  }

  const storedPhone = parsed.phone ? normalizePhone(parsed.phone) : null;
  const sf = parsed.structuredFields;
  const disposition = parsed.booked ? "booked" : "needs_you";
  const structuredJson = parsed.structuredOutputRaw
    ? JSON.stringify(parsed.structuredOutputRaw)
    : null;
  const eventJson = JSON.stringify(parsed.rawEnvelope);
  const rawJson = JSON.stringify(parsed.rawEnvelope);

  const existing = await sql`
    SELECT call_id
    FROM drews_clone_calls
    WHERE call_id = ${parsed.callId}
    LIMIT 1
  `;
  const inserted = existing.length === 0;

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
      booking_start,
      booking_end,
      calendar_link,
      raw_json,
      disposition,
      organization,
      caller_type,
      reason,
      call_message,
      urgency,
      callback_requested,
      requested_next_step,
      calendar_event_created,
      calendar_event_time,
      structured_output_json,
      vapi_event_json,
      received_at,
      updated_at,
      cursor_forward_status,
      cursor_forward_attempts,
      created_at
    ) VALUES (
      ${parsed.callId},
      ${parsed.assistantId},
      ${storedPhone},
      ${emptyLegacyText(parsed.callerName)},
      ${emptyLegacyText(parsed.callerEmail)},
      ${toIso(parsed.startedAt)}::timestamptz,
      ${toIso(parsed.endedAt)}::timestamptz,
      ${parsed.durationSeconds},
      ${emptyLegacyText(parsed.endedReason)},
      ${emptyLegacyText(parsed.summary)},
      ${emptyLegacyText(parsed.transcript)},
      ${emptyLegacyText(parsed.recordingUrl)},
      ${parsed.booked},
      ${toIso(parsed.bookingStart)}::timestamptz,
      ${toIso(parsed.bookingEnd)}::timestamptz,
      ${emptyLegacyText(parsed.calendarLink)},
      ${rawJson}::jsonb,
      ${disposition},
      ${sf.organization},
      ${sf.callerType},
      ${sf.reason},
      ${sf.message},
      ${sf.urgency},
      ${sf.callbackRequested},
      ${sf.requestedNextStep},
      ${sf.calendarEventCreated},
      ${toIso(sf.calendarEventTime)}::timestamptz,
      ${structuredJson}::jsonb,
      ${eventJson}::jsonb,
      NOW(),
      NOW(),
      'pending',
      0,
      NOW()
    )
    ON CONFLICT (call_id) DO UPDATE SET
      assistant_id = EXCLUDED.assistant_id,
      phone = EXCLUDED.phone,
      caller_name = COALESCE(NULLIF(EXCLUDED.caller_name, ''), drews_clone_calls.caller_name),
      caller_email = COALESCE(NULLIF(EXCLUDED.caller_email, ''), drews_clone_calls.caller_email),
      started_at = EXCLUDED.started_at,
      ended_at = EXCLUDED.ended_at,
      duration_seconds = EXCLUDED.duration_seconds,
      ended_reason = EXCLUDED.ended_reason,
      summary = COALESCE(NULLIF(EXCLUDED.summary, ''), drews_clone_calls.summary),
      transcript = COALESCE(NULLIF(EXCLUDED.transcript, ''), drews_clone_calls.transcript),
      recording_url = COALESCE(NULLIF(EXCLUDED.recording_url, ''), drews_clone_calls.recording_url),
      booked = EXCLUDED.booked OR drews_clone_calls.booked,
      booking_start = COALESCE(EXCLUDED.booking_start, drews_clone_calls.booking_start),
      organization = COALESCE(EXCLUDED.organization, drews_clone_calls.organization),
      caller_type = COALESCE(EXCLUDED.caller_type, drews_clone_calls.caller_type),
      reason = COALESCE(EXCLUDED.reason, drews_clone_calls.reason),
      call_message = COALESCE(EXCLUDED.call_message, drews_clone_calls.call_message),
      urgency = COALESCE(EXCLUDED.urgency, drews_clone_calls.urgency),
      callback_requested = COALESCE(EXCLUDED.callback_requested, drews_clone_calls.callback_requested),
      requested_next_step = COALESCE(EXCLUDED.requested_next_step, drews_clone_calls.requested_next_step),
      calendar_event_created = COALESCE(EXCLUDED.calendar_event_created, drews_clone_calls.calendar_event_created),
      calendar_event_time = COALESCE(EXCLUDED.calendar_event_time, drews_clone_calls.calendar_event_time),
      structured_output_json = COALESCE(EXCLUDED.structured_output_json, drews_clone_calls.structured_output_json),
      vapi_event_json = EXCLUDED.vapi_event_json,
      raw_json = EXCLUDED.raw_json,
      disposition = CASE
        WHEN EXCLUDED.booked THEN 'booked'
        ELSE drews_clone_calls.disposition
      END,
      updated_at = NOW()
  `;

  let leadUpserted = false;
  if (parsed.phone) {
    leadUpserted = await bumpLeadFromCall({
      phone: parsed.phone,
      callerName: parsed.callerName ?? undefined,
      callerEmail: parsed.callerEmail ?? undefined,
      summary: parsed.summary ?? undefined,
      lastCallAt: parsed.endedAt ?? parsed.startedAt,
    });
  }

  const forwardOutcome = await runCursorForwardAfterPersist(
    sql,
    parsed.callId,
    parsed.rawEnvelope,
    options
  );

  const statusRows = await sql`
    SELECT cursor_forward_status
    FROM drews_clone_calls
    WHERE call_id = ${parsed.callId}
    LIMIT 1
  `;
  const cursorForwardStatus =
    (statusRows[0] as { cursor_forward_status: string } | undefined)
      ?.cursor_forward_status ?? forwardOutcome;

  return {
    callId: parsed.callId,
    inserted,
    cursorForwardStatus,
    leadUpserted,
  };
}
