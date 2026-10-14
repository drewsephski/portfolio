import { canonicalUrl, siteUrl } from "@/lib/site";
import { profile } from "./content";

/** Person + WebSite graph for the homepage. */
export function homeJsonLd() {
  const personId = `${siteUrl}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        url: siteUrl,
        email: `mailto:${profile.email}`,
        jobTitle: "Product Engineer",
        description: profile.about,
        address: { "@type": "PostalAddress", addressLocality: profile.location },
        knowsAbout: ["AI products", "Developer tools", "Next.js", "TypeScript", "Full-stack web development"],
        sameAs: [profile.github, profile.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: profile.name,
        inLanguage: "en-US",
        publisher: { "@id": personId },
        hasPart: { "@type": "WebPage", url: canonicalUrl("/guides"), name: "Guides" },
      },
    ],
  };
}
