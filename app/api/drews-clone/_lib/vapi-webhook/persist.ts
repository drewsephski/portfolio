import { bumpLeadFromCall } from "../bump-lead-from-call";
import { getSql, normalizePhone } from "../db";
import type { ParsedEndOfCallReport } from "./parse";
import {
  forwardToCursorWebhook,
  resolveCursorForwardConfig,
} from "./cursor-forward";

export type PersistEndOfCallResult = {
  callId: string;
  inserted: boolean;
  cursorForwardStatus: "sent" | "failed" | "skipped" | "pending";
  leadUpserted: boolean;
};

function toIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
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
    SELECT call_id, cursor_forward_status
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
      ${parsed.callerName ?? ""},
      ${parsed.callerEmail ?? ""},
      ${toIso(parsed.startedAt)}::timestamptz,
      ${toIso(parsed.endedAt)}::timestamptz,
      ${parsed.durationSeconds},
      ${parsed.endedReason ?? ""},
      ${parsed.summary ?? ""},
      ${parsed.transcript ?? ""},
      ${parsed.recordingUrl ?? ""},
      ${parsed.booked},
      ${toIso(parsed.bookingStart)}::timestamptz,
      ${toIso(parsed.bookingEnd)}::timestamptz,
      ${parsed.calendarLink ?? ""},
      ${rawJson}::jsonb,
      ${disposition},
      ${sf.organization ?? ""},
      ${sf.callerType ?? ""},
      ${sf.reason ?? ""},
      ${sf.message ?? ""},
      ${sf.urgency ?? ""},
      ${sf.callbackRequested},
      ${sf.requestedNextStep ?? ""},
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
      organization = COALESCE(NULLIF(EXCLUDED.organization, ''), drews_clone_calls.organization),
      caller_type = COALESCE(NULLIF(EXCLUDED.caller_type, ''), drews_clone_calls.caller_type),
      reason = COALESCE(NULLIF(EXCLUDED.reason, ''), drews_clone_calls.reason),
      call_message = COALESCE(NULLIF(EXCLUDED.call_message, ''), drews_clone_calls.call_message),
      urgency = COALESCE(NULLIF(EXCLUDED.urgency, ''), drews_clone_calls.urgency),
      callback_requested = COALESCE(EXCLUDED.callback_requested, drews_clone_calls.callback_requested),
      requested_next_step = COALESCE(NULLIF(EXCLUDED.requested_next_step, ''), drews_clone_calls.requested_next_step),
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

  let cursorForwardStatus: PersistEndOfCallResult["cursorForwardStatus"] = "skipped";

  const statusRows = await sql`
    SELECT cursor_forward_status
    FROM drews_clone_calls
    WHERE call_id = ${parsed.callId}
    LIMIT 1
  `;
  const priorStatus = (statusRows[0] as { cursor_forward_status: string } | undefined)
    ?.cursor_forward_status;

  if (priorStatus === "sent") {
    cursorForwardStatus = "sent";
  } else if (options?.skipCursorForward) {
    cursorForwardStatus = "skipped";
  } else {
    const config = resolveCursorForwardConfig();
    if (!config) {
      await sql`
        UPDATE drews_clone_calls
        SET cursor_forward_status = 'skipped',
            cursor_forward_last_error = 'cursor_forward_not_configured',
            updated_at = NOW()
        WHERE call_id = ${parsed.callId}
      `;
      cursorForwardStatus = "skipped";
    } else {
      const forwardResult = await forwardToCursorWebhook(parsed.rawEnvelope, config);
      if (forwardResult.ok) {
        await sql`
          UPDATE drews_clone_calls
          SET cursor_forward_status = 'sent',
              cursor_forward_attempts = cursor_forward_attempts + 1,
              cursor_forward_sent_at = NOW(),
              cursor_forward_last_error = NULL,
              updated_at = NOW()
          WHERE call_id = ${parsed.callId}
        `;
        cursorForwardStatus = "sent";
      } else {
        await sql`
          UPDATE drews_clone_calls
          SET cursor_forward_status = 'failed',
              cursor_forward_attempts = cursor_forward_attempts + 1,
              cursor_forward_last_error = ${forwardResult.error},
              updated_at = NOW()
          WHERE call_id = ${parsed.callId}
        `;
        cursorForwardStatus = "failed";
      }
    }
  }

  return {
    callId: parsed.callId,
    inserted,
    cursorForwardStatus,
    leadUpserted,
  };
}
