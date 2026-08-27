import type { Metadata } from "next";

import { EquilibriumHero } from "./equilibrium-hero";

export const metadata: Metadata = {
  title: "Equilibrium",
  description: "Live better and feel whole every day with Equilibrium.",
};

export default function EquilibriumPage() {
  return <EquilibriumHero />;
}
