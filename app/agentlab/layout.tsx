import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import { Cabin, Merriweather } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";

const cabin = Cabin({ subsets: ["latin"], variable: "--agentlab-ui" });
const inter = localFont({
  src: "../fonts/InterVariable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--agentlab-body",
});
const merriweather = Merriweather({ subsets: ["latin"], variable: "--agentlab-display" });

export const metadata = productMetadata("agentlab");

export default function AgentLabLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${cabin.variable} ${inter.variable} ${merriweather.variable}`}>
      <ProductStructuredData slug="agentlab" />
      {children}
    </div>
  );
}
