import { neon } from "@neondatabase/serverless";

export function getSql() {
  const url = process.env.DREWS_CLONE_DATABASE_URL;
  if (!url) {
    return null;
  }
  return neon(url);
}

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) {
    return null;
  }
  let normalized = digits;
  if (normalized.length === 11 && normalized.startsWith("1")) {
    normalized = normalized.slice(1);
  }
  if (normalized.length < 10) {
    return null;
  }
  return normalized;
}

export function parseTimestamp(value: unknown): Date | null {
  if (value == null || value === "") {
    return null;
  }
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d;
    }
  }
  return null;
}

export function strField(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return undefined;
}
