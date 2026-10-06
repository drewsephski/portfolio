import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./fusion-ai.css";

export const metadata = productMetadata("fusion-ai");

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default function FusionAiLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ProductStructuredData slug="fusion-ai" />
      {children}
    </>
  );
}
