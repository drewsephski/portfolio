import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import { SalixConversionSections } from "./salix-conversion-sections";
import { SalixFeatureSections } from "./salix-feature-sections";
import { SalixHeaderHero } from "./salix-header-hero";
import styles from "./salix.module.css";

export const metadata = {
  ...productMetadata("salix"),
  icons: { icon: "/salix/favicon.svg" },
};

export default function SalixPage() {
  return (
    <main className={styles.page}>
      <ProductStructuredData slug="salix" />
      <SalixHeaderHero />
      <SalixFeatureSections />
      <SalixConversionSections />
    </main>
  );
}
