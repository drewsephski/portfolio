export const CURSOR_FORWARD_TIMEOUT_MS = 5000;

export type CursorForwardConfig = {
  url: string;
  authorization: string;
  automationKey: string;
};

export function resolveCursorForwardConfig(): CursorForwardConfig | null {
  const url =
    process.env.DREWS_CLONE_CURSOR_WEBHOOK_URL?.trim() ||
    process.env.DREWS_CLONE_WEBHOOK_URL?.trim();
  const authRaw =
    process.env.DREWS_CLONE_CURSOR_WEBHOOK_AUTH?.trim() ||
    process.env.DREWS_CLONE_WEBHOOK_AUTH?.trim();

  if (!url || !authRaw) {
    return null;
  }

  let authorization = authRaw;
  if (authorization.toLowerCase().startsWith("authorization:")) {
    authorization = authorization.split(":").slice(1).join(":").trim();
  }
  if (!authorization.toLowerCase().startsWith("bearer ")) {
    authorization = `Bearer ${authorization}`;
  }
  const token = authorization.slice(7).trim();
  if (!token) {
    return null;
  }

  return {
    url,
    authorization,
    automationKey: token,
  };
}

export type CursorForwardResult =
  | { ok: true; status: number }
  | { ok: false; status: number | null; error: string };

function sanitizeForwardError(err: unknown): string {
  if (err instanceof Error && err.name === "TimeoutError") {
    return "cursor_forward_timeout";
  }
  if (err instanceof Error && err.name === "AbortError") {
    return "cursor_forward_timeout";
  }
  return "cursor_forward_failed";
}

export async function forwardToCursorWebhook(
  body: Record<string, unknown>,
  config: CursorForwardConfig,
  options?: { timeoutMs?: number }
): Promise<CursorForwardResult> {
  const timeoutMs = options?.timeoutMs ?? CURSOR_FORWARD_TIMEOUT_MS;
  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: config.authorization,
        "X-Automation-Key": config.automationKey,
        "User-Agent": "drews-clone-vapi-webhook/vercel",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: `cursor_http_${response.status}`,
      };
    }

    return { ok: true, status: response.status };
  } catch (err: unknown) {
    return {
      ok: false,
      status: null,
      error: sanitizeForwardError(err),
    };
  }
}
