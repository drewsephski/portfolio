import { asRecord, parseTimestamp, strField } from "../db";
import { DREWS_CLONE_STRUCTURED_OUTPUT_ID } from "./constants";
import { extractStructuredFields, pickSummary } from "./normalize";

export type VapiWebhookEnvelope = {
  messageType: string;
  callId: string | null;
  assistantId: string | null;
  raw: Record<string, unknown>;
};

export type ParsedEndOfCallReport = {
  callId: string;
  assistantId: string | null;
  phone: string | null;
  callerName: string | null;
  callerEmail: string | null;
  startedAt: Date | null;
  endedAt: Date | null;
  durationSeconds: number | null;
  endedReason: string | null;
  summary: string | null;
  transcript: string | null;
  recordingUrl: string | null;
  structuredOutputRaw: Record<string, unknown> | null;
  structuredFields: ReturnType<typeof extractStructuredFields>;
  booked: boolean;
  bookingStart: Date | null;
  bookingEnd: Date | null;
  calendarLink: string | null;
  rawEnvelope: Record<string, unknown>;
};

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    const s = strField(value);
    if (s) {
      return s;
    }
  }
  return null;
}

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

function extractPhone(customer: Record<string, unknown> | undefined): string | null {
  if (!customer) {
    return null;
  }
  return firstString(customer.number, customer.phoneNumber, customer.phone);
}

export function parseWebhookEnvelope(body: Record<string, unknown>): VapiWebhookEnvelope {
  const message = asRecord(body.message);
  const messageType =
    firstString(message?.type, body.type, message?.messageType) ?? "unknown";

  const call = asRecord(message?.call) ?? asRecord(body.call);

  const callId = firstString(call?.id, call?.callId, body.callId);
  const assistantId = firstString(
    call?.assistantId,
    call?.assistant_id,
    body.assistantId
  );

  return {
    messageType,
    callId,
    assistantId,
    raw: body,
  };
}

function extractStructuredOutputFromCall(
  call: Record<string, unknown>,
  envelope: Record<string, unknown>,
  message: Record<string, unknown> | undefined
): Record<string, unknown> | null {
  const artifact =
    asRecord(call.artifact) ??
    asRecord(message?.artifact) ??
    asRecord(envelope.artifact);

  const structuredOutputs = asRecord(artifact?.structuredOutputs);
  if (structuredOutputs) {
    const entry = structuredOutputs[DREWS_CLONE_STRUCTURED_OUTPUT_ID];
    if (entry && typeof entry === "object" && entry !== null) {
      const result = asRecord((entry as Record<string, unknown>).result);
      if (result) {
        return result;
      }
    }
  }

  const analysis =
    asRecord(envelope.analysis) ??
    asRecord(message?.analysis) ??
    asRecord(call.analysis);
  const structuredData = asRecord(analysis?.structuredData);
  if (structuredData) {
    return structuredData;
  }

  return null;
}

export function parseEndOfCallReport(
  body: Record<string, unknown>
): ParsedEndOfCallReport | null {
  const message = asRecord(body.message);
  const call =
    asRecord(message?.call) ??
    asRecord(body.call);

  if (!call) {
    return null;
  }

  const callId = firstString(call.id, call.callId);
  if (!callId) {
    return null;
  }

  const customer = asRecord(call.customer);
  const artifact = asRecord(call.artifact) ?? asRecord(message?.artifact);
  const analysis = asRecord(message?.analysis) ?? asRecord(body.analysis);
  const recording = asRecord(artifact?.recording);

  const structuredOutputRaw = extractStructuredOutputFromCall(call, body, message);
  const structuredFields = extractStructuredFields(structuredOutputRaw);

  const startedAt =
    parseTimestamp(call.startedAt ?? call.startTime ?? message?.startedAt) ?? null;
  const endedAt =
    parseTimestamp(call.endedAt ?? call.endTime ?? message?.endedAt) ?? null;

  let durationSeconds = intField(
    call.durationSeconds ?? call.duration ?? message?.durationSeconds
  );
  if (durationSeconds == null && startedAt && endedAt) {
    durationSeconds = Math.max(
      0,
      Math.round((endedAt.getTime() - startedAt.getTime()) / 1000)
    );
  }

  const calendarCreated = structuredFields.calendarEventCreated === true;
  const bookingStart = structuredFields.calendarEventTime;

  return {
    callId,
    assistantId: firstString(call.assistantId, call.assistant_id),
    phone: extractPhone(customer),
    callerName:
      structuredFields.callerName ??
      firstString(customer?.name, call.callerName),
    callerEmail: firstString(customer?.email, call.callerEmail),
    startedAt,
    endedAt,
    durationSeconds,
    endedReason: firstString(call.endedReason, message?.endedReason),
    summary: pickSummary(
      call.summary,
      message?.summary,
      analysis?.summary,
      artifact?.summary
    ),
    transcript: pickSummary(call.transcript, message?.transcript, artifact?.transcript),
    recordingUrl: firstString(
      call.recordingUrl,
      artifact?.recordingUrl,
      recording?.url
    ),
    structuredOutputRaw,
    structuredFields,
    booked: calendarCreated,
    bookingStart,
    bookingEnd: null,
    calendarLink: null,
    rawEnvelope: body,
  };
}

export function buildEventDedupeKey(
  messageType: string,
  callId: string | null,
  body: Record<string, unknown>
): string {
  if (messageType === "end-of-call-report" && callId) {
    return `eocr:${callId}`;
  }
  const message = asRecord(body.message);
  const status = firstString(message?.status, body.status) ?? "unknown";
  const at = firstString(message?.timestamp, body.timestamp) ?? "";
  if (callId) {
    return `${messageType}:${callId}:${status}:${at}`;
  }
  return `${messageType}:${JSON.stringify(body).length}:${at}`;
}
