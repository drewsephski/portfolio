"use client";

import { requestPortfolioChat } from "./open-portfolio-chat";
import styles from "./portfolio-chat.module.css";
import { SparklesButton } from "./sparkles-button";

export function AskDrewButton() {
  return (
    <SparklesButton className={styles.askCta} onClick={requestPortfolioChat}>
      Ask Drew&apos;s AI
    </SparklesButton>
  );
}
