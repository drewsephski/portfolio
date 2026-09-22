import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InboxShellProps {
  children: ReactNode;
  className?: string;
}

export function InboxShell({ children, className }: InboxShellProps) {
  return (
    <div
      className={cn(
        "dark min-h-dvh bg-background text-foreground antialiased",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pb-10 pt-5 sm:px-5 sm:pt-6">
        {children}
      </div>
    </div>
  );
}
