import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/site";
import type { ReactNode } from "react";
import { PurchaseDock } from "./marketplace/purchase-dock";
import { PortfolioChat } from "./portfolio-chat/portfolio-chat";
import { ScrollToTopOnNavigation } from "./scroll-to-top-on-navigation";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Drew Sepeczi Portfolio | AI Products & Developer Tools",
  description: "AI products, developer tools, and full-stack software designed and built by Drew Sepeczi.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={cn("font-sans", geist.variable)}>
      <body>
        <ScrollToTopOnNavigation />
        {children}
        <PurchaseDock />
        <PortfolioChat />
      </body>
    </html>
  );
}
