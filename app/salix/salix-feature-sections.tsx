"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./salix.module.css";

const powerCards = [
  {
    title: "Task & Activity Tracking",
    description: "Assign tasks, schedule meetings and track team activities",
    image: "/salix/power-task.png",
  },
  {
    title: "Real-Time Visits",
    description: "Generate detailed reports on sales performance, team productivity",
    image: "/salix/power-visits.png",
  },
  {
    title: "Reporting & Analytics",
    description: "Enable seamless communication and file sharing among sales reps",
    image: "/salix/power-reporting.png",
  },
] as const;

const tools = [
  { label: "Sales Automation", image: "/salix/tool-automation.png" },
  { label: "Deal Tracking", image: "/salix/tool-deals.png" },
  { label: "CRM Integration", image: "/salix/tool-crm.png" },
] as const;

const toolDescription =
  "Automate repetitive tasks like follow-ups, reminders, and data entry to save time and increase efficiency.";

const coreFeatures = [
  ["Sales Goal Tracking", "Sales Goal Tracking helps teams stay aligned, focused"],
  ["Price Management", "Price management helps adjust and control pricing strategies"],
  ["Sales Gamification", "Sales gamification is the use of game-like elements"],
  ["Smart Forecasting", "Smart Forecasting uses real-time data and AI to predict future"],
  ["Sales Workflows", "Sales workflows are structured processes that guide your team"],
  ["Access Control", "Access control ensures that only the right people can view"],
] as const;

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className={styles.featureHeading}>
      <p className={styles.featureEyebrow}>{eyebrow}</p>
      <h2 className={styles.featureTitle}>{title}</h2>
      <p className={styles.featureSubtitle}>{description}</p>
    </header>
  );
}

function PowerPack() {
  return (
    <section className={styles.powerSection}>
      <div className={styles.featureSectionInner}>
        <SectionHeading
          eyebrow="Power Pack"
          title="Why businesses choose Salix"
          description="Businesses choose Salix because it simplifies the complexity of sales management."
        />
        <div className={styles.powerGrid}>
          {powerCards.map((card) => (
            <article className={styles.powerCard} key={card.title}>
              <div className={styles.powerCardCopy}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <div className={styles.powerCardMedia}>
                <Image src={card.image} alt="" fill sizes="(max-width: 767px) 100vw, 337px" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function KeyTools() {
  const [activeTool, setActiveTool] = useState(0);

  useEffect(() => {
    const panels = tools
      .map((_, index) => document.getElementById(`salix-tool-${index + 1}`))
      .filter((panel): panel is HTMLElement => panel !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveTool(Number((visible.target as HTMLElement).dataset.toolIndex));
      },
      { rootMargin: "-25% 0px -40%", threshold: [0.15, 0.35, 0.6] },
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.toolsSection}>
      <div className={styles.toolsLayout}>
        <div className={styles.toolsSticky}>
          <p className={styles.featureEyebrow}>Key Tools</p>
          <h2 className={styles.featureTitle}>AI that moves sales forward &amp; faster</h2>
          <nav className={styles.toolIndex} aria-label="Key tools">
            {tools.map((tool, index) => (
              <a
                className={`${styles.toolIndexLink} ${activeTool === index ? styles.toolIndexLinkActive : ""}`}
                href={`#salix-tool-${index + 1}`}
                key={tool.label}
                aria-current={activeTool === index ? "true" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {tool.label}
              </a>
            ))}
          </nav>
        </div>
        <div className={styles.toolPanels}>
          {tools.map((tool, index) => (
            <article
              className={styles.toolPanel}
              data-tool-index={index}
              id={`salix-tool-${index + 1}`}
              key={tool.label}
            >
              <div className={styles.toolPanelCopy}>
                <p>{String(index + 1).padStart(2, "0")}</p>
                <h3>{tool.label}</h3>
                <p>{toolDescription}</p>
              </div>
              <div className={styles.toolPanelMedia}>
                <Image src={tool.image} alt="" fill sizes="(max-width: 767px) 100vw, 620px" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoreFeatures() {
  return (
    <section className={styles.coreSection}>
      <div className={styles.corePanel}>
        <SectionHeading
          eyebrow="Core Features"
          title="What’s inside Salix?"
          description="Businesses choose Salix because it simplifies the complexity of sales management."
        />
        <div className={styles.coreGrid}>
          {coreFeatures.map(([title, description], index) => (
            <article className={styles.coreCard} key={title}>
              <span className={styles.coreCardNumber}>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SalixFeatureSections() {
  return (
    <>
      <PowerPack />
      <KeyTools />
      <CoreFeatures />
    </>
  );
}
