import { NextRequest, NextResponse } from "next/server";
import { isDrewsCloneAuthorized, unauthorized } from "@/app/api/drews-clone/_lib/auth";
import { getSql } from "@/app/api/drews-clone/_lib/db";
import { getInboxCall, patchInboxCall, type PatchInboxCallInput } from "../_lib/queries";
import { isInboxDisposition } from "../_lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ callId: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  if (!isDrewsCloneAuthorized(req)) {
    return unauthorized();
  }

  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { callId } = await context.params;

  try {
    const call = await getInboxCall(callId);
    if (!call) {
      return NextResponse.json({ found: false }, { status: 404 });
    }
    return NextResponse.json({ found: true, call });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database error";
    console.error("menace_inbox_get_failed", message);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  if (!isDrewsCloneAuthorized(req)) {
    return unauthorized();
  }

  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { callId } = await context.params;

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const patch: PatchInboxCallInput = {};

  if ("disposition" in body) {
    if (!isInboxDisposition(body.disposition)) {
      return NextResponse.json({ error: "Invalid disposition" }, { status: 400 });
    }
    patch.disposition = body.disposition;
  }

  if ("read_at" in body) {
    const readAt = body.read_at;
    if (readAt === null) {
      patch.readAt = null;
    } else if (typeof readAt === "string" && readAt.trim()) {
      patch.readAt = new Date(readAt).toISOString();
    } else {
      return NextResponse.json({ error: "Invalid read_at" }, { status: 400 });
    }
  }

  if ("owner_note" in body) {
    if (typeof body.owner_note !== "string") {
      return NextResponse.json({ error: "Invalid owner_note" }, { status: 400 });
    }
    patch.ownerNote = body.owner_note;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const call = await patchInboxCall(callId, patch);
    if (!call) {
      return NextResponse.json({ found: false }, { status: 404 });
    }
    return NextResponse.json({ ok: true, call });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database error";
    console.error("menace_inbox_patch_failed", message);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
