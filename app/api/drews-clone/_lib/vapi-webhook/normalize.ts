import { parseTimestamp, strField } from "../db";

/** Treat JSON null, undefined, empty string, and literal "null" as absent. */
export function normalizeOptionalString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "" || trimmed.toLowerCase() === "null") {
      return null;
    }
    return trimmed;
  }
  return null;
}

export function normalizeOptionalBoolean(value: unknown): boolean | null {
  if (value === true || value === "true" || value === 1 || value === "1") {
    return true;
  }
  if (value === false || value === "false" || value === 0 || value === "0") {
    return false;
  }
  return null;
}

export function normalizeCalendarEventTime(value: unknown): Date | null {
  const asString = normalizeOptionalString(value);
  if (!asString) {
    return null;
  }
  return parseTimestamp(asString);
}

export type StructuredCallFields = {
  callerName: string | null;
  organization: string | null;
  callerType: string | null;
  reason: string | null;
  message: string | null;
  urgency: string | null;
  callbackRequested: boolean | null;
  requestedNextStep: string | null;
  calendarEventCreated: boolean | null;
  calendarEventTime: Date | null;
};

export function extractStructuredFields(
  structuredOutput: Record<string, unknown> | null
): StructuredCallFields {
  if (!structuredOutput) {
    return {
      callerName: null,
      organization: null,
      callerType: null,
      reason: null,
      message: null,
      urgency: null,
      callbackRequested: null,
      requestedNextStep: null,
      calendarEventCreated: null,
      calendarEventTime: null,
    };
  }

  return {
    callerName: normalizeOptionalString(structuredOutput.callerName),
    organization: normalizeOptionalString(structuredOutput.organization),
    callerType: normalizeOptionalString(structuredOutput.callerType),
    reason: normalizeOptionalString(structuredOutput.reason),
    message: normalizeOptionalString(structuredOutput.message),
    urgency: normalizeOptionalString(structuredOutput.urgency),
    callbackRequested: normalizeOptionalBoolean(structuredOutput.callbackRequested),
    requestedNextStep: normalizeOptionalString(structuredOutput.requestedNextStep),
    calendarEventCreated: normalizeOptionalBoolean(
      structuredOutput.calendarEventCreated
    ),
    calendarEventTime: normalizeCalendarEventTime(structuredOutput.calendarEventTime),
  };
}

export function pickSummary(
  ...values: unknown[]
): string | null {
  for (const value of values) {
    const s = strField(value);
    if (s) {
      return s;
    }
  }
  return null;
}
