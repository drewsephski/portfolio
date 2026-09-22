"use client";

import { useEffect, useRef } from "react";
import { markCallRead } from "../actions";

interface MarkCallReadProps {
  callId: string;
  readAt: string | null;
}

export function MarkCallRead({ callId, readAt }: MarkCallReadProps) {
  const marked = useRef(false);

  useEffect(() => {
    if (readAt || marked.current) {
      return;
    }
    marked.current = true;
    void markCallRead(callId);
  }, [callId, readAt]);

  return null;
}
