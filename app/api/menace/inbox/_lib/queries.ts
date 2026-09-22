import { lookupContact } from "@/app/api/drews-clone/_lib/contacts";
import { getSql } from "@/app/api/drews-clone/_lib/db";
import {
  type InboxCallCard,
  type InboxCallDetail,
  type InboxCallRow,
  type InboxDisposition,
  type InboxFilter,
  parseDisposition,
} from "./types";


function toIso(value: string | Date | null | undefined): string | null {
  if (value == null) {
    return null;
  }
  return new Date(value).toISOString();
}

function rowIsVip(row: InboxCallRow): boolean {
  return Boolean(row.contact_display_name || row.contact_prefer_transfer);
}

function rowToCard(row: InboxCallRow): InboxCallCard {
  const disposition = parseDisposition(row.disposition);
  return {
    callId: row.call_id,
    phone: row.phone,
    callerName: row.caller_name?.trim() ?? "",
    callerEmail: row.caller_email?.trim() ?? "",
    summary: row.summary?.trim() ?? "",
    disposition,
    booked: Boolean(row.booked),
    isVip: rowIsVip(row),
    contactDisplayName: row.contact_display_name,
    startedAt: toIso(row.started_at),
    endedAt: toIso(row.ended_at),
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    readAt: toIso(row.read_at),
    ownerNote: row.owner_note?.trim() ?? "",
  };
}

function rowToDetail(row: InboxCallRow): InboxCallDetail {
  const card = rowToCard(row);
  const hasContact =
    row.contact_display_name ||
    row.contact_relationship ||
    row.contact_context;

  return {
    ...card,
    assistantId: row.assistant_id,
    durationSeconds: row.duration_seconds,
    endedReason: row.ended_reason?.trim() ?? "",
    transcript: row.transcript?.trim() ?? "",
    recordingUrl: row.recording_url?.trim() ?? "",
    bookingSummary: row.booking_summary?.trim() ?? "",
    bookingStart: toIso(row.booking_start),
    bookingEnd: toIso(row.booking_end),
    calendarLink: row.calendar_link?.trim() ?? "",
    contact: hasContact
      ? {
          displayName: row.contact_display_name?.trim() ?? "",
          relationship: row.contact_relationship?.trim() ?? "",
          context: row.contact_context?.trim() ?? "",
          preferTransfer: Boolean(row.contact_prefer_transfer),
          email: "",
        }
      : null,
  };
}

export async function listInboxCalls(filter: InboxFilter): Promise<InboxCallCard[]> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DREWS_CLONE_DATABASE_URL is not configured");
  }

  const rows = await sql`
    SELECT
      c.call_id,
      c.assistant_id,
      c.phone,
      c.caller_name,
      c.caller_email,
      c.started_at,
      c.ended_at,
      c.duration_seconds,
      c.ended_reason,
      c.summary,
      c.transcript,
      c.recording_url,
      c.booked,
      c.booking_summary,
      c.booking_start,
      c.booking_end,
      c.calendar_link,
      c.created_at,
      c.disposition,
      c.read_at,
      c.owner_note,
      ct.display_name AS contact_display_name,
      ct.relationship AS contact_relationship,
      ct.context AS contact_context,
      ct.prefer_transfer AS contact_prefer_transfer
    FROM drews_clone_calls c
    LEFT JOIN drews_clone_contacts ct ON ct.phone = c.phone
    ORDER BY COALESCE(c.ended_at, c.started_at, c.created_at) DESC NULLS LAST
    LIMIT 200
  `;

  let cards = (rows as InboxCallRow[]).map(rowToCard);

  if (filter === "needs_you") {
    cards = cards.filter((c) => c.disposition === "needs_you");
  } else if (filter === "booked") {
    cards = cards.filter((c) => c.disposition === "booked" || c.booked);
  } else if (filter === "vip") {
    cards = cards.filter((c) => c.isVip);
  }

  return cards;
}

export async function getInboxCall(callId: string): Promise<InboxCallDetail | null> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DREWS_CLONE_DATABASE_URL is not configured");
  }

  const rows = await sql`
    SELECT
      c.call_id,
      c.assistant_id,
      c.phone,
      c.caller_name,
      c.caller_email,
      c.started_at,
      c.ended_at,
      c.duration_seconds,
      c.ended_reason,
      c.summary,
      c.transcript,
      c.recording_url,
      c.booked,
      c.booking_summary,
      c.booking_start,
      c.booking_end,
      c.calendar_link,
      c.created_at,
      c.disposition,
      c.read_at,
      c.owner_note,
      ct.display_name AS contact_display_name,
      ct.relationship AS contact_relationship,
      ct.context AS contact_context,
      ct.prefer_transfer AS contact_prefer_transfer
    FROM drews_clone_calls c
    LEFT JOIN drews_clone_contacts ct ON ct.phone = c.phone
    WHERE c.call_id = ${callId}
    LIMIT 1
  `;

  const row = rows[0] as InboxCallRow | undefined;
  if (!row) {
    return null;
  }

  const detail = rowToDetail(row);
  if (detail.phone) {
    const contact = await lookupContact(detail.phone);
    if (contact) {
      detail.contact = {
        displayName: contact.displayName,
        relationship: contact.relationship,
        context: contact.context,
        preferTransfer: contact.preferTransfer,
        email: contact.email,
      };
      detail.isVip = true;
      if (!detail.contactDisplayName && contact.displayName) {
        detail.contactDisplayName = contact.displayName;
      }
    }
  }

  return detail;
}

export type PatchInboxCallInput = {
  disposition?: InboxDisposition;
  readAt?: string | null;
  ownerNote?: string;
};

export async function patchInboxCall(
  callId: string,
  patch: PatchInboxCallInput
): Promise<InboxCallDetail | null> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DREWS_CLONE_DATABASE_URL is not configured");
  }

  const existing = await getInboxCall(callId);
  if (!existing) {
    return null;
  }

  const disposition = patch.disposition ?? existing.disposition;
  const readAt =
    patch.readAt !== undefined
      ? patch.readAt
      : existing.readAt;
  const ownerNote =
    patch.ownerNote !== undefined ? patch.ownerNote : existing.ownerNote;

  await sql`
    UPDATE drews_clone_calls
    SET
      disposition = ${disposition},
      read_at = ${readAt}::timestamptz,
      owner_note = ${ownerNote}
    WHERE call_id = ${callId}
  `;

  return getInboxCall(callId);
}
