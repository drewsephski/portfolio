import { AlertCircle } from "lucide-react";
import { getSql } from "@/app/api/drews-clone/_lib/db";
import { listInboxCalls } from "@/app/api/menace/inbox/_lib/queries";
import { parseInboxFilter, type InboxCallCard } from "@/app/api/menace/inbox/_lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { assertInboxPageAccess } from "./_lib/auth";
import { InboxCallList } from "./_components/inbox-call-list";
import { InboxFilterNav } from "./_components/inbox-filter-nav";
import { InboxHeader } from "./_components/inbox-header";

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
      <>
        <InboxHeader title="Menace Inbox" />
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Database unavailable</AlertTitle>
          <AlertDescription>
            Database is not configured in this environment.
          </AlertDescription>
        </Alert>
      </>
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
    <>
      <InboxHeader title="Menace Inbox" />
      <InboxFilterNav active={filter} />

      {loadError ? (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="size-4" />
          <AlertTitle>Could not load calls</AlertTitle>
          <AlertDescription>
            Run the Menace Inbox migration on Neon if this is a fresh deploy.
          </AlertDescription>
        </Alert>
      ) : (
        <InboxCallList initialCalls={calls} />
      )}
    </>
  );
}
