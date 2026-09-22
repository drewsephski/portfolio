import type { UIMessage } from "ai";
import { maxHistoryMessages, maxMessageLength, modelHistoryMessages } from "./limits";

type PreparedMessages =
  | { ok: true; messages: UIMessage[] }
  | { ok: false };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function prepareChatMessages(input: unknown): PreparedMessages {
  if (!Array.isArray(input) || input.length === 0 || input.length > maxHistoryMessages) {
    return { ok: false };
  }

  const messages: UIMessage[] = [];

  for (const item of input.slice(-modelHistoryMessages)) {
    if (!isRecord(item)) return { ok: false };
    if (item.role !== "user" && item.role !== "assistant") return { ok: false };
    if (typeof item.id !== "string" || item.id.length === 0 || item.id.length > 128) return { ok: false };
    if (!Array.isArray(item.parts) || item.parts.length === 0 || item.parts.length > 12) return { ok: false };

    const parts: UIMessage["parts"] = [];
    let textLength = 0;

    for (const part of item.parts) {
      if (!isRecord(part) || part.type !== "text" || typeof part.text !== "string") continue;
      const text = part.text.trim();
      if (!text) continue;
      textLength += text.length;
      if (textLength > maxMessageLength) return { ok: false };
      parts.push({ type: "text", text });
    }

    if (parts.length === 0) continue;
    messages.push({ id: item.id, role: item.role, parts });
  }

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== "user") return { ok: false };

  return { ok: true, messages };
}
