import type { ReactNode } from "react";
import type { Metadata } from "next";
import { InboxShell } from "./_components/inbox-shell";

export const metadata: Metadata = {
  title: "Menace Inbox | Drew Sepeczi",
  robots: { index: false, follow: false },
};

export default function InboxLayout({ children }: { children: ReactNode }) {
  return <InboxShell>{children}</InboxShell>;
}
