import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import styles from "./bold-arrow-link.module.css";

type BoldArrowLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export const boldArrowGroupClassName = styles.group;

export function BoldArrow() {
  return (
    <span className={styles.arrowFrame} aria-hidden="true">
      <span className={styles.arrowClip}>
        <span className={styles.arrowTrack}>
          <span><ArrowUpRight /></span>
          <span><ArrowUpRight /></span>
        </span>
      </span>
    </span>
  );
}

export function BoldArrowLink({ children, className, ...props }: BoldArrowLinkProps) {
  return (
    <a
      className={[styles.link, className].filter(Boolean).join(" ")}
      {...props}
    >
      <span className={styles.label}>{children}</span>
      <BoldArrow />
    </a>
  );
}
