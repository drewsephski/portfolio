"use client";

import { useOptimistic, useTransition } from "react";
import { Loader2, Phone } from "lucide-react";
import type { InboxDisposition } from "@/app/api/menace/inbox/_lib/types";
import { setCallDisposition } from "../actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DISPOSITION_ACTIONS: {
  id: InboxDisposition;
  label: string;
  variant: "outline" | "secondary" | "default" | "destructive";
  shortLabel: string;
}[] = [
  { id: "needs_you", label: "Needs you", shortLabel: "Needs", variant: "outline" },
  { id: "booked", label: "Booked", shortLabel: "Booked", variant: "secondary" },
  { id: "done", label: "Done", shortLabel: "Done", variant: "default" },
  { id: "spam", label: "Spam", shortLabel: "Spam", variant: "destructive" },
];

interface CallDetailActionsProps {
  callId: string;
  initialDisposition: InboxDisposition;
  phoneLink: string | null;
  callerName: string;
}

export function CallDetailActions({
  callId,
  initialDisposition,
  phoneLink,
  callerName,
}: CallDetailActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [disposition, setOptimisticDisposition] = useOptimistic(
    initialDisposition,
    (_current, next: InboxDisposition) => next
  );

  function handleDisposition(next: InboxDisposition) {
    startTransition(async () => {
      setOptimisticDisposition(next);
      await setCallDisposition(callId, next);
    });
  }

  return (
    <>
      <section
        aria-labelledby="actions-heading"
        className="hidden space-y-3 md:block"
      >
        <h2
          id="actions-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Disposition
        </h2>
        <DispositionGrid
          disposition={disposition}
          isPending={isPending}
          onSelect={handleDisposition}
        />
        <CallBackButton phoneLink={phoneLink} callerName={callerName} className="min-h-12 w-full" />
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        role="toolbar"
        aria-label="Call actions"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          <div className="grid grid-cols-4 gap-1.5">
            {DISPOSITION_ACTIONS.map((action) => (
              <Button
                key={action.id}
                type="button"
                variant={action.variant}
                size="sm"
                className={cn(
                  "min-h-10 px-1 text-xs",
                  disposition === action.id &&
                    "ring-2 ring-ring ring-offset-2 ring-offset-background"
                )}
                disabled={isPending}
                aria-pressed={disposition === action.id}
                onClick={() => handleDisposition(action.id)}
              >
                {isPending && disposition === action.id ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : (
                  action.shortLabel
                )}
              </Button>
            ))}
          </div>
          <CallBackButton phoneLink={phoneLink} callerName={callerName} className="min-h-11 w-full" />
        </div>
      </div>
    </>
  );
}

function DispositionGrid({
  disposition,
  isPending,
  onSelect,
}: {
  disposition: InboxDisposition;
  isPending: boolean;
  onSelect: (value: InboxDisposition) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {DISPOSITION_ACTIONS.map((action) => (
        <Button
          key={action.id}
          type="button"
          variant={action.variant}
          className={cn(
            "min-h-11 w-full",
            disposition === action.id &&
              "ring-2 ring-ring ring-offset-2 ring-offset-background"
          )}
          disabled={isPending}
          aria-pressed={disposition === action.id}
          onClick={() => onSelect(action.id)}
        >
          {isPending && disposition === action.id ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : null}
          {action.label}
        </Button>
      ))}
    </div>
  );
}

function CallBackButton({
  phoneLink,
  callerName,
  className,
}: {
  phoneLink: string | null;
  callerName: string;
  className?: string;
}) {
  if (phoneLink) {
    return (
      <Button
        size="lg"
        className={className}
        render={<a href={phoneLink} aria-label={`Call back ${callerName}`} />}
      >
        <Phone className="size-4" />
        Call back
      </Button>
    );
  }

  return (
    <Button size="lg" className={className} disabled aria-disabled="true">
      <Phone className="size-4" />
      No number on file
    </Button>
  );
}
