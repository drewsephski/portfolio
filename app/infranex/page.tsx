import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import { InfranexCapabilities } from "./infranex-capabilities";
import { InfranexConversion } from "./infranex-conversion";
import { InfranexHero } from "./infranex-hero";
import styles from "./page.module.css";

export const metadata = productMetadata("infranex");

export default function InfranexPage() {
  return (
    <main className={styles.page}>
      <ProductStructuredData slug="infranex" />
      <InfranexHero />
      <InfranexCapabilities />
      <InfranexConversion />
    </main>
  );
}
