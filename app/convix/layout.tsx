import type { ReactNode } from "react";
import { Instrument_Serif, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-convix-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-convix-serif",
});

export default function ConvixLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.variable} ${instrumentSerif.variable}`}>
      {children}
    </div>
  );
}
