"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { InboxSortMode } from "../_lib/list-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InboxToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  sortMode: InboxSortMode;
  onSortModeChange: (mode: InboxSortMode) => void;
  unreadInViewCount: number;
  onMarkAllRead: () => void;
  markAllReadPending: boolean;
}

export function InboxToolbar({
  searchQuery,
  onSearchQueryChange,
  sortMode,
  onSortModeChange,
  unreadInViewCount,
  onMarkAllRead,
  markAllReadPending,
}: InboxToolbarProps) {
  const [draft, setDraft] = useState(searchQuery);

  useEffect(() => {
    setDraft(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      onSearchQueryChange(draft);
    }, 280);
    return () => window.clearTimeout(handle);
  }, [draft, onSearchQueryChange]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search name, phone, or summary"
          aria-label="Search inbox"
          className="min-h-11 pl-10"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={sortMode}
          onValueChange={(value) => onSortModeChange(value as InboxSortMode)}
        >
          <SelectTrigger className="min-h-11 w-full flex-1 sm:w-[11rem]" aria-label="Sort calls">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="unread_first">Unread first</SelectItem>
          </SelectContent>
        </Select>
        {unreadInViewCount > 0 ? (
          <Button
            type="button"
            variant="outline"
            className="min-h-11 shrink-0"
            disabled={markAllReadPending}
            onClick={onMarkAllRead}
            aria-busy={markAllReadPending}
          >
            Mark {unreadInViewCount} read
          </Button>
        ) : null}
      </div>
    </div>
  );
}
