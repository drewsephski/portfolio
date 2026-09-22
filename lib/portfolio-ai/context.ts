import { marketplaceBySlug, marketplaceProducts } from "@/app/marketplace/catalog";
import { capabilities, featuredProjects, profile, selectedProducts } from "@/lib/portfolio/content";
import { portfolioActions } from "./actions";

export function describeCurrentPage(pathname: string) {
  if (pathname === "/") return "The visitor is on the portfolio home page.";

  if (!/^\/[a-z0-9/-]{1,120}$/.test(pathname)) {
    return "The visitor's current page could not be identified. Do not guess which project they mean from the URL.";
  }

  const segments = pathname.split("/").filter(Boolean);
  const slug = segments[0] ?? "";
  if (segments.length !== 1) {
    return "The visitor is not on a published project page. Do not guess which project they mean from the URL.";
  }

  const product = marketplaceBySlug.get(slug);
  if (!product) {
    return "The visitor is not on a published project page. Do not guess which project they mean from the URL.";
  }

  const actionId = product.kind === "template" ? `template:${product.slug}` : `study:${product.slug}`;
  const kind = product.kind === "template" ? "template" : "interface study";
  return `The visitor is viewing the ${kind} "${product.name}". Description: ${product.description}. Action id: ${actionId}.`;
}

export function portfolioContextLines() {
  const lines = [
    `Name: ${profile.name}`,
    `Location: ${profile.location}`,
    `Public roles: ${profile.eyebrow}; ${profile.aboutLabel}`,
    `Statement: ${profile.statement}`,
    `Focus: ${profile.focus} ${profile.focusContinued}`,
    `About: ${profile.about}`,
    `Availability: ${profile.availability}`,
    `Email: ${profile.email} (action id: contact)`,
    `GitHub: ${profile.github} (action id: github)`,
    `LinkedIn: ${profile.linkedin} (action id: linkedin)`,
    "No public résumé, education history, GPA, employer list, client list, or performance metrics are published.",
    "Interface studies and complete templates are design explorations Drew publishes for sale. They are not employers or client engagements.",
    "",
    "How he builds:",
    ...capabilities.map(
      (capability) => `- ${capability.label}: ${capability.title}. ${capability.description}`,
    ),
    "",
    "Site sections:",
    "- Featured projects #featured-projects (action id: section-work)",
    "- Selected products #products (action id: section-products)",
    "- About #about (action id: section-about)",
    "- Interface studies #studies (action id: section-studies)",
    "- Complete templates #templates (action id: section-templates)",
    "- Contact #contact (action id: section-contact)",
    "",
    "Featured projects:",
    ...featuredProjects.map(
      (project) =>
        `- ${project.name} (${project.category}): ${project.description} Live: https://${project.domain} (action id: live:${project.slug})`,
    ),
    "",
    "Selected products, presented as shipped work:",
    ...selectedProducts.map((product) => {
      const action = portfolioActions.find((item) => item.href === product.href);
      const actionNote = action ? ` (action id: ${action.id})` : "";
      return `- ${product.name} (${product.type}): ${product.description} Live: ${product.href}${actionNote}`;
    }),
    "",
    "Interface studies:",
    ...marketplaceProducts
      .filter((product) => product.kind === "component")
      .map(
        (product) =>
          `- ${product.name}: ${product.description} Preview: /${product.slug} (action id: study:${product.slug})`,
      ),
    "",
    "Complete templates:",
    ...marketplaceProducts
      .filter((product) => product.kind === "template")
      .map(
        (product) =>
          `- ${product.name}: ${product.description} Preview: /${product.slug} (action id: template:${product.slug})`,
      ),
    "",
    "Technologies explicitly described on the portfolio:",
    "- Menace UI is described as source-ready React interfaces.",
    "- Squid Agent turns prompts, screenshots, and live sites into React prototypes.",
    "- SquidCrawl is a scraper API for AI agents.",
    "- Vault Zero is a voice AI receptionist. Menace Voice is a voice AI platform for shaping voice agents and connecting tools.",
    "- Vault Zero CRM researches businesses and supports recommendations with evidence.",
    "- Elsewhere gives AI workers computers, memory, routines, and approvals.",
    "- Full-stack delivery is described as connecting an interface to auth, data, billing, and deployment. Specific languages, frameworks, and databases beyond the notes above are not published.",
  ];

  return lines.join("\n");
}
