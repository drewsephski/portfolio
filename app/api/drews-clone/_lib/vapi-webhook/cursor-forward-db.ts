import { getSql } from "../db";
import {
  type CursorForwardConfig,
  forwardToCursorWebhook,
  resolveCursorForwardConfig,
} from "./cursor-forward";

type Sql = NonNullable<ReturnType<typeof getSql>>;

export type CursorForwardOutcome =
  | "sent"
  | "failed"
  | "skipped"
  | "not_claimed";

export async function claimCursorForward(sql: Sql, callId: string): Promise<boolean> {
  const rows = await sql`
    UPDATE drews_clone_calls
    SET
      cursor_forward_status = 'processing',
      cursor_forward_attempts = cursor_forward_attempts + 1,
      updated_at = NOW()
    WHERE call_id = ${callId}
    AND (
      cursor_forward_status IN ('pending', 'failed')
      OR (
        cursor_forward_status = 'processing'
        AND updated_at < NOW() - INTERVAL '5 minutes'
      )
    )
    RETURNING call_id
  `;
  return rows.length > 0;
}

export async function markCursorForwardSent(
  sql: Sql,
  callId: string
): Promise<void> {
  await sql`
    UPDATE drews_clone_calls
    SET
      cursor_forward_status = 'sent',
      cursor_forward_sent_at = NOW(),
      cursor_forward_last_error = NULL,
      updated_at = NOW()
    WHERE call_id = ${callId}
      AND cursor_forward_status = 'processing'
  `;
}

export async function markCursorForwardFailed(
  sql: Sql,
  callId: string,
  error: string
): Promise<void> {
  await sql`
    UPDATE drews_clone_calls
    SET
      cursor_forward_status = 'failed',
      cursor_forward_last_error = ${error},
      updated_at = NOW()
    WHERE call_id = ${callId}
      AND cursor_forward_status = 'processing'
  `;
}

export async function markCursorForwardSkipped(
  sql: Sql,
  callId: string,
  reason: string
): Promise<void> {
  await sql`
    UPDATE drews_clone_calls
    SET
      cursor_forward_status = 'skipped',
      cursor_forward_last_error = ${reason},
      updated_at = NOW()
    WHERE call_id = ${callId}
  `;
}

export async function runCursorForwardAfterPersist(
  sql: Sql,
  callId: string,
  rawEnvelope: Record<string, unknown>,
  options?: { skipCursorForward?: boolean }
): Promise<CursorForwardOutcome> {
  if (options?.skipCursorForward) {
    await markCursorForwardSkipped(sql, callId, "forward_disabled");
    return "skipped";
  }

  const statusRows = await sql`
    SELECT cursor_forward_status
    FROM drews_clone_calls
    WHERE call_id = ${callId}
    LIMIT 1
  `;
  const status = (statusRows[0] as { cursor_forward_status: string } | undefined)
    ?.cursor_forward_status;

  if (status === "sent" || status === "skipped") {
    return "not_claimed";
  }

  const config = resolveCursorForwardConfig();
  if (!config) {
    await markCursorForwardSkipped(sql, callId, "cursor_forward_not_configured");
    return "skipped";
  }

  const claimed = await claimCursorForward(sql, callId);
  if (!claimed) {
    return "not_claimed";
  }

  const forwardResult = await forwardToCursorWebhook(rawEnvelope, config);
  if (forwardResult.ok) {
    await markCursorForwardSent(sql, callId);
    return "sent";
  }

  await markCursorForwardFailed(sql, callId, forwardResult.error);
  return "failed";
}

export type { CursorForwardConfig };
