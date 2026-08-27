import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PurchaseDock } from "./marketplace/purchase-dock";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drew Sepeczi | Product Engineer",
  description: "AI products, developer tools, and full-stack software designed and built by Drew Sepeczi.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}<PurchaseDock /></body>
    </html>
  );
}
