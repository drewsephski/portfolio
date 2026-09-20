"use client";

import Link from "next/link";
import { Check, Loader2, Phone, RotateCcw } from "lucide-react";
import { useTransition } from "react";
import type { InboxCallCard } from "@/app/api/menace/inbox/_lib/types";
import type { InboxDisposition } from "@/app/api/menace/inbox/_lib/types";
import { setCallDisposition } from "../actions";
import {
  displayCallerName,
  formatPhoneDisplay,
  formatRelativeTime,
  summaryPreview,
  telHref,
} from "../_lib/format";
import { CallerAvatar } from "./caller-avatar";
import { DispositionBadge, VipBadge } from "./disposition-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
interface InboxCallCardItemProps {
  call: InboxCallCard;
  onOptimisticUpdate: (update: {
    callId: string;
    disposition?: InboxDisposition;
    readAt?: string | null;
  }) => void;
}

export function InboxCallCardItem({ call, onOptimisticUpdate }: InboxCallCardItemProps) {
  const [isPending, startTransition] = useTransition();
  const when = call.endedAt ?? call.startedAt ?? call.createdAt;
  const callerName = displayCallerName(call.callerName, call.contactDisplayName);
  const unread = !call.readAt;
  const phoneLink = telHref(call.phone);

  function handleDisposition(disposition: InboxDisposition) {
    startTransition(async () => {
      onOptimisticUpdate({
        callId: call.callId,
        disposition,
        readAt: disposition === "done" ? new Date().toISOString() : call.readAt,
      });
      await setCallDisposition(call.callId, disposition);
    });
  }

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden py-0 transition-colors",
        unread && "border-l-2 border-l-sky-400/80"
      )}
    >
      <Link
        href={`/inbox/${encodeURIComponent(call.callId)}`}
        className="block rounded-t-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-label={`Open call from ${callerName}`}
      >
        <CardContent className="space-y-2.5 py-3.5 hover:bg-muted/25 active:bg-muted/35">
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
                      title="Unread"
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
      </Link>
      <CardFooter
        className="flex gap-1.5 border-t border-border/50 bg-muted/15 px-2.5 py-2"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="min-h-10 flex-1"
          disabled={isPending}
          onClick={(event) => {
            event.stopPropagation();
            handleDisposition("done");
          }}
          aria-label={`Mark ${callerName} done`}
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Check className="size-3.5" aria-hidden />
          )}
          Done
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-10 flex-1"
          disabled={isPending}
          onClick={(event) => {
            event.stopPropagation();
            handleDisposition("needs_you");
          }}
          aria-label={`Mark ${callerName} needs you`}
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Needs you
        </Button>
        {phoneLink ? (
          <Button
            variant="default"
            size="sm"
            className="min-h-10 flex-1"
            render={
              <a
                href={phoneLink}
                onClick={(event) => event.stopPropagation()}
                aria-label={`Call ${callerName}`}
              />
            }
          >
            <Phone className="size-3.5" aria-hidden />
            Call
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-10 flex-1"
            disabled
            aria-disabled="true"
          >
            <Phone className="size-3.5" aria-hidden />
            Call
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
