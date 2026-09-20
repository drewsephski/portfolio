import { Skeleton } from "@/components/ui/skeleton";

export function InboxDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading call detail" className="space-y-4 pb-24">
      <header className="sticky top-0 z-30 -mx-4 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-5 sm:px-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 shrink-0 rounded-lg" />
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>
      </header>

      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-11 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-11 w-28 rounded-lg" />
      </div>
    </div>
  );
}
