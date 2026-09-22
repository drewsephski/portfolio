import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { normalizeAuthToken } from "@/app/api/drews-clone/_lib/auth";

export const INBOX_ACCESS_COOKIE = "menace_inbox_key";

const INBOX_COOKIE_MAX_AGE = 60 * 60 * 24 * 14;

function inboxSecrets(): string[] {
  const keys = ["MENACE_INBOX_SECRET", "DREWS_CLONE_LEADS_AUTH"];
  const secrets: string[] = [];
  for (const key of keys) {
    const raw = process.env[key];
    if (raw?.trim()) {
      secrets.push(normalizeAuthToken(raw));
    }
  }
  return secrets;
}

export function isInboxKeyValid(provided: string | undefined | null): boolean {
  const expected = inboxSecrets();
  if (expected.length === 0 || !provided?.trim()) {
    return false;
  }
  return expected.includes(normalizeAuthToken(provided));
}

export function inboxAccessCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/inbox",
    maxAge: INBOX_COOKIE_MAX_AGE,
  };
}

/** Call only from a Server Action or Route Handler. */
export async function setInboxAccessCookie(rawKey: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    INBOX_ACCESS_COOKIE,
    normalizeAuthToken(rawKey),
    inboxAccessCookieOptions()
  );
}

export async function assertInboxPageAccess(searchKey?: string): Promise<void> {
  const expected = inboxSecrets();
  if (expected.length === 0) {
    return;
  }

  if (searchKey?.trim()) {
    redirect(`/inbox/auth?key=${encodeURIComponent(searchKey.trim())}`);
  }

  const cookieStore = await cookies();
  const cookieKey = cookieStore.get(INBOX_ACCESS_COOKIE)?.value;
  if (!isInboxKeyValid(cookieKey)) {
    redirect("/inbox/unlock");
  }
}

export async function verifyInboxServerAction(): Promise<boolean> {
  const expected = inboxSecrets();
  if (expected.length === 0) {
    return true;
  }
  const cookieStore = await cookies();
  const cookieKey = cookieStore.get(INBOX_ACCESS_COOKIE)?.value;
  return isInboxKeyValid(cookieKey);
}
