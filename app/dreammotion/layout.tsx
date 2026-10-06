import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import { Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--dm-display",
  weight: "400",
});

export const metadata = productMetadata("dreammotion");

export default function DreamMotionLayout({ children }: { children: ReactNode }) {
  return (
    <div className={instrumentSerif.variable}>
      <ProductStructuredData slug="dreammotion" />
      {children}
    </div>
  );
}
