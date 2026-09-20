"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { Inbox, SearchX } from "lucide-react";
import type { InboxCallCard } from "@/app/api/menace/inbox/_lib/types";
import type { InboxDisposition } from "@/app/api/menace/inbox/_lib/types";
import { markCallsReadInView } from "../actions";
import {
  callMatchesSearch,
  sortInboxCalls,
  type InboxSortMode,
} from "../_lib/list-client";
import { InboxCallCardItem } from "./inbox-call-card";
import { InboxToolbar } from "./inbox-toolbar";
import { Card, CardContent } from "@/components/ui/card";

type OptimisticPatch = {
  callId: string;
  disposition?: InboxDisposition;
  readAt?: string | null;
};

function applyPatches(calls: InboxCallCard[], patch: OptimisticPatch): InboxCallCard[] {
  return calls.map((call) =>
    call.callId === patch.callId
      ? {
          ...call,
          disposition: patch.disposition ?? call.disposition,
          readAt: patch.readAt !== undefined ? patch.readAt : call.readAt,
        }
      : call
  );
}

interface InboxCallListProps {
  initialCalls: InboxCallCard[];
}

export function InboxCallList({ initialCalls }: InboxCallListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<InboxSortMode>("newest");
  const [markAllPending, startMarkAll] = useTransition();

  const [optimisticCalls, applyOptimistic] = useOptimistic(
    initialCalls,
    (state, patch: OptimisticPatch) => applyPatches(state, patch)
  );

  const visibleCalls = useMemo(() => {
    const filtered = optimisticCalls.filter((call) => callMatchesSearch(call, searchQuery));
    return sortInboxCalls(filtered, sortMode);
  }, [optimisticCalls, searchQuery, sortMode]);

  const unreadInView = visibleCalls.filter((call) => !call.readAt);

  function handleMarkAllRead() {
    const ids = unreadInView.map((call) => call.callId);
    const readAt = new Date().toISOString();
    startMarkAll(() => {
      for (const callId of ids) {
        applyOptimistic({ callId, readAt });
      }
      void markCallsReadInView(ids);
    });
  }

  if (initialCalls.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-3">
      <InboxToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        unreadInViewCount={unreadInView.length}
        onMarkAllRead={handleMarkAllRead}
        markAllReadPending={markAllPending}
      />

      {visibleCalls.length === 0 ? (
        <Card className="border-dashed bg-card/30 py-10">
          <CardContent className="flex flex-col items-center gap-2 text-center">
            <SearchX className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm font-medium text-foreground">No matches</p>
            <p className="text-sm text-muted-foreground">
              Try a different search or clear the filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2.5" role="list">
          {visibleCalls.map((call) => (
            <li key={call.callId}>
              <InboxCallCardItem call={call} onOptimisticUpdate={applyOptimistic} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
