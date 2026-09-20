import Link from "next/link";
import styles from "../inbox.module.css";
import { unlockInbox } from "../actions";
import { isInboxKeyValid } from "../_lib/auth";

export default async function InboxUnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; error?: string }>;
}) {
  const params = await searchParams;
  const invalidAttempt = params.error === "1";

  if (params.key && isInboxKeyValid(params.key)) {
    return (
      <main className={styles.shell}>
        <div className={styles.unlock}>
          <p>Unlocking inbox…</p>
          <p>
            <Link href={`/inbox/auth?key=${encodeURIComponent(params.key)}`}>Continue</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1>Menace Inbox</h1>
          <p>Owner access</p>
        </div>
      </header>
      <div className={styles.unlock}>
        <p>Open this page with your inbox key, or paste it below.</p>
        {invalidAttempt ? (
          <p role="alert">That key did not match. Try again.</p>
        ) : null}
        <form className={styles.unlockForm} action={unlockInbox}>
          <label htmlFor="inbox-key">Inbox key</label>
          <input
            id="inbox-key"
            name="key"
            type="password"
            autoComplete="off"
            placeholder="Paste DREWS_CLONE_LEADS_AUTH or MENACE_INBOX_SECRET"
            aria-label="Inbox access key"
            required
          />
          <button type="submit">Unlock inbox</button>
        </form>
      </div>
    </main>
  );
}
