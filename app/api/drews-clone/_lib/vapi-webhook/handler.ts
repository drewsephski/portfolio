import {
  DREWS_CLONE_ASSISTANT_ID,
  VAPI_MESSAGE_END_OF_CALL_REPORT,
  VAPI_MESSAGE_HANG,
  VAPI_MESSAGE_STATUS_UPDATE,
} from "./constants";
import {
  buildEventDedupeKey,
  parseEndOfCallReport,
  parseWebhookEnvelope,
} from "./parse";
import { insertWebhookEvent, persistEndOfCallReport } from "./persist";

export type WebhookHandlerResult =
  | { status: number; body: Record<string, unknown> };

function shouldSkipAssistant(assistantId: string | null): boolean {
  if (!assistantId) {
    return false;
  }
  return assistantId !== DREWS_CLONE_ASSISTANT_ID;
}

export async function handleVapiWebhookBody(
  body: Record<string, unknown>,
  options?: { skipCursorForward?: boolean }
): Promise<WebhookHandlerResult> {
  const envelope = parseWebhookEnvelope(body);
  const dedupeKey = buildEventDedupeKey(
    envelope.messageType,
    envelope.callId,
    body
  );

  await insertWebhookEvent(
    envelope.callId,
    envelope.messageType,
    dedupeKey,
    body
  );

  if (envelope.messageType === VAPI_MESSAGE_STATUS_UPDATE) {
    return {
      status: 200,
      body: { ok: true, messageType: envelope.messageType, logged: true },
    };
  }

  if (envelope.messageType === VAPI_MESSAGE_HANG) {
    return {
      status: 200,
      body: { ok: true, messageType: envelope.messageType, logged: true },
    };
  }

  if (envelope.messageType !== VAPI_MESSAGE_END_OF_CALL_REPORT) {
    return {
      status: 200,
      body: { ok: true, skipped: true, messageType: envelope.messageType },
    };
  }

  const parsed = parseEndOfCallReport(body);
  if (!parsed) {
    return {
      status: 400,
      body: { error: "Missing call in end-of-call-report" },
    };
  }

  if (shouldSkipAssistant(parsed.assistantId)) {
    return {
      status: 200,
      body: {
        ok: true,
        skipped: true,
        reason: "assistant not allowed",
        callId: parsed.callId,
      },
    };
  }

  const result = await persistEndOfCallReport(parsed, {
    skipCursorForward: options?.skipCursorForward,
  });

  return {
    status: 200,
    body: {
      ok: true,
      messageType: envelope.messageType,
      callId: result.callId,
      inserted: result.inserted,
      cursorForwardStatus: result.cursorForwardStatus,
      ...(result.leadUpserted ? { leadUpserted: true } : {}),
    },
  };
}
