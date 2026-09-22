import { marketplaceProducts } from "@/app/marketplace/catalog";
import { featuredProjects, profile, selectedProducts } from "@/lib/portfolio/content";

export type ChatAction = {
  id: string;
  label: string;
  href: string;
  external: boolean;
};

const actionIdPattern = /^[a-z0-9:-]+$/i;

function pushAction(actions: ChatAction[], seenHrefs: Set<string>, action: ChatAction) {
  if (seenHrefs.has(action.href)) return;
  seenHrefs.add(action.href);
  actions.push(action);
}

function buildPortfolioActions(): ChatAction[] {
  const actions: ChatAction[] = [];
  const seenHrefs = new Set<string>();

  pushAction(actions, seenHrefs, {
    id: "section-work",
    label: "View projects",
    href: "/#featured-projects",
    external: false,
  });
  pushAction(actions, seenHrefs, {
    id: "section-products",
    label: "View products",
    href: "/#products",
    external: false,
  });
  pushAction(actions, seenHrefs, {
    id: "section-about",
    label: "About",
    href: "/#about",
    external: false,
  });
  pushAction(actions, seenHrefs, {
    id: "section-studies",
    label: "View studies",
    href: "/#studies",
    external: false,
  });
  pushAction(actions, seenHrefs, {
    id: "section-templates",
    label: "View templates",
    href: "/#templates",
    external: false,
  });
  pushAction(actions, seenHrefs, {
    id: "section-contact",
    label: "Contact",
    href: "/#contact",
    external: false,
  });
  pushAction(actions, seenHrefs, {
    id: "contact",
    label: "Email Drew",
    href: profile.emailHref,
    external: false,
  });
  pushAction(actions, seenHrefs, {
    id: "github",
    label: "GitHub",
    href: profile.github,
    external: true,
  });
  pushAction(actions, seenHrefs, {
    id: "linkedin",
    label: "LinkedIn",
    href: profile.linkedin,
    external: true,
  });

  for (const project of featuredProjects) {
    pushAction(actions, seenHrefs, {
      id: `live:${project.slug}`,
      label: `Visit ${project.name}`,
      href: `https://${project.domain}`,
      external: true,
    });
  }

  for (const product of selectedProducts) {
    pushAction(actions, seenHrefs, {
      id: `live:${product.slug}`,
      label: `Visit ${product.name}`,
      href: product.href,
      external: true,
    });
  }

  for (const product of marketplaceProducts) {
    const prefix = product.kind === "template" ? "template" : "study";
    pushAction(actions, seenHrefs, {
      id: `${prefix}:${product.slug}`,
      label: `View ${product.name}`,
      href: `/${product.slug}`,
      external: false,
    });
  }

  return actions;
}

export const portfolioActions = buildPortfolioActions();

const actionsById = new Map(portfolioActions.map((action) => [action.id, action]));

export function splitAssistantText(text: string) {
  const trimmedEnd = text.replace(/\s+$/, "");
  const lineBreak = trimmedEnd.lastIndexOf("\n");
  const lastLine = (lineBreak === -1 ? trimmedEnd : trimmedEnd.slice(lineBreak + 1)).trim();
  const bodyBefore = lineBreak === -1 ? "" : trimmedEnd.slice(0, lineBreak).trimEnd();

  if (/^ACTIONS:?$/i.test(lastLine)) {
    return { body: bodyBefore, actionIds: [] as string[] };
  }

  const directive = lastLine.match(/^ACTIONS:\s*(.*)$/i);
  if (!directive) return { body: text.trimEnd(), actionIds: [] as string[] };

  const tokens = (directive[1] ?? "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0 || tokens.some((token) => !actionIdPattern.test(token))) {
    return { body: text.trimEnd(), actionIds: [] as string[] };
  }

  return { body: bodyBefore, actionIds: tokens };
}

export function inferNavigationActions(text: string) {
  const value = text.toLowerCase();
  const ids: string[] = [];
  const navigating = /\b(show|see|take|view|open|scroll|where)\b/.test(value);

  if (navigating && /\b(projects?|featured|his work)\b/.test(value)) ids.push("section-work");
  if (navigating && /\bproducts?\b/.test(value)) ids.push("section-products");
  if (navigating && /\bstud(y|ies)\b/.test(value)) ids.push("section-studies");
  if (navigating && /\btemplates?\b/.test(value)) ids.push("section-templates");
  if (navigating && /\babout\b/.test(value)) ids.push("section-about");
  if (/\b(contact|e-?mail|reach|hire)\b/.test(value)) ids.push("contact");
  if (/\bgithub\b/.test(value)) ids.push("github");
  if (/\blinkedin\b/.test(value)) ids.push("linkedin");

  return ids;
}

export function resolveAssistantActions(text: string, userText: string) {
  const parsed = splitAssistantText(text);
  const resolved: ChatAction[] = [];
  const seen = new Set<string>();

  for (const id of [...parsed.actionIds, ...inferNavigationActions(userText)]) {
    if (seen.has(id)) continue;
    const action = actionsById.get(id);
    if (!action) continue;
    seen.add(id);
    resolved.push(action);
    if (resolved.length === 4) break;
  }

  return { body: parsed.body, actions: resolved };
}
