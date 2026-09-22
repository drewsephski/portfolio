export const CURSOR_FORWARD_STALE_MS = 5 * 60 * 1000;

export type CursorForwardStatus =
  | "pending"
  | "processing"
  | "sent"
  | "failed"
  | "skipped";

export type ForwardClaimResult =
  | { action: "claim" }
  | { action: "skip"; reason: "sent" | "skipped" | "busy" };

export type ForwardRowState = {
  status: CursorForwardStatus;
  updatedAtMs: number;
};

/** Mirrors SQL claim eligibility for unit tests and documentation. */
export function evaluateForwardClaim(
  row: ForwardRowState,
  nowMs: number,
  staleMs: number = CURSOR_FORWARD_STALE_MS
): ForwardClaimResult {
  if (row.status === "sent" || row.status === "skipped") {
    return { action: "skip", reason: row.status === "sent" ? "sent" : "skipped" };
  }

  if (row.status === "pending" || row.status === "failed") {
    return { action: "claim" };
  }

  if (row.status === "processing") {
    const ageMs = nowMs - row.updatedAtMs;
    if (ageMs >= staleMs) {
      return { action: "claim" };
    }
    return { action: "skip", reason: "busy" };
  }

  return { action: "skip", reason: "busy" };
}

/**
 * In-memory claim simulator for concurrency tests (single-process mutex).
 */
export function createForwardClaimSimulator(initial: ForwardRowState) {
  let state = { ...initial };

  return {
    getState: () => ({ ...state }),
    tryClaim(nowMs: number, staleMs: number = CURSOR_FORWARD_STALE_MS): boolean {
      const decision = evaluateForwardClaim(state, nowMs, staleMs);
      if (decision.action !== "claim") {
        return false;
      }
      state = {
        status: "processing",
        updatedAtMs: nowMs,
      };
      return true;
    },
    markSent(nowMs: number) {
      state = { status: "sent", updatedAtMs: nowMs };
    },
    markFailed(nowMs: number) {
      state = { status: "failed", updatedAtMs: nowMs };
    },
  };
}
