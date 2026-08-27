import { FusionDetailedFeatures, FusionProductFeatures } from "./fusion-features";
import { FusionHeaderHero } from "./fusion-header-hero";
import { FusionLowerPage } from "./fusion-lower-page";
import { FusionShowcase } from "./fusion-showcase";
export default function FusionAiPage() {
  return (
    <main className="fusionPage">
      <FusionHeaderHero />
      <FusionShowcase />
      <FusionDetailedFeatures />
      <FusionProductFeatures />
      <FusionLowerPage />
    </main>
  );
}
