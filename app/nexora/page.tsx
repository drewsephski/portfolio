import type { Metadata } from "next";
import { NexoraHero } from "./nexora-hero";

export const metadata: Metadata = {
  title: "Nexora | Smarter Automation",
  description:
    "Automate busywork with intelligent agents that learn, adapt, and execute.",
};

export default function NexoraPage() {
  return <NexoraHero />;
}
