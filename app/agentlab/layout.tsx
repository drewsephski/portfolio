import type { Metadata } from "next";
import { Cabin, Inter, Merriweather } from "next/font/google";
import type { ReactNode } from "react";

const cabin = Cabin({ subsets: ["latin"], variable: "--agentlab-ui" });
const inter = Inter({ subsets: ["latin"], variable: "--agentlab-body" });
const merriweather = Merriweather({ subsets: ["latin"], variable: "--agentlab-display" });

export const metadata: Metadata = { title: "AgentLab — AI Workflow & Automation Platform", description: "Build, deploy, and monitor intelligent agents for complex business workflows." };

export default function AgentLabLayout({ children }: { children: ReactNode }) {
  return <div className={`${cabin.variable} ${inter.variable} ${merriweather.variable}`}>{children}</div>;
}
