import { Skeleton } from "@/components/ui/skeleton";
import { InboxHeader } from "./inbox-header";

function FilterSkeleton() {
  return (
    <div
      className="sticky top-0 z-20 -mx-4 border-b border-border/60 bg-background/85 px-4 py-2.5 backdrop-blur-md sm:-mx-5 sm:px-5"
      aria-hidden
    >
      <div className="flex gap-1 rounded-lg bg-muted/80 p-1 ring-1 ring-border/40">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-11 flex-1 rounded-md" />
        ))}
      </div>
    </div>
  );
}

function ToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" aria-hidden>
      <Skeleton className="h-11 w-full sm:max-w-xs" />
      <div className="flex gap-2">
        <Skeleton className="h-11 w-32" />
        <Skeleton className="h-11 w-28" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl ring-1 ring-foreground/10">
      <div className="flex gap-3 p-3.5">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-5 w-3/5 max-w-[12rem]" />
              <Skeleton className="h-4 w-2/5 max-w-[8rem]" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-border/50 p-2.5">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

export function InboxListSkeleton() {
  return (
    <>
      <InboxHeader title="Menace Inbox" />
      <FilterSkeleton />
      <ToolbarSkeleton />
      <ul className="flex flex-col gap-2.5" aria-busy="true" aria-label="Loading calls">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index}>
            <CardSkeleton />
          </li>
        ))}
      </ul>
    </>
  );
}
