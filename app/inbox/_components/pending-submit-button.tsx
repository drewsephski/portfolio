"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PendingSubmitButtonProps extends ComponentProps<typeof Button> {
  pendingLabel?: string;
}

export function PendingSubmitButton({
  children,
  pendingLabel,
  className,
  disabled,
  ...props
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn(className)}
      disabled={disabled || pending}
      aria-busy={pending}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>{pendingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
