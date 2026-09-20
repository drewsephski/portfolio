import { NextRequest, NextResponse } from "next/server";
import {
  INBOX_ACCESS_COOKIE,
  inboxAccessCookieOptions,
  isInboxKeyValid,
} from "../_lib/auth";
import { normalizeAuthToken } from "@/app/api/drews-clone/_lib/auth";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key?.trim()) {
    return NextResponse.redirect(new URL("/inbox/unlock", request.url));
  }

  if (!isInboxKeyValid(key)) {
    return NextResponse.redirect(new URL("/inbox/unlock?error=1", request.url));
  }

  const response = NextResponse.redirect(new URL("/inbox", request.url));
  response.cookies.set(
    INBOX_ACCESS_COOKIE,
    normalizeAuthToken(key),
    inboxAccessCookieOptions()
  );
  return response;
}
