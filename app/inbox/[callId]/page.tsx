import Link from "next/link";
import { notFound } from "next/navigation";
import { getSql } from "@/app/api/drews-clone/_lib/db";
import { getInboxCall } from "@/app/api/menace/inbox/_lib/queries";
import { saveOwnerNote, setCallDisposition } from "../actions";
import { assertInboxPageAccess } from "../_lib/auth";
import {
  dispositionLabel,
  displayCallerName,
  formatPhoneDisplay,
  formatRelativeTime,
  telHref,
} from "../_lib/format";
import styles from "../inbox.module.css";

type PageProps = {
  params: Promise<{ callId: string }>;
  searchParams: Promise<{ key?: string }>;
};

export default async function InboxCallDetailPage({ params, searchParams }: PageProps) {
  const [{ callId }, query] = await Promise.all([params, searchParams]);
  await assertInboxPageAccess(query.key);

  const sql = getSql();
  if (!sql) {
    return (
      <main className={styles.shell}>
        <div className={styles.error} role="status">
          Database is not configured in this environment.
        </div>
      </main>
    );
  }

  let call = null;
  try {
    call = await getInboxCall(callId);
  } catch {
    call = null;
  }

  if (!call) {
    notFound();
  }

  const phoneLink = telHref(call.phone);
  const when = call.endedAt ?? call.startedAt ?? call.createdAt;

  return (
    <main className={styles.shell}>
      <Link href="/inbox" className={styles.backLink}>
        ← Back to inbox
      </Link>

      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1>{displayCallerName(call.callerName, call.contactDisplayName)}</h1>
          <p>{formatPhoneDisplay(call.phone)} · {formatRelativeTime(when)}</p>
        </div>
        <div className={styles.badges}>
          {call.isVip ? (
            <span className={`${styles.chip} ${styles.chipVip}`}>VIP</span>
          ) : null}
          <span className={`${styles.chip} ${styles.chipNeedsYou}`}>
            {dispositionLabel(call.disposition)}
          </span>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="summary-title">
        <h2 id="summary-title">Summary</h2>
        <p className={styles.bodyText}>{call.summary.trim() || "No summary yet."}</p>
      </section>

      {call.transcript ? (
        <section className={styles.section} aria-labelledby="transcript-title">
          <details className={styles.details}>
            <summary id="transcript-title">Transcript</summary>
            <p className={styles.bodyText}>{call.transcript}</p>
          </details>
        </section>
      ) : null}

      {call.recordingUrl ? (
        <section className={styles.section} aria-labelledby="recording-title">
          <h2 id="recording-title">Recording</h2>
          <a href={call.recordingUrl} className={styles.backLink} target="_blank" rel="noreferrer">
            Listen to recording
          </a>
        </section>
      ) : null}

      {(call.booked || call.bookingSummary || call.calendarLink) && (
        <section className={styles.section} aria-labelledby="booking-title">
          <h2 id="booking-title">Booking</h2>
          {call.bookingSummary ? (
            <p className={styles.bodyText}>{call.bookingSummary}</p>
          ) : null}
          {call.bookingStart ? (
            <p className={styles.bodyText}>
              {new Date(call.bookingStart).toLocaleString()}
              {call.bookingEnd ? ` – ${new Date(call.bookingEnd).toLocaleString()}` : ""}
            </p>
          ) : null}
          {call.calendarLink ? (
            <a href={call.calendarLink} className={styles.backLink} target="_blank" rel="noreferrer">
              Open calendar link
            </a>
          ) : null}
        </section>
      )}

      {call.contact ? (
        <section className={styles.section} aria-labelledby="vip-title">
          <h2 id="vip-title">VIP context</h2>
          <p className={styles.bodyText}>
            {call.contact.relationship ? `${call.contact.relationship} · ` : ""}
            {call.contact.context || "Known contact"}
          </p>
        </section>
      ) : null}

      <section className={styles.section} aria-labelledby="actions-title">
        <h2 id="actions-title">Actions</h2>
        <div className={styles.actionsRow}>
          {phoneLink ? (
            <a className={`${styles.actionButton} ${styles.actionButtonSecondary}`} href={phoneLink}>
              Call back
            </a>
          ) : (
            <span className={`${styles.actionButton} ${styles.actionButtonSecondary}`} aria-disabled="true">
              No number
            </span>
          )}
          <form action={setCallDisposition.bind(null, callId, "needs_you")}>
            <button type="submit" className={`${styles.actionButton} ${styles.actionButtonSecondary}`}>
              Needs you
            </button>
          </form>
          <form action={setCallDisposition.bind(null, callId, "done")}>
            <button type="submit" className={styles.actionButton}>
              Mark done
            </button>
          </form>
          <form action={setCallDisposition.bind(null, callId, "booked")}>
            <button type="submit" className={`${styles.actionButton} ${styles.actionButtonSecondary}`}>
              Mark booked
            </button>
          </form>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="note-title">
        <h2 id="note-title">Owner note</h2>
        <form className={styles.noteForm} action={saveOwnerNote.bind(null, callId)}>
          <textarea
            name="ownerNote"
            defaultValue={call.ownerNote}
            aria-label="Owner note"
            placeholder="Add a private note for follow-up"
          />
          <button type="submit" className={styles.actionButton}>
            Save note
          </button>
        </form>
      </section>
    </main>
  );
}
