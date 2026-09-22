import { NextRequest, NextResponse } from "next/server";
import { isDrewsCloneAuthorized, unauthorized } from "../_lib/auth";
import { lookupContact } from "../_lib/contacts";
import { normalizePhone } from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const phoneParam = req.nextUrl.searchParams.get("phone");
  if (!phoneParam) {
    return NextResponse.json({ ok: true, service: "drews-clone-contacts" });
  }

  if (!isDrewsCloneAuthorized(req)) {
    return unauthorized();
  }

  const phone = normalizePhone(phoneParam);
  if (!phone) {
    return NextResponse.json({ error: "Invalid or missing phone" }, { status: 400 });
  }

  try {
    const contact = await lookupContact(phone);
    if (!contact) {
      return NextResponse.json({ found: false });
    }
    return NextResponse.json({ found: true, contact });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database error";
    console.error("drews_clone_contacts_get_failed", message);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
