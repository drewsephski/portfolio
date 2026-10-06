import type { ReactNode } from "react";
import { canonicalUrl } from "@/lib/site";
import type { Metadata } from "next";
import { InboxShell } from "./_components/inbox-shell";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/inbox") },
  title: "Menace Inbox | Drew Sepeczi",
  robots: { index: false, follow: false },
};

export default function InboxLayout({ children }: { children: ReactNode }) {
  return <InboxShell>{children}</InboxShell>;
}
