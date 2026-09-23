import { buyVsBuildGuide } from "./articles/buy-vs-build";
import { chooseAiSaasTemplateGuide } from "./articles/choose-ai-saas-template";
import { competitorsGuide } from "./articles/competitors";
import { darkCinematicGuide } from "./articles/dark-cinematic";
import { freeVsPaidGuide } from "./articles/free-vs-paid";
import { heroSectionGuide } from "./articles/hero-section";
import { stackComparisonGuide } from "./articles/stack-comparison";
import { templateVsBoilerplateGuide } from "./articles/template-vs-boilerplate";
import type { Guide } from "./types";

export const allGuides: Guide[] = [
  buyVsBuildGuide,
  templateVsBoilerplateGuide,
  chooseAiSaasTemplateGuide,
  stackComparisonGuide,
  heroSectionGuide,
  darkCinematicGuide,
  competitorsGuide,
  freeVsPaidGuide,
];

const guideBySlug = new Map(allGuides.map((guide) => [guide.slug, guide]));

export function getGuide(slug: string): Guide | undefined {
  return guideBySlug.get(slug);
}

export function getRelatedGuides(guide: Guide): Guide[] {
  return guide.relatedSlugs
    .map((slug) => getGuide(slug))
    .filter((item): item is Guide => item !== undefined);
}
