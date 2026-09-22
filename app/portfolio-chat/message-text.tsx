import type { ReactNode } from "react";
import styles from "./portfolio-chat.module.css";

interface MessageTextProps {
  text: string;
}

function isSafeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/\\")) return true;
  if (/^mailto:[^\s<>]+$/.test(href)) return true;

  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function renderInline(text: string, keyPrefix: string) {
  const nodes: ReactNode[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g);

  parts.forEach((part, index) => {
    if (!part) return;
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(<strong key={key}>{part.slice(2, -2)}</strong>);
      return;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(<code key={key}>{part.slice(1, -1)}</code>);
      return;
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const label = link[1] ?? part;
      const href = link[2] ?? "";
      if (!isSafeHref(href)) {
        nodes.push(<span key={key}>{label}</span>);
        return;
      }

      const external = href.startsWith("http://") || href.startsWith("https://");
      nodes.push(
        <a
          key={key}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>,
      );
      return;
    }

    nodes.push(<span key={key}>{part}</span>);
  });

  return nodes;
}

export function MessageText({ text }: MessageTextProps) {
  const blocks = text.split(/\n{2,}/).filter((block) => block.trim());
  if (blocks.length === 0) return null;

  return (
    <div className={styles.copy}>
      {blocks.map((block, blockIndex) => (
        <p key={blockIndex}>
          {block.split("\n").map((line, lineIndex) => {
            const listMatch = line.match(/^\s*[-*]\s+(.*)$/);
            const content = listMatch?.[1] ?? line;
            return (
              <span key={`${blockIndex}-${lineIndex}`}>
                {lineIndex > 0 ? <br /> : null}
                {listMatch ? "• " : null}
                {renderInline(content, `${blockIndex}-${lineIndex}`)}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
