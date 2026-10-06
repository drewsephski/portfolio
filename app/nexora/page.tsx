import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import { NexoraHero } from "./nexora-hero";

export const metadata = productMetadata("nexora");

export default function NexoraPage() {
  return (
    <>
      <ProductStructuredData slug="nexora" />
      <NexoraHero />
    </>
  );
}
