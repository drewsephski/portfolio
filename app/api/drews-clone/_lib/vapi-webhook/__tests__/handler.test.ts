import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  VAPI_MESSAGE_END_OF_CALL_REPORT,
  VAPI_MESSAGE_HANG,
  VAPI_MESSAGE_STATUS_UPDATE,
} from "../constants";
import { handleVapiWebhookBody } from "../handler";

jest.mock("../persist", () => ({
  insertWebhookEvent: jest.fn(async () => true),
  persistEndOfCallReport: jest.fn(async () => ({
    callId: "01a0c60c-2c58-7ff7-8474-9e2c88bec934",
    inserted: true,
    cursorForwardStatus: "sent",
    leadUpserted: false,
  })),
}));

const persistModule = jest.requireMock("../persist") as {
  insertWebhookEvent: jest.Mock;
  persistEndOfCallReport: jest.Mock;
};

const fixturesDir = join(
  process.cwd(),
  "app/api/drews-clone/vapi/webhook/__fixtures__"
);

function loadFixture(name: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(fixturesDir, name), "utf8")
  ) as Record<string, unknown>;
}

describe("handleVapiWebhookBody", () => {
  beforeEach(() => {
    persistModule.insertWebhookEvent.mockClear();
    persistModule.persistEndOfCallReport.mockClear();
  });

  test("processes valid end-of-call-report", async () => {
    const result = await handleVapiWebhookBody(
      loadFixture("end-of-call-report.json"),
      { skipCursorForward: true }
    );
    expect(result.status).toBe(200);
    expect(result.body.callId).toBe("01a0c60c-2c58-7ff7-8474-9e2c88bec934");
    expect(persistModule.persistEndOfCallReport).toHaveBeenCalledTimes(1);
  });

  test("duplicate delivery still calls persist (idempotent upsert)", async () => {
    persistModule.persistEndOfCallReport.mockResolvedValueOnce({
      callId: "01a0c60c-2c58-7ff7-8474-9e2c88bec934",
      inserted: false,
      cursorForwardStatus: "sent" as const,
      leadUpserted: false,
    });
    const body = loadFixture("end-of-call-report.json");
    await handleVapiWebhookBody(body, { skipCursorForward: true });
    await handleVapiWebhookBody(body, { skipCursorForward: true });
    expect(persistModule.persistEndOfCallReport).toHaveBeenCalledTimes(2);
  });

  test("missing structured output on short call still persists", async () => {
    const result = await handleVapiWebhookBody(
      loadFixture("end-of-call-report-short.json"),
      { skipCursorForward: true }
    );
    expect(result.status).toBe(200);
    expect(persistModule.persistEndOfCallReport).toHaveBeenCalled();
  });

  test("status-update does not persist end-of-call", async () => {
    const result = await handleVapiWebhookBody({
      message: { type: VAPI_MESSAGE_STATUS_UPDATE, status: "ended" },
    });
    expect(result.body.logged).toBe(true);
    expect(persistModule.persistEndOfCallReport).not.toHaveBeenCalled();
  });

  test("hang does not persist end-of-call", async () => {
    const result = await handleVapiWebhookBody({
      message: { type: VAPI_MESSAGE_HANG },
    });
    expect(result.body.logged).toBe(true);
    expect(persistModule.persistEndOfCallReport).not.toHaveBeenCalled();
  });

  test("malformed end-of-call-report returns 400", async () => {
    const result = await handleVapiWebhookBody({
      message: { type: VAPI_MESSAGE_END_OF_CALL_REPORT },
    });
    expect(result.status).toBe(400);
  });
});
