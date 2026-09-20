import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Headphones,
  Phone,
} from "lucide-react";
import { getSql } from "@/app/api/drews-clone/_lib/db";
import { getInboxCall } from "@/app/api/menace/inbox/_lib/queries";
import { saveOwnerNote, setCallDisposition } from "../actions";
import { assertInboxPageAccess } from "../_lib/auth";
import {
  displayCallerName,
  formatPhoneDisplay,
  formatRelativeTime,
  telHref,
} from "../_lib/format";
import { CallerAvatar } from "../_components/caller-avatar";
import { DispositionBadge, VipBadge } from "../_components/disposition-badge";
import { InboxCollapsibleSection } from "../_components/inbox-collapsible-section";
import { MarkCallRead } from "../_components/mark-call-read";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ callId: string }>;
  searchParams: Promise<{ key?: string }>;
};

const DISPOSITION_ACTIONS = [
  { id: "needs_you" as const, label: "Needs you", variant: "outline" as const },
  { id: "booked" as const, label: "Booked", variant: "secondary" as const },
  { id: "done" as const, label: "Done", variant: "default" as const },
  { id: "spam" as const, label: "Spam", variant: "destructive" as const },
];

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
    <>
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

      <section aria-labelledby="summary-heading" className="space-y-2">
        <h2 id="summary-heading" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Summary
        </h2>
        <Card className="bg-card/50 py-4">
          <CardContent className="text-base leading-relaxed text-foreground">
            {call.summary.trim() || "No summary yet."}
          </CardContent>
        </Card>
      </section>

      {(call.booked || call.bookingSummary || call.calendarLink || call.bookingStart) && (
        <section aria-labelledby="booking-heading" className="space-y-2">
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
        <section aria-labelledby="vip-heading" className="space-y-2">
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
      ) : null}

      {call.transcript ? (
        <InboxCollapsibleSection title="Transcript">
          <p className="whitespace-pre-wrap text-sm text-foreground/90">{call.transcript}</p>
        </InboxCollapsibleSection>
      ) : null}

      <section aria-labelledby="actions-heading" className="space-y-3">
        <h2
          id="actions-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Disposition
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DISPOSITION_ACTIONS.map((action) => (
            <form key={action.id} action={setCallDisposition.bind(null, callId, action.id)}>
              <Button
                type="submit"
                variant={action.variant}
                className={cn(
                  "min-h-11 w-full",
                  call.disposition === action.id && "ring-2 ring-ring ring-offset-2 ring-offset-background"
                )}
                aria-pressed={call.disposition === action.id}
              >
                {action.label}
              </Button>
            </form>
          ))}
        </div>
        {phoneLink ? (
          <Button
            size="lg"
            className="min-h-12 w-full text-base"
            render={<a href={phoneLink} aria-label={`Call back ${callerName}`} />}
          >
            <Phone className="size-4" />
            Call back
          </Button>
        ) : (
          <Button size="lg" className="min-h-12 w-full" disabled aria-disabled="true">
            <Phone className="size-4" />
            No number on file
          </Button>
        )}
      </section>

      <Separator />

      <section aria-labelledby="note-heading" className="space-y-3 pb-2">
        <h2
          id="note-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Owner note
        </h2>
        <form className="space-y-3" action={saveOwnerNote.bind(null, callId)}>
          <div className="space-y-2">
            <Label htmlFor="owner-note">Private follow-up note</Label>
            <Textarea
              id="owner-note"
              name="ownerNote"
              defaultValue={call.ownerNote}
              placeholder="Add context for your next follow-up…"
              rows={4}
              className="min-h-[7rem] resize-y"
            />
          </div>
          <Button type="submit" className="min-h-11 w-full sm:w-auto">
            Save note
          </Button>
        </form>
      </section>
    </>
  );
}
