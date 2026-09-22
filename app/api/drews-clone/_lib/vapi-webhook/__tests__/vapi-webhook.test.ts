import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  VAPI_MESSAGE_END_OF_CALL_REPORT,
  VAPI_MESSAGE_HANG,
  VAPI_MESSAGE_STATUS_UPDATE,
} from "../constants";
import {
  extractStructuredFields,
  normalizeOptionalBoolean,
  normalizeOptionalString,
} from "../normalize";
import {
  buildEventDedupeKey,
  parseEndOfCallReport,
  parseWebhookEnvelope,
} from "../parse";
import {
  forwardToCursorWebhook,
  resolveCursorForwardConfig,
} from "../cursor-forward";

const fixturesDir = join(
  process.cwd(),
  "app/api/drews-clone/vapi/webhook/__fixtures__"
);

function loadFixture(name: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(fixturesDir, name), "utf8")
  ) as Record<string, unknown>;
}

describe("normalizeOptionalString", () => {
  test("treats literal null string as absent", () => {
    expect(normalizeOptionalString("null")).toBeNull();
    expect(normalizeOptionalString("  NULL ")).toBeNull();
  });

  test("keeps real strings", () => {
    expect(normalizeOptionalString("Drew")).toBe("Drew");
  });
});

describe("parseEndOfCallReport", () => {
  test("parses valid end-of-call-report fixture", () => {
    const body = loadFixture("end-of-call-report.json");
    const parsed = parseEndOfCallReport(body);
    expect(parsed).not.toBeNull();
    expect(parsed?.callId).toBe("01a0c60c-2c58-7ff7-8474-9e2c88bec934");
    expect(parsed?.structuredFields.reason).toBeTruthy();
    expect(parsed?.callerName).toBeNull();
  });

  test("parses short call without structured output", () => {
    const body = loadFixture("end-of-call-report-short.json");
    const parsed = parseEndOfCallReport(body);
    expect(parsed?.callId).toBe("01a0c460-eb32-7000-8e70-438694198706");
    expect(parsed?.structuredOutputRaw).toBeNull();
    expect(parsed?.summary).toBeNull();
  });

  test("normalizes JSON null and string null structured fields", () => {
    const body = loadFixture("end-of-call-report-null-literals.json");
    const parsed = parseEndOfCallReport(body);
    expect(parsed?.structuredFields.callerName).toBeNull();
    expect(parsed?.structuredFields.organization).toBeNull();
    expect(parsed?.structuredFields.message).toBeNull();
    expect(parsed?.structuredFields.requestedNextStep).toBeNull();
    expect(parsed?.structuredFields.calendarEventTime).toBeNull();
  });
});

describe("parseWebhookEnvelope", () => {
  test("detects message types", () => {
    expect(
      parseWebhookEnvelope({
        message: { type: VAPI_MESSAGE_STATUS_UPDATE },
      }).messageType
    ).toBe(VAPI_MESSAGE_STATUS_UPDATE);
    expect(
      parseWebhookEnvelope({ message: { type: VAPI_MESSAGE_HANG } }).messageType
    ).toBe(VAPI_MESSAGE_HANG);
  });
});

describe("buildEventDedupeKey", () => {
  test("end-of-call-report dedupes by call id", () => {
    const key = buildEventDedupeKey(
      VAPI_MESSAGE_END_OF_CALL_REPORT,
      "abc",
      {}
    );
    expect(key).toBe("eocr:abc");
  });
});

describe("extractStructuredFields", () => {
  test("handles actual JSON null", () => {
    const fields = extractStructuredFields({
      callerName: null,
      callbackRequested: false,
    });
    expect(fields.callerName).toBeNull();
    expect(fields.callbackRequested).toBe(false);
  });
});

describe("cursor forward", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.DREWS_CLONE_CURSOR_WEBHOOK_URL;
    delete process.env.DREWS_CLONE_CURSOR_WEBHOOK_AUTH;
  });

  test("resolveCursorForwardConfig reads env", () => {
    process.env.DREWS_CLONE_CURSOR_WEBHOOK_URL = "https://example.com/hook";
    process.env.DREWS_CLONE_CURSOR_WEBHOOK_AUTH = "secret-token";
    const config = resolveCursorForwardConfig();
    expect(config?.url).toBe("https://example.com/hook");
    expect(config?.authorization).toBe("Bearer secret-token");
    expect(config?.automationKey).toBe("secret-token");
  });

  test("forwardToCursorWebhook success", async () => {
    global.fetch = jest.fn(async () => new Response(null, { status: 200 })) as typeof fetch;

    const result = await forwardToCursorWebhook(
      { message: { type: "end-of-call-report" } },
      {
        url: "https://example.com/hook",
        authorization: "Bearer x",
        automationKey: "x",
      }
    );
    expect(result.ok).toBe(true);
  });

  test("forwardToCursorWebhook timeout", async () => {
    global.fetch = jest.fn(async () => {
      const err = new Error("The operation was aborted");
      err.name = "TimeoutError";
      throw err;
    }) as typeof fetch;

    const result = await forwardToCursorWebhook(
      {},
      {
        url: "https://example.com/hook",
        authorization: "Bearer x",
        automationKey: "x",
      }
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("cursor_forward_timeout");
    }
  });

  test("forwardToCursorWebhook failure", async () => {
    global.fetch = jest.fn(
      async () => new Response(null, { status: 500 })
    ) as typeof fetch;

    const result = await forwardToCursorWebhook(
      {},
      {
        url: "https://example.com/hook",
        authorization: "Bearer x",
        automationKey: "x",
      }
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("cursor_http_500");
    }
  });
});

describe("normalizeOptionalBoolean", () => {
  test("parses booleans", () => {
    expect(normalizeOptionalBoolean(true)).toBe(true);
    expect(normalizeOptionalBoolean("false")).toBe(false);
    expect(normalizeOptionalBoolean("maybe")).toBeNull();
  });
});
