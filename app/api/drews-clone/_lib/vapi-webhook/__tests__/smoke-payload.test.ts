import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "@jest/globals";

describe("drews clone vapi webhook smoke payload", () => {
  test("dry-run replaces the fixture call id and drops caller phones", () => {
    const fixture = JSON.parse(
      readFileSync(
        join(
          process.cwd(),
          "app/api/drews-clone/vapi/webhook/__fixtures__/end-of-call-report-short.json"
        ),
        "utf8"
      )
    ) as { message: { call: { id: string } } };
    const originalCallId = fixture.message.call.id;
    const env = { ...process.env };
    delete env.DREWS_CLONE_VAPI_WEBHOOK_SECRET;

    const stdout = execFileSync(
      process.execPath,
      ["scripts/smoke-drews-clone-vapi-webhook.mjs", "--dry-run"],
      { encoding: "utf8", cwd: process.cwd(), env }
    );
    const report = JSON.parse(stdout) as {
      dryRun: boolean;
      syntheticCallId: string;
      originalCallIdPresent: boolean;
      fixturePhonesRemaining: string[];
      callerName: string;
      summary: string;
      customerPhone: string | null;
      forwardedFrom: string | null;
      messageText: string;
    };

    expect(report.dryRun).toBe(true);
    expect(report.syntheticCallId).not.toBe(originalCallId);
    expect(report.originalCallIdPresent).toBe(false);
    expect(report.fixturePhonesRemaining).toEqual([]);
    expect(report.callerName).toBe("Webhook Smoke Test");
    expect(report.summary).toBe("Synthetic Drews Clone webhook smoke test");
    expect(report.customerPhone).toBeNull();
    expect(report.forwardedFrom).toBeNull();
    expect(report.messageText).toBe(
      "Synthetic Drews Clone webhook smoke test. No real caller."
    );
    expect(stdout).not.toContain(originalCallId);
    expect(stdout).not.toContain("+12244980322");
  });
});
