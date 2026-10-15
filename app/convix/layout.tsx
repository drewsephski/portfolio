import type { ReactNode } from "react";
import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

const inter = localFont({
  src: "../fonts/InterVariable.woff2",
  weight: "100 900",
  display: "swap",
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
