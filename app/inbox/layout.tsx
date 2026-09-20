import type { ReactNode } from "react";
import type { Metadata } from "next";
import styles from "./inbox.module.css";

export const metadata: Metadata = {
  title: "Menace Inbox | Drew Sepeczi",
  robots: { index: false, follow: false },
};

export default function InboxLayout({ children }: { children: ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
