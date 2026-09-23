import type { ReactNode } from "react";
import Link from "next/link";

import { BoldArrowLink } from "@/app/bold-arrow-link";
import { profile } from "@/lib/portfolio/content";

import styles from "./guides.module.css";

interface GuideShellProps {
  children: ReactNode;
  activeNav?: "guides";
}

export function GuideShell({ children, activeNav }: GuideShellProps) {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <nav className={styles.nav} aria-label="Primary navigation">
          <Link className={styles.wordmark} href="/">
            {profile.name}
          </Link>
          <div className={styles.navLinks}>
            <Link href="/#studies">Studies</Link>
            <Link href="/#templates">Templates</Link>
            <Link href="/guides" {...(activeNav === "guides" ? { "aria-current": "page" as const } : {})}>
              Guides
            </Link>
            <BoldArrowLink href={profile.emailHref}>Contact</BoldArrowLink>
          </div>
        </nav>
        {children}
        <footer className={styles.footer}>
          <p>
            <Link href="/">Portfolio</Link>
            <span aria-hidden="true"> · </span>
            <Link href="/guides">Guides</Link>
          </p>
          <div>
            <BoldArrowLink href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </BoldArrowLink>
            <BoldArrowLink href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </BoldArrowLink>
          </div>
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
        </footer>
      </div>
    </main>
  );
}
