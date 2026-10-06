import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
/* eslint-disable @next/next/no-page-custom-font */
import type { ReactNode } from "react";

export const metadata = productMetadata("palomar");

export default function PalomarLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        href="https://db.onlinewebfonts.com/c/0e6de1ec911a2e267ff136bbdd384a44?family=Helvetica+Neue+Light"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Oswald:wght@500&family=Montserrat:wght@700&family=Roboto+Slab:wght@600&family=Raleway:wght@700&display=swap"
        rel="stylesheet"
      />
      <ProductStructuredData slug="palomar" />
      {children}
    </>
  );
}
