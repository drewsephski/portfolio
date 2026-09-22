import type { RefObject } from "react";
import styles from "./portfolio-chat.module.css";
import { SparklesButton } from "./sparkles-button";

interface ChatTriggerProps {
  buttonRef: RefObject<HTMLButtonElement | null>;
  onOpen: () => void;
}

export function ChatTrigger({ buttonRef, onOpen }: ChatTriggerProps) {
  return (
    <div className={styles.triggerWrap}>
      <span className={styles.tooltip}>Ask about his work</span>
      <SparklesButton
        buttonRef={buttonRef}
        className={styles.trigger}
        aria-label="Ask Drew's AI"
        aria-expanded={false}
        aria-controls="portfolio-chat-panel"
        onClick={onOpen}
      >
        Ask Drew&apos;s AI
      </SparklesButton>
    </div>
  );
}
