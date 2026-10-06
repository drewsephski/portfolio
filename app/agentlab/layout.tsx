import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import { Cabin, Inter, Merriweather } from "next/font/google";
import type { ReactNode } from "react";

const cabin = Cabin({ subsets: ["latin"], variable: "--agentlab-ui" });
const inter = Inter({ subsets: ["latin"], variable: "--agentlab-body" });
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
