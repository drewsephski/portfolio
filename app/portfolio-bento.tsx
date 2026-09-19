"use client";

import { InfranexLottie } from "./infranex/infranex-lottie";
import styles from "./portfolio-bento.module.css";

const capabilities = [
  {
    label: "PRODUCT DIRECTION",
    title: "Find the useful first move",
    description: "Turn an ambiguous idea into a focused workflow people can understand and own.",
    animation: "feature-prioritization.json",
  },
  {
    label: "AI SYSTEMS",
    title: "Intelligence with evidence",
    description: "Build AI features around clear inputs, reviewable outputs, and predictable fallbacks.",
    animation: "feature-automation.json",
  },
  {
    label: "FULL-STACK DELIVERY",
    title: "From interface to infrastructure",
    description: "Connect the product surface to reliable auth, data, billing, and deployment paths.",
    animation: "feature-planning.json",
  },
  {
    label: "PRODUCTION OWNERSHIP",
    title: "Ship, verify, improve",
    description: "Carry each release through responsive QA, observability, and the next real user signal.",
    animation: "feature-collaboration.json",
  },
] as const;

const assetRoot = "/infranex-live/";

export function PortfolioBento() {
  return (
    <div className={styles.grid}>
      {capabilities.map((capability, index) => (
        <article className={`${styles.card} ${styles[`card${index}`]}`} key={capability.title}>
          <div className={styles.visual}>
            {index === 0 ? (
              // This image sits beneath the transparent Lottie composition on the source Infranex card.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${assetRoot}GDjODqPtfNZgQeT0MPGXvrBCf3c.webp`} alt="" />
            ) : null}
            <InfranexLottie
              src={`${assetRoot}${capability.animation}`}
              className={styles.animation}
            />
          </div>
          <div className={styles.copy}>
            <p>{capability.label}</p>
            <h3>{capability.title}</h3>
            <span>{capability.description}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
