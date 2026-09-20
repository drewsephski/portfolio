export const INBOX_DISPOSITIONS = [
  "needs_you",
  "booked",
  "done",
  "spam",
  "vip_followup",
] as const;

export type InboxDisposition = (typeof INBOX_DISPOSITIONS)[number];

export type InboxFilter = "needs_you" | "vip" | "booked" | "all";

export type InboxCallRow = {
  call_id: string;
  assistant_id: string | null;
  phone: string | null;
  caller_name: string | null;
  caller_email: string | null;
  started_at: string | Date | null;
  ended_at: string | Date | null;
  duration_seconds: number | null;
  ended_reason: string | null;
  summary: string | null;
  transcript: string | null;
  recording_url: string | null;
  booked: boolean;
  booking_summary: string | null;
  booking_start: string | Date | null;
  booking_end: string | Date | null;
  calendar_link: string | null;
  created_at: string | Date;
  disposition: string | null;
  read_at: string | Date | null;
  owner_note: string | null;
  contact_display_name: string | null;
  contact_relationship: string | null;
  contact_context: string | null;
  contact_prefer_transfer: boolean | null;
};

export type InboxCallCard = {
  callId: string;
  phone: string | null;
  callerName: string;
  callerEmail: string;
  summary: string;
  disposition: InboxDisposition;
  booked: boolean;
  isVip: boolean;
  contactDisplayName: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  readAt: string | null;
  ownerNote: string;
};

export type InboxCallDetail = InboxCallCard & {
  assistantId: string | null;
  durationSeconds: number | null;
  endedReason: string;
  transcript: string;
  recordingUrl: string;
  bookingSummary: string;
  bookingStart: string | null;
  bookingEnd: string | null;
  calendarLink: string;
  contact: {
    displayName: string;
    relationship: string;
    context: string;
    preferTransfer: boolean;
    email: string;
  } | null;
};

export function parseDisposition(value: string | null | undefined): InboxDisposition {
  if (value && INBOX_DISPOSITIONS.includes(value as InboxDisposition)) {
    return value as InboxDisposition;
  }
  return "needs_you";
}

export function isInboxDisposition(value: unknown): value is InboxDisposition {
  return typeof value === "string" && INBOX_DISPOSITIONS.includes(value as InboxDisposition);
}

export function parseInboxFilter(raw: string | null): InboxFilter {
  if (raw === "vip" || raw === "booked" || raw === "all") {
    return raw;
  }
  return "needs_you";
}
