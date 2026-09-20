import Link from "next/link";
import { getSql } from "@/app/api/drews-clone/_lib/db";
import { listInboxCalls } from "@/app/api/menace/inbox/_lib/queries";
import {
  parseInboxFilter,
  type InboxCallCard,
  type InboxFilter,
} from "@/app/api/menace/inbox/_lib/types";
import { assertInboxPageAccess } from "./_lib/auth";
import {
  dispositionLabel,
  displayCallerName,
  formatPhoneDisplay,
  formatRelativeTime,
  summaryPreview,
} from "./_lib/format";
import styles from "./inbox.module.css";

const FILTERS: { id: InboxFilter; label: string }[] = [
  { id: "needs_you", label: "Needs you" },
  { id: "vip", label: "VIP" },
  { id: "booked", label: "Booked" },
  { id: "all", label: "All" },
];

function chipClass(disposition: string): string {
  switch (disposition) {
    case "booked":
      return styles.chipBooked;
    case "done":
      return styles.chipDone;
    case "spam":
      return styles.chipSpam;
    case "vip_followup":
      return styles.chipVip;
    default:
      return styles.chipNeedsYou;
  }
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; key?: string }>;
}) {
  const params = await searchParams;
  await assertInboxPageAccess(params.key);

  const filter = parseInboxFilter(params.filter ?? null);
  const sql = getSql();

  if (!sql) {
    return (
      <main className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <h1>Menace Inbox</h1>
            <p>Voice triage</p>
          </div>
        </header>
        <div className={styles.error} role="status">
          Database is not configured in this environment.
        </div>
      </main>
    );
  }

  let calls: InboxCallCard[] = [];
  let loadError = false;
  try {
    calls = await listInboxCalls(filter);
  } catch {
    loadError = true;
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1>Menace Inbox</h1>
          <p>Voice triage</p>
        </div>
      </header>

      <nav className={styles.filters} aria-label="Inbox filters">
        {FILTERS.map((item) => (
          <Link
            key={item.id}
            href={item.id === "needs_you" ? "/inbox" : `/inbox?filter=${item.id}`}
            className={styles.filterLink}
            data-active={filter === item.id ? "true" : "false"}
            aria-current={filter === item.id ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {loadError ? (
        <div className={styles.error} role="alert">
          Could not load calls. Run the Menace Inbox migration on Neon if this is a fresh
          deploy.
        </div>
      ) : calls.length === 0 ? (
        <div className={styles.empty} role="status">
          No calls in this view.
        </div>
      ) : (
        <div className={styles.list}>
          {calls.map((call) => {
            const when = call.endedAt ?? call.startedAt ?? call.createdAt;
            return (
              <Link
                key={call.callId}
                href={`/inbox/${encodeURIComponent(call.callId)}`}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <div>
                    <p className={styles.caller}>
                      {displayCallerName(call.callerName, call.contactDisplayName)}
                    </p>
                    <p className={styles.subline}>{formatPhoneDisplay(call.phone)}</p>
                  </div>
                  <div className={styles.badges}>
                    {call.isVip ? (
                      <span className={`${styles.chip} ${styles.chipVip}`}>VIP</span>
                    ) : null}
                    <span className={`${styles.chip} ${chipClass(call.disposition)}`}>
                      {dispositionLabel(call.disposition)}
                    </span>
                  </div>
                </div>
                <p className={styles.summary}>{summaryPreview(call.summary)}</p>
                <p className={styles.meta}>{formatRelativeTime(when)}</p>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
