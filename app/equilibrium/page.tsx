import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";

import { EquilibriumHero } from "./equilibrium-hero";

export const metadata = productMetadata("equilibrium");

export default function EquilibriumPage() {
  return (
    <>
      <ProductStructuredData slug="equilibrium" />
      <EquilibriumHero />
    </>
  );
}
