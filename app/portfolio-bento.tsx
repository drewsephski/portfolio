"use client";

import { capabilities } from "@/lib/portfolio/content";
import { InfranexLottie } from "./infranex/infranex-lottie";
import styles from "./portfolio-bento.module.css";

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
