import type { Metadata } from "next";
import { InfranexCapabilities } from "./infranex-capabilities";
import { InfranexConversion } from "./infranex-conversion";
import { InfranexHero } from "./infranex-hero";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Infranex — AI & SaaS Template",
  description: "A premium AI task-management landing page template.",
};

export default function InfranexPage() {
  return <main className={styles.page}><InfranexHero /><InfranexCapabilities /><InfranexConversion /></main>;
}
