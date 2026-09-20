import Link from "next/link";
import { AlertCircle, Inbox } from "lucide-react";
import { getSql } from "@/app/api/drews-clone/_lib/db";
import { listInboxCalls } from "@/app/api/menace/inbox/_lib/queries";
import { parseInboxFilter, type InboxCallCard } from "@/app/api/menace/inbox/_lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { assertInboxPageAccess } from "./_lib/auth";
import {
  displayCallerName,
  formatPhoneDisplay,
  formatRelativeTime,
  summaryPreview,
} from "./_lib/format";
import { CallerAvatar } from "./_components/caller-avatar";
import { DispositionBadge, VipBadge } from "./_components/disposition-badge";
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
      ) : calls.length === 0 ? (
        <Card className="border-dashed bg-card/30 py-12">
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Inbox className="size-5 text-muted-foreground" aria-hidden />
            </div>
            <p className="text-sm font-medium text-foreground">No calls in this view</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              New Menace Voice calls will show up here when they need your attention.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2.5" role="list">
          {calls.map((call) => {
            const when = call.endedAt ?? call.startedAt ?? call.createdAt;
            const callerName = displayCallerName(call.callerName, call.contactDisplayName);
            const unread = !call.readAt;

            return (
              <li key={call.callId}>
                <Link
                  href={`/inbox/${encodeURIComponent(call.callId)}`}
                  className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`Open call from ${callerName}`}
                >
                  <Card
                    className={cn(
                      "gap-0 py-0 transition-colors hover:bg-muted/30 active:bg-muted/40",
                      unread && "border-l-2 border-l-sky-400/80 pl-[calc(var(--card-spacing)-2px)]"
                    )}
                  >
                    <CardContent className="space-y-2.5 py-3.5">
                      <div className="flex items-start gap-3">
                        <CallerAvatar name={callerName} className="mt-0.5 size-10" />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-base font-semibold leading-tight text-foreground">
                                {callerName}
                              </p>
                              <p className="truncate text-sm text-muted-foreground">
                                {formatPhoneDisplay(call.phone)}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                              <time
                                className="text-xs tabular-nums text-muted-foreground"
                                dateTime={when}
                              >
                                {formatRelativeTime(when)}
                              </time>
                              {unread ? (
                                <span
                                  className="size-2 rounded-full bg-sky-400"
                                  aria-label="Unread"
                                />
                              ) : null}
                            </div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {summaryPreview(call.summary)}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {call.isVip ? <VipBadge /> : null}
                            <DispositionBadge disposition={call.disposition} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
