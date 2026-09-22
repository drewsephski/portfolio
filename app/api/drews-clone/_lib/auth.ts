import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export function normalizeAuthToken(raw: string): string {
  let token = raw.trim();
  if (token.toLowerCase().startsWith("authorization:")) {
    token = token.split(":").slice(1).join(":").trim();
  }
  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }
  return token;
}

function readEnvSecret(key: string): string | null {
  const raw = process.env[key];
  if (!raw?.trim()) {
    return null;
  }
  return normalizeAuthToken(raw);
}

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

function headerTokens(req: NextRequest): string[] {
  const tokens: string[] = [];
  const authorization = req.headers.get("authorization");
  if (authorization?.trim()) {
    tokens.push(normalizeAuthToken(authorization));
  }
  const vapiSecret = req.headers.get("x-vapi-secret");
  if (vapiSecret?.trim()) {
    tokens.push(normalizeAuthToken(vapiSecret));
  }
  return tokens;
}

function matchesAnySecret(provided: string[], expectedSecrets: string[]): boolean {
  if (provided.length === 0 || expectedSecrets.length === 0) {
    return false;
  }
  return provided.some((token) =>
    expectedSecrets.some((secret) => secretsMatch(token, secret))
  );
}

/** Tool routes: leads, contacts, weather, Menace inbox. */
export function isDrewsCloneToolAuthorized(req: NextRequest): boolean {
  const secret = readEnvSecret("DREWS_CLONE_LEADS_AUTH");
  if (!secret) {
    return false;
  }
  return matchesAnySecret(headerTokens(req), [secret]);
}

/**
 * @deprecated Use isDrewsCloneToolAuthorized or isVapiServerWebhookAuthorized.
 * Kept for call sites that only need tool auth.
 */
export function isDrewsCloneAuthorized(req: NextRequest): boolean {
  return isDrewsCloneToolAuthorized(req);
}

/** Legacy `/api/drews-clone/calls` ingest and similar webhook-style routes. */
export function isDrewsCloneWebhookIngestAuthorized(req: NextRequest): boolean {
  const secrets = [
    readEnvSecret("DREWS_CLONE_VAPI_WEBHOOK_SECRET"),
    readEnvSecret("DREWS_CLONE_WEBHOOK_AUTH"),
  ].filter((s): s is string => Boolean(s));
  return matchesAnySecret(headerTokens(req), secrets);
}

/** Vapi server URL target: never accepts leads tool credentials. */
export function isVapiServerWebhookAuthorized(req: NextRequest): boolean {
  return isDrewsCloneWebhookIngestAuthorized(req);
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
