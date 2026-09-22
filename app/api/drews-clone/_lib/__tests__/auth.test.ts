import { afterEach, describe, expect, test } from "@jest/globals";
import { NextRequest } from "next/server";
import {
  isDrewsCloneToolAuthorized,
  isVapiServerWebhookAuthorized,
} from "../auth";

describe("Vapi server webhook auth", () => {
  afterEach(() => {
    delete process.env.DREWS_CLONE_VAPI_WEBHOOK_SECRET;
    delete process.env.DREWS_CLONE_WEBHOOK_AUTH;
    delete process.env.DREWS_CLONE_LEADS_AUTH;
  });

  test("accepts DREWS_CLONE_VAPI_WEBHOOK_SECRET", () => {
    process.env.DREWS_CLONE_VAPI_WEBHOOK_SECRET = "vapi-secret";
    const req = new NextRequest("https://example.com/api/drews-clone/vapi/webhook", {
      method: "POST",
      headers: { Authorization: "Bearer vapi-secret" },
    });
    expect(isVapiServerWebhookAuthorized(req)).toBe(true);
  });

  test("accepts legacy DREWS_CLONE_WEBHOOK_AUTH", () => {
    process.env.DREWS_CLONE_WEBHOOK_AUTH = "legacy-webhook";
    const req = new NextRequest("https://example.com/api/drews-clone/vapi/webhook", {
      method: "POST",
      headers: { Authorization: "Bearer legacy-webhook" },
    });
    expect(isVapiServerWebhookAuthorized(req)).toBe(true);
  });

  test("rejects DREWS_CLONE_LEADS_AUTH for Vapi webhook", () => {
    process.env.DREWS_CLONE_LEADS_AUTH = "leads-only";
    process.env.DREWS_CLONE_VAPI_WEBHOOK_SECRET = "vapi-secret";
    const req = new NextRequest("https://example.com/api/drews-clone/vapi/webhook", {
      method: "POST",
      headers: { Authorization: "Bearer leads-only" },
    });
    expect(isVapiServerWebhookAuthorized(req)).toBe(false);
  });
});

describe("tool auth", () => {
  afterEach(() => {
    delete process.env.DREWS_CLONE_LEADS_AUTH;
    delete process.env.DREWS_CLONE_VAPI_WEBHOOK_SECRET;
  });

  test("leads auth does not accept vapi webhook secret alone", () => {
    process.env.DREWS_CLONE_VAPI_WEBHOOK_SECRET = "vapi-secret";
    const req = new NextRequest("https://example.com/api/drews-clone/leads", {
      method: "POST",
      headers: { Authorization: "Bearer vapi-secret" },
    });
    expect(isDrewsCloneToolAuthorized(req)).toBe(false);
  });

  test("accepts leads secret", () => {
    process.env.DREWS_CLONE_LEADS_AUTH = "leads-secret";
    const req = new NextRequest("https://example.com/api/drews-clone/leads", {
      method: "POST",
      headers: { Authorization: "Bearer leads-secret" },
    });
    expect(isDrewsCloneToolAuthorized(req)).toBe(true);
  });
});
