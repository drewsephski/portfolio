import { notFound } from "next/navigation";

import { allGuides, getGuide } from "@/lib/guides/catalog";
import { GuideStructuredData } from "@/lib/guides/json-ld";
import { createGuideMetadata } from "@/lib/guides/metadata";

import { GuideArticle } from "../guide-content";
import { GuideShell } from "../guide-shell";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    return {};
  }
  return createGuideMetadata(guide);
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <GuideShell>
      <GuideStructuredData guide={guide} />
      <GuideArticle guide={guide} />
    </GuideShell>
  );
}
