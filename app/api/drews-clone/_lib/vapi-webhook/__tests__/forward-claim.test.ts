import { describe, expect, test } from "@jest/globals";
import {
  CURSOR_FORWARD_STALE_MS,
  createForwardClaimSimulator,
  evaluateForwardClaim,
} from "../forward-claim";

describe("evaluateForwardClaim", () => {
  test("pending and failed are claimable", () => {
    expect(evaluateForwardClaim({ status: "pending", updatedAtMs: 0 }, 1000).action).toBe(
      "claim"
    );
    expect(evaluateForwardClaim({ status: "failed", updatedAtMs: 0 }, 1000).action).toBe(
      "claim"
    );
  });

  test("sent never claims", () => {
    const result = evaluateForwardClaim({ status: "sent", updatedAtMs: 0 }, 1000);
    expect(result).toEqual({ action: "skip", reason: "sent" });
  });

  test("processing is busy until stale", () => {
    const now = 10_000;
    const busy = evaluateForwardClaim(
      { status: "processing", updatedAtMs: now - 1000 },
      now,
      CURSOR_FORWARD_STALE_MS
    );
    expect(busy).toEqual({ action: "skip", reason: "busy" });

    const stale = evaluateForwardClaim(
      { status: "processing", updatedAtMs: now - CURSOR_FORWARD_STALE_MS },
      now,
      CURSOR_FORWARD_STALE_MS
    );
    expect(stale.action).toBe("claim");
  });
});

describe("createForwardClaimSimulator concurrency", () => {
  test("only one concurrent claim succeeds", async () => {
    const sim = createForwardClaimSimulator({ status: "pending", updatedAtMs: 0 });
    const now = Date.now();
    const results = await Promise.all(
      Array.from({ length: 10 }, async () => sim.tryClaim(now))
    );
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(sim.getState().status).toBe("processing");
  });

  test("failed can be reclaimed for retry", () => {
    const sim = createForwardClaimSimulator({ status: "failed", updatedAtMs: 0 });
    const now = Date.now();
    expect(sim.tryClaim(now)).toBe(true);
    sim.markFailed(now + 1);
    expect(sim.tryClaim(now + 2)).toBe(true);
  });

  test("sent never claims again", () => {
    const sim = createForwardClaimSimulator({ status: "sent", updatedAtMs: 0 });
    expect(sim.tryClaim(Date.now())).toBe(false);
  });
});
