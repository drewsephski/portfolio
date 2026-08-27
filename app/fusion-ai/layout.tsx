import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./fusion-ai.css";

export const metadata: Metadata = {
  title: "Fusion AI — AI Workspace for Modern Teams",
  description:
    "Automate workflows, surface insights, and ship faster with Fusion AI, the AI workspace built for modern teams.",
};

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default function FusionAiLayout({ children }: { children: ReactNode }) {
  return children;
}
