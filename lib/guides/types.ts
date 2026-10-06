export type GuideFaq = {
  question: string;
  answer: string;
};

export type GuideCta = {
  label: string;
  href: string;
  note?: string;
};

export type GuideTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type GuideSection = {
  id?: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: GuideTable;
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  directAnswer: string;
  eyebrow: string;
  published: string;
  modified?: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  relatedSlugs: string[];
  primaryCta: GuideCta;
  secondaryCtas?: GuideCta[];
};
