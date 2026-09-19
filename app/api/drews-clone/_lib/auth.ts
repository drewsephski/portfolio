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

function expectedAuthTokens(includeWebhookAuth: boolean): string[] {
  const keys = ["DREWS_CLONE_LEADS_AUTH"];
  if (includeWebhookAuth) {
    keys.push("DREWS_CLONE_WEBHOOK_AUTH");
  }
  const tokens: string[] = [];
  for (const key of keys) {
    const raw = process.env[key];
    if (raw?.trim()) {
      tokens.push(normalizeAuthToken(raw));
    }
  }
  return tokens;
}

export function isDrewsCloneAuthorized(
  req: NextRequest,
  options?: { includeWebhookAuth?: boolean }
): boolean {
  const expected = expectedAuthTokens(options?.includeWebhookAuth ?? false);
  if (expected.length === 0) {
    return false;
  }
  const header = req.headers.get("authorization");
  if (!header?.trim()) {
    return false;
  }
  const provided = normalizeAuthToken(header);
  return expected.includes(provided);
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
