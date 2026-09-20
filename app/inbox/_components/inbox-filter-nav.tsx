import Link from "next/link";
import type { InboxFilter } from "@/app/api/menace/inbox/_lib/types";
import { cn } from "@/lib/utils";

const FILTERS: { id: InboxFilter; label: string }[] = [
  { id: "needs_you", label: "Needs you" },
  { id: "vip", label: "VIP" },
  { id: "booked", label: "Booked" },
  { id: "all", label: "All" },
];

function filterHref(id: InboxFilter): string {
  return id === "needs_you" ? "/inbox" : `/inbox?filter=${id}`;
}

interface InboxFilterNavProps {
  active: InboxFilter;
}

export function InboxFilterNav({ active }: InboxFilterNavProps) {
  return (
    <nav
      className="sticky top-0 z-20 -mx-4 border-b border-border/60 bg-background/85 px-4 py-2.5 backdrop-blur-md sm:-mx-5 sm:px-5"
      aria-label="Inbox filters"
    >
      <div
        className="flex w-full gap-1 rounded-lg bg-muted/80 p-1 ring-1 ring-border/40"
        role="tablist"
      >
        {FILTERS.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={filterHref(item.id)}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "inline-flex min-h-11 flex-1 items-center justify-center rounded-md px-2 text-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
