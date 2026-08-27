import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { NextLayerClient } from "./next-layer-client";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-next-layer-manrope",
});

export const metadata: Metadata = {
  title: "The Next Layer of Intelligence",
  description:
    "A unified infrastructure platform to help teams build, ship, and scale AI systems with confidence.",
};

export default function NextLayerPage() {
  return <NextLayerClient fontClassName={manrope.variable} />;
}
