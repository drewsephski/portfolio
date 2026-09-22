/**
 * Synthetic smoke POST for the Drews Clone Vapi webhook.
 *
 * Reads the committed end-of-call fixture, then sends a deep clone with a
 * fresh call id. The original fixture call id is never posted.
 *
 * Cursor forwarding is not disabled from this script. The public webhook has
 * no caller-controlled skip flag. If production has DREWS_CLONE_CURSOR_WEBHOOK_*
 * configured, this synthetic call may be forwarded once. It is labeled as a
 * smoke test. To avoid forwarding, point SMOKE_WEBHOOK_URL at a preview
 * deployment that omits those Cursor webhook env vars.
 *
 *   DREWS_CLONE_VAPI_WEBHOOK_SECRET=... node scripts/smoke-drews-clone-vapi-webhook.mjs
 *   node scripts/smoke-drews-clone-vapi-webhook.mjs --dry-run
 *   node scripts/smoke-drews-clone-vapi-webhook.mjs --out-file /tmp/smoke.json
 *   node scripts/smoke-drews-clone-vapi-webhook.mjs --replay-file /tmp/smoke.json
 */

import { randomUUID } from "node:crypto";
import { chmodSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const FIXTURE_PATH = resolve(
  process.cwd(),
  "app/api/drews-clone/vapi/webhook/__fixtures__/end-of-call-report-short.json"
);
const DEFAULT_WEBHOOK_URL =
  "https://drewsepeczi.xyz/api/drews-clone/vapi/webhook";
const SMOKE_CALLER_NAME = "Webhook Smoke Test";
const SMOKE_SUMMARY = "Synthetic Drews Clone webhook smoke test";
const SMOKE_MESSAGE =
  "Synthetic Drews Clone webhook smoke test. No real caller.";

const PHONE_KEYS = new Set([
  "number",
  "phone",
  "phoneNumber",
  "forwardedFrom",
  "callerPhone",
]);

export function buildSmokePayload(fixture, syntheticCallId = randomUUID()) {
  const sourceCallId = readSourceCallId(fixture);
  const payload = replaceExactString(
    structuredClone(fixture),
    sourceCallId,
    syntheticCallId
  );
  markSmokeCall(payload);
  return {
    payload,
    sourceCallId,
    syntheticCallId,
  };
}

export function inspectSmokePayload(payload, sourceCallId, fixture) {
  const serialized = JSON.stringify(payload);
  const call = payload?.message?.call ?? payload?.call ?? {};
  const customer = call.customer ?? {};
  const fixturePhones = [
    ...new Set(JSON.stringify(fixture).match(/\+1\d{10}/g) ?? []),
  ];
  return {
    originalCallIdPresent: serialized.includes(sourceCallId),
    fixturePhonesRemaining: fixturePhones.filter((phone) =>
      serialized.includes(phone)
    ),
    callerName: customer.name ?? call.callerName ?? null,
    summary: call.summary ?? null,
    customerPhone: customer.number ?? customer.phone ?? customer.phoneNumber ?? null,
    forwardedFrom: call.transport?.forwardedFrom ?? null,
    messageText: call.messages?.[0]?.message ?? null,
  };
}

function readSourceCallId(fixture) {
  const call = fixture?.message?.call ?? fixture?.call;
  const callId = call?.id;
  if (typeof callId !== "string" || callId.trim() === "") {
    throw new Error("Fixture is missing message.call.id");
  }
  return callId;
}

function replaceExactString(value, from, to) {
  if (typeof value === "string") {
    return value.split(from).join(to);
  }
  if (Array.isArray(value)) {
    return value.map((entry) => replaceExactString(entry, from, to));
  }
  if (value && typeof value === "object") {
    const next = {};
    for (const [key, entry] of Object.entries(value)) {
      next[key] = replaceExactString(entry, from, to);
    }
    return next;
  }
  return value;
}

function markSmokeCall(payload) {
  const call = payload?.message?.call ?? payload?.call;
  if (!call || typeof call !== "object") {
    throw new Error("Fixture is missing a call object");
  }

  call.summary = SMOKE_SUMMARY;
  call.callerName = SMOKE_CALLER_NAME;
  call.transcript = SMOKE_SUMMARY;
  call.messages = [{ role: "system", message: SMOKE_MESSAGE }];

  if (payload.message && typeof payload.message === "object") {
    payload.message.summary = SMOKE_SUMMARY;
    payload.message.transcript = SMOKE_SUMMARY;
  }

  if (!call.customer || typeof call.customer !== "object") {
    call.customer = {};
  }
  call.customer.name = SMOKE_CALLER_NAME;
  call.customer.number = null;
  call.customer.phone = null;
  call.customer.phoneNumber = null;
  call.customer.email = null;

  if (call.transport && typeof call.transport === "object") {
    call.transport.forwardedFrom = null;
  }

  const structuredOutputs = call.artifact?.structuredOutputs;
  if (structuredOutputs && typeof structuredOutputs === "object") {
    for (const entry of Object.values(structuredOutputs)) {
      if (!entry || typeof entry !== "object" || !entry.result) {
        continue;
      }
      entry.result.callerName = SMOKE_CALLER_NAME;
      for (const key of PHONE_KEYS) {
        if (key in entry.result) {
          entry.result[key] = null;
        }
      }
    }
  }
}

function cleanupSql(callId) {
  return [
    "-- Review, then run manually if you want this smoke row removed.",
    "DELETE FROM drews_clone_webhook_events",
    `WHERE vapi_call_id = '${callId}';`,
    "DELETE FROM drews_clone_calls",
    `WHERE call_id = '${callId}';`,
  ].join("\n");
}

function readWebhookUrl() {
  const configured = process.env.SMOKE_WEBHOOK_URL?.trim();
  return configured || DEFAULT_WEBHOOK_URL;
}

function assertSafeUrl(url, secret) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("SMOKE_WEBHOOK_URL is not a valid URL");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("Webhook URL must use https");
  }
  if (secret && url.includes(secret)) {
    throw new Error("Webhook URL must not contain the webhook secret");
  }
  return parsed;
}

