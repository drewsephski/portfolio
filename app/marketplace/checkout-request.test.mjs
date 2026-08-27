import assert from "node:assert/strict";
import test from "node:test";
import { createCheckoutRequestGuard } from "./checkout-request.mjs";

test("a checkout response cannot redirect after the dock moves to another product", () => {
  const guard = createCheckoutRequestGuard("agentlab");

  assert.equal(guard.canRedirect("/agentlab"), true);
  assert.equal(guard.canRedirect("/dreammotion"), false);

  guard.cancel();
  assert.equal(guard.canRedirect("/agentlab"), false);
  assert.equal(guard.signal.aborted, true);
});
