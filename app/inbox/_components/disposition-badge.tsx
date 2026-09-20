import type { InboxDisposition } from "@/app/api/menace/inbox/_lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { dispositionLabel } from "../_lib/format";

function dispositionClass(disposition: string): string {
  switch (disposition) {
    case "booked":
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-200";
    case "done":
      return "border-border bg-muted/60 text-muted-foreground";
    case "spam":
      return "border-destructive/30 bg-destructive/15 text-destructive";
    case "vip_followup":
      return "border-amber-500/40 bg-amber-500/15 text-amber-200";
    default:
      return "border-sky-500/35 bg-sky-500/15 text-sky-200";
  }
}

interface DispositionBadgeProps {
  disposition: InboxDisposition | string;
  className?: string;
}

export function DispositionBadge({ disposition, className }: DispositionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", dispositionClass(disposition), className)}
    >
      {dispositionLabel(disposition)}
    </Badge>
  );
}

export function VipBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-amber-400/50 bg-amber-400/20 font-semibold text-amber-100",
        className
      )}
    >
      VIP
    </Badge>
  );
}