function safeReport(responseStatus, body, syntheticCallId) {
  const record = body && typeof body === "object" ? body : {};
  return {
    httpStatus: responseStatus,
    syntheticCallId,
    webhookOk: record.ok === true,
    webhookCallId: typeof record.callId === "string" ? record.callId : null,
    cursorForwardStatus:
      typeof record.cursorForwardStatus === "string"
        ? record.cursorForwardStatus
        : null,
    inserted: typeof record.inserted === "boolean" ? record.inserted : null,
    error: typeof record.error === "string" ? record.error : null,
  };
}

function normalizeAuthToken(raw) {
  let token = raw.trim();
  if (token.toLowerCase().startsWith("authorization:")) {
    token = token.split(":").slice(1).join(":").trim();
  }
  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }
  return token;
}

async function postSmoke(payload, syntheticCallId) {
  const secret = normalizeAuthToken(
    process.env.DREWS_CLONE_VAPI_WEBHOOK_SECRET ?? ""
  );
  if (!secret) {
    throw new Error("DREWS_CLONE_VAPI_WEBHOOK_SECRET is not set");
  }

  const url = readWebhookUrl();
  assertSafeUrl(url, secret);

  const response = await fetch(url, {
    method: "POST",
    redirect: "error",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
  });

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  return safeReport(response.status, body, syntheticCallId);
}

function readArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0) {
    return null;
  }
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a file path`);
  }
  return value;
}

function assertSmokePayload(payload, fixture) {
  const sourceCallId = readSourceCallId(fixture);
  const inspection = inspectSmokePayload(payload, sourceCallId, fixture);
  if (inspection.originalCallIdPresent) {
    throw new Error("Smoke payload still contains the fixture call id");
  }
  if (inspection.customerPhone !== null || inspection.forwardedFrom !== null) {
    throw new Error("Smoke payload still contains a caller phone");
  }
  if (inspection.fixturePhonesRemaining.length > 0) {
    throw new Error("Smoke payload still contains a fixture phone number");
  }
  const callId = payload?.message?.call?.id ?? payload?.call?.id;
  if (typeof callId !== "string" || callId.trim() === "") {
    throw new Error("Smoke payload is missing a call id");
  }
  return { inspection, callId };
}

function printReport(report, callId) {
  console.log(`httpStatus: ${report.httpStatus}`);
  console.log(`syntheticCallId: ${report.syntheticCallId}`);
  console.log(`webhookOk: ${report.webhookOk}`);
  if (report.webhookCallId) {
    console.log(`webhookCallId: ${report.webhookCallId}`);
  }
  if (report.cursorForwardStatus) {
    console.log(`cursorForwardStatus: ${report.cursorForwardStatus}`);
  }
  if (report.inserted !== null) {
    console.log(`inserted: ${report.inserted}`);
  }
  if (report.error) {
    console.log(`error: ${report.error}`);
  }
  console.log(
    "forwarding: not disabled. Production may forward this smoke call once if Cursor webhook env is set."
  );
  console.log("");
  console.log(cleanupSql(callId));
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const outFile = readArg("--out-file");
  const replayFile = readArg("--replay-file");
  if (replayFile && (dryRun || outFile)) {
    throw new Error("--replay-file cannot be combined with --dry-run or --out-file");
  }

  const fixture = JSON.parse(readFileSync(FIXTURE_PATH, "utf8"));
  let payload;
  let syntheticCallId;
  let inspection;

  if (replayFile) {
    payload = JSON.parse(readFileSync(replayFile, "utf8"));
    const checked = assertSmokePayload(payload, fixture);
    inspection = checked.inspection;
    syntheticCallId = checked.callId;
  } else {
    const built = buildSmokePayload(fixture);
    payload = built.payload;
    syntheticCallId = built.syntheticCallId;
    inspection = assertSmokePayload(payload, fixture).inspection;
  }

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          syntheticCallId,
          originalCallIdPresent: inspection.originalCallIdPresent,
          fixturePhonesRemaining: inspection.fixturePhonesRemaining,
          callerName: inspection.callerName,
          summary: inspection.summary,
          customerPhone: inspection.customerPhone,
          forwardedFrom: inspection.forwardedFrom,
          messageText: inspection.messageText,
          cleanupSql: cleanupSql(syntheticCallId),
        },
        null,
        2
      )
    );
    return;
  }

  if (outFile) {
    writeFileSync(outFile, `${JSON.stringify(payload)}\n`, { mode: 0o600 });
    chmodSync(outFile, 0o600);
  }

  const report = await postSmoke(payload, syntheticCallId);
  printReport(report, syntheticCallId);
  if (report.httpStatus !== 200 || report.webhookOk !== true) {
    process.exitCode = 1;
  }
  if (report.webhookCallId && report.webhookCallId !== syntheticCallId) {
    process.exitCode = 1;
  }
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectRun) {
  main().catch((err) => {
    const message = err instanceof Error ? err.message : "smoke_test_failed";
    console.error(message);
    process.exitCode = 1;
  });
}
