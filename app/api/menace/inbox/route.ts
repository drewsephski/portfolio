import { NextRequest, NextResponse } from "next/server";
import { isDrewsCloneAuthorized, unauthorized } from "@/app/api/drews-clone/_lib/auth";
import { getSql } from "@/app/api/drews-clone/_lib/db";
import { listInboxCalls } from "./_lib/queries";
import { parseInboxFilter } from "./_lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isDrewsCloneAuthorized(req)) {
    return unauthorized();
  }

  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const filter = parseInboxFilter(req.nextUrl.searchParams.get("filter"));

  try {
    const calls = await listInboxCalls(filter);
    return NextResponse.json({ ok: true, filter, calls });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database error";
    console.error("menace_inbox_list_failed", message);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
