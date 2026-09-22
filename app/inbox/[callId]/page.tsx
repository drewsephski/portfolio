import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ExternalLink, Headphones } from "lucide-react";
import { getSql } from "@/app/api/drews-clone/_lib/db";
import { getInboxCall } from "@/app/api/menace/inbox/_lib/queries";
import { assertInboxPageAccess } from "../_lib/auth";
import {
  displayCallerName,
  formatPhoneDisplay,
  formatRelativeTime,
  telHref,
} from "../_lib/format";
import { CallerAvatar } from "../_components/caller-avatar";
import { CallDetailActions } from "../_components/call-detail-actions";
import { DispositionBadge, VipBadge } from "../_components/disposition-badge";
import { InboxCollapsibleSection } from "../_components/inbox-collapsible-section";
import { MarkCallRead } from "../_components/mark-call-read";
import { OwnerNoteForm } from "../_components/owner-note-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <Alert variant="destructive">
        <AlertTitle>Database unavailable</AlertTitle>
        <AlertDescription>
          Database is not configured in this environment.
        </AlertDescription>
      </Alert>
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
  const callerName = displayCallerName(call.callerName, call.contactDisplayName);

  return (
    <div className="pb-28 md:pb-2">
      <MarkCallRead callId={call.callId} readAt={call.readAt} />

      <header
        className="sticky top-0 z-30 -mx-4 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-5 sm:px-5"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-lg"
            className="shrink-0"
            render={<Link href="/inbox" aria-label="Back to inbox" />}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <CallerAvatar name={callerName} className="size-10" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold leading-tight">{callerName}</p>
            <p className="truncate text-sm text-muted-foreground">
              {formatPhoneDisplay(call.phone)} · {formatRelativeTime(when)}
            </p>
          </div>
          <div className="hidden shrink-0 flex-wrap justify-end gap-1 sm:flex">
            {call.isVip ? <VipBadge /> : null}
            <DispositionBadge disposition={call.disposition} />
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 sm:hidden">
          {call.isVip ? <VipBadge /> : null}
          <DispositionBadge disposition={call.disposition} />
        </div>
      </header>

      <section aria-labelledby="summary-heading" className="mt-4 space-y-2">
        <h2
          id="summary-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Summary
        </h2>
        <Card className="bg-card/50 py-4">
          <CardContent className="text-base leading-relaxed text-foreground">
            {call.summary.trim() || "No summary yet."}
          </CardContent>
        </Card>
      </section>

      {(call.booked || call.bookingSummary || call.calendarLink || call.bookingStart) && (
        <section aria-labelledby="booking-heading" className="mt-4 space-y-2">
          <h2
            id="booking-heading"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Booking
          </h2>
          <Card className="gap-3 py-4">
            <CardHeader className="px-(--card-spacing) pb-0">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Calendar className="size-4 text-muted-foreground" aria-hidden />
                Scheduled
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {call.bookingSummary ? <p className="text-foreground">{call.bookingSummary}</p> : null}
              {call.bookingStart ? (
                <p>
                  {new Date(call.bookingStart).toLocaleString()}
                  {call.bookingEnd ? ` – ${new Date(call.bookingEnd).toLocaleString()}` : ""}
                </p>
              ) : null}
              {call.calendarLink ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-11"
                  render={
                    <a
                      href={call.calendarLink}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open calendar link"
                    />
                  }
                >
                  <ExternalLink className="size-4" />
                  Open calendar
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </section>
      )}

      {call.contact ? (
        <section aria-labelledby="vip-heading" className="mt-4 space-y-2">
          <h2
            id="vip-heading"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            VIP context
          </h2>
          <Card className="py-4">
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {call.contact.relationship ? (
                <span className="font-medium text-foreground">{call.contact.relationship}</span>
              ) : null}
              {call.contact.relationship && call.contact.context ? " · " : null}
              {call.contact.context || "Known contact"}
            </CardContent>
          </Card>
        </section>
      ) : null}

      {call.recordingUrl ? (
        <div className="mt-4">
          <InboxCollapsibleSection title="Recording">
            <Button
              variant="outline"
              size="sm"
              className="min-h-11"
              render={
                <a
                  href={call.recordingUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Listen to call recording"
                />
              }
            >
              <Headphones className="size-4" />
              Listen to recording
            </Button>
          </InboxCollapsibleSection>
        </div>
      ) : null}

      {call.transcript ? (
        <div className="mt-4">
          <InboxCollapsibleSection title="Transcript">
            <p className="whitespace-pre-wrap text-sm text-foreground/90">{call.transcript}</p>
          </InboxCollapsibleSection>
        </div>
      ) : null}

      <div className="mt-4">
        <CallDetailActions
          callId={call.callId}
          initialDisposition={call.disposition}
          phoneLink={phoneLink}
          callerName={callerName}
        />
      </div>

      <Separator className="my-6" />

      <section aria-labelledby="note-heading" className="space-y-3">
        <h2
          id="note-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Owner note
        </h2>
        <OwnerNoteForm callId={call.callId} initialNote={call.ownerNote} />
      </section>
    </div>
  );
}
