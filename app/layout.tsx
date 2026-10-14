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

const siteTitle = "Drew Sepeczi Portfolio | AI Products & Developer Tools";
const siteDescription =
  "Drew Sepeczi builds AI products, developer tools, and full-stack apps, and sells production-ready Next.js templates and hero sections for SaaS launches.";
const ogImage = { url: "/readme-cover.png", width: 1774, height: 887, alt: "Drew Sepeczi — AI products, developer tools, and Next.js templates" };

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  authors: [{ name: "Drew Sepeczi", url: siteUrl }],
  creator: "Drew Sepeczi",
  openGraph: {
    type: "website",
    siteName: "Drew Sepeczi",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage.url],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
