import { afterEach, describe, expect, test } from "@jest/globals";
import { NextRequest } from "next/server";
import { isDrewsCloneAuthorized } from "../auth";

describe("isDrewsCloneAuthorized", () => {
  afterEach(() => {
    delete process.env.DREWS_CLONE_WEBHOOK_AUTH;
  });

  test("rejects missing authorization", () => {
    process.env.DREWS_CLONE_WEBHOOK_AUTH = "test-secret";
    const req = new NextRequest("https://example.com/api/drews-clone/vapi/webhook", {
      method: "POST",
    });
    expect(isDrewsCloneAuthorized(req, { includeWebhookAuth: true })).toBe(false);
  });

  test("accepts bearer token", () => {
    process.env.DREWS_CLONE_WEBHOOK_AUTH = "test-secret";
    const req = new NextRequest("https://example.com/api/drews-clone/vapi/webhook", {
      method: "POST",
      headers: { Authorization: "Bearer test-secret" },
    });
    expect(isDrewsCloneAuthorized(req, { includeWebhookAuth: true })).toBe(true);
  });
});
