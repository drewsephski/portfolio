import { describe, expect, test } from "@jest/globals";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("drews_clone_vapi_webhook migration", () => {
  const sql = readFileSync(
    join(process.cwd(), "sql/migrations/20260922_drews_clone_vapi_webhook.sql"),
    "utf8"
  );

  test("historical rows backfill to skipped when vapi_event_json is null", () => {
    expect(sql).toContain("cursor_forward_status = 'skipped'");
    expect(sql).toContain("WHERE vapi_event_json IS NULL");
  });

  test("new rows default to pending", () => {
    expect(sql).toContain("ALTER COLUMN cursor_forward_status SET DEFAULT 'pending'");
  });

  test("includes processing status", () => {
    expect(sql).toContain("'processing'");
  });

  test("replaces the status check without a dollar-quoted block", () => {
    expect(sql).toContain(
      "DROP CONSTRAINT IF EXISTS drews_clone_calls_cursor_forward_status_check"
    );
    expect(sql).not.toContain("DO $$");
    expect(sql).toContain("'skipped'");
  });
});
