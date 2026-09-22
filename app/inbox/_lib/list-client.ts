import type { InboxCallCard } from "@/app/api/menace/inbox/_lib/types";
import { displayCallerName, formatPhoneDisplay } from "./format";

export type InboxSortMode = "newest" | "oldest" | "unread_first";

export function callSortTimestamp(call: InboxCallCard): number {
  const iso = call.endedAt ?? call.startedAt ?? call.createdAt;
  const value = new Date(iso).getTime();
  return Number.isNaN(value) ? 0 : value;
}

export function sortInboxCalls(calls: InboxCallCard[], mode: InboxSortMode): InboxCallCard[] {
  const sorted = [...calls];
  if (mode === "unread_first") {
    sorted.sort((a, b) => {
      const aUnread = a.readAt ? 0 : 1;
      const bUnread = b.readAt ? 0 : 1;
      if (aUnread !== bUnread) {
        return bUnread - aUnread;
      }
      return callSortTimestamp(b) - callSortTimestamp(a);
    });
    return sorted;
  }
  if (mode === "oldest") {
    sorted.sort((a, b) => callSortTimestamp(a) - callSortTimestamp(b));
    return sorted;
  }
  sorted.sort((a, b) => callSortTimestamp(b) - callSortTimestamp(a));
  return sorted;
}

export function callMatchesSearch(call: InboxCallCard, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  const haystack = [
    displayCallerName(call.callerName, call.contactDisplayName),
    formatPhoneDisplay(call.phone),
    call.phone ?? "",
    call.summary,
    call.callerEmail,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}
