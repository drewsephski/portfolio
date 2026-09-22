import type { UIMessage } from "ai";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { MouseEvent } from "react";
import { resolveAssistantActions, type ChatAction } from "@/lib/portfolio-ai/actions";
import { MessageText } from "./message-text";
import styles from "./portfolio-chat.module.css";

interface ChatMessageProps {
  message: UIMessage;
  userText: string;
  streaming: boolean;
  pathname: string;
  onSectionNavigate: () => void;
}

function messageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function isHashOnThisPage(href: string, pathname: string) {
  const [path, hash] = href.split("#");
  if (!hash) return false;
  return (path === "" || path === pathname) && Boolean(document.getElementById(hash));
}

export function ChatMessage({ message, userText, streaming, pathname, onSectionNavigate }: ChatMessageProps) {
  const rawText = messageText(message);

  if (message.role === "user") {
    return (
      <article className={`${styles.message} ${styles.user}`}>
        <MessageText text={rawText} />
      </article>
    );
  }

  const { body, actions } = resolveAssistantActions(rawText, userText);

  function handleActionClick(event: MouseEvent<HTMLAnchorElement>, action: ChatAction) {
    if (!isHashOnThisPage(action.href, pathname)) return;
    const hash = action.href.split("#")[1];
    const target = hash ? document.getElementById(hash) : null;
    if (!target) return;
    event.preventDefault();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    onSectionNavigate();
  }

  return (
    <article className={`${styles.message} ${styles.assistant}`}>
      {body ? <MessageText text={body} /> : null}
      {streaming ? <span className={styles.cursor} aria-hidden="true" /> : null}
      {actions.length > 0 ? (
        <div className={styles.actions}>
          {actions.map((action) =>
            action.external || action.href.startsWith("mailto:") ? (
              <a
                key={action.id}
                className={styles.action}
                href={action.href}
                {...(action.external
                  ? {
                      target: "_blank",
                      rel: "noopener noreferrer",
                      "aria-label": `${action.label} (opens in a new tab)`,
                    }
                  : {})}
              >
                {action.label}
                {action.external ? <ArrowUpRight aria-hidden="true" /> : null}
              </a>
            ) : (
              <Link key={action.id} className={styles.action} href={action.href} onClick={(event) => handleActionClick(event, action)}>
                {action.label}
              </Link>
            ),
          )}
        </div>
      ) : null}
    </article>
  );
}
