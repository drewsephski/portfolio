import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import type { Viewport } from "next";
import type { ReactNode } from "react";

export const metadata = productMetadata("vantage");

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const motionBootstrap = `
(() => {
  const root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  root.classList.add("motion-pending");
  window.__vantageMotionFallback = window.setTimeout(() => {
    root.classList.remove("motion-pending");
  }, 3500);
})();
`;

export default function VantageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      <ProductStructuredData slug="vantage" />
      {children}
    </>
  );
}
