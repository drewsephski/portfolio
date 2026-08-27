import type { Metadata } from "next";
import { SalixConversionSections } from "./salix-conversion-sections";
import { SalixFeatureSections } from "./salix-feature-sections";
import { SalixHeaderHero } from "./salix-header-hero";
import styles from "./salix.module.css";

export const metadata: Metadata = {
  title: "Salix — The Smartest Way to Bring Best ROI for Sales",
  description:
    "The smarter way to manage sales starts with tools that streamline every step of the process.",
  icons: { icon: "/salix/favicon.svg" },
};

export default function SalixPage() {
  return (
    <main className={styles.page}>
      <SalixHeaderHero />
      <SalixFeatureSections />
      <SalixConversionSections />
    </main>
  );
}
