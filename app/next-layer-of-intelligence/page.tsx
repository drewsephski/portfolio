import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import { Manrope } from "next/font/google";
import { NextLayerClient } from "./next-layer-client";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-next-layer-manrope",
});

export const metadata = productMetadata("next-layer-of-intelligence");

export default function NextLayerPage() {
  return (
    <>
      <ProductStructuredData slug="next-layer-of-intelligence" />
      <NextLayerClient fontClassName={manrope.variable} />
    </>
  );
}
