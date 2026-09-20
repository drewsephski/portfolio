"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface InboxCollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function InboxCollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className,
}: InboxCollapsibleSectionProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn("rounded-xl border border-border/60 bg-card/40", className)}
    >
      <CollapsibleTrigger
        className="flex min-h-11 w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-label={`Toggle ${title}`}
      >
        <span>{title}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
