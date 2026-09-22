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

export async function forwardToCursorWebhook(
  body: Record<string, unknown>,
  config: CursorForwardConfig
): Promise<CursorForwardResult> {
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
    const message = err instanceof Error ? err.message : "cursor_forward_failed";
    return { ok: false, status: null, error: message };
  }
}
