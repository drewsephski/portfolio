import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--dm-display",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Dream Motion - AI Image and Video Generator",
  description:
    "Create polished AI images and short videos for ads, social posts, product stories, and campaigns.",
};

export default function DreamMotionLayout({ children }: { children: ReactNode }) {
  return <div className={instrumentSerif.variable}>{children}</div>;
}
