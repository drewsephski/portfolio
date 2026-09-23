import { allGuides } from "@/lib/guides/catalog";
import { createGuidesIndexMetadata } from "@/lib/guides/metadata";

import { GuideShell } from "./guide-shell";
import { GuidesIndexList } from "./guide-content";
import styles from "./guides.module.css";

export const metadata = createGuidesIndexMetadata();

export default function GuidesIndexPage() {
  return (
    <GuideShell activeNav="guides">
      <header className={styles.indexHeader}>
        <p className={styles.eyebrow}>Guides</p>
        <h1>Next.js landing templates &amp; SaaS marketing</h1>
        <p className={styles.indexIntro}>
          Buyer guides for founders choosing between templates, hero studies, boilerplates, and
          no-code stacks—written for answer engines and humans, tied to live previews on this site.
        </p>
      </header>
      <GuidesIndexList guides={allGuides} />
    </GuideShell>
  );
}
