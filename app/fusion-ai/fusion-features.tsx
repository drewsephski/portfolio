"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const detailedFeatures = [
  {
    eyebrow: "Feature 01",
    title: "Instant, One-Command Actions",
    description:
      "Type an action once—Fusion AI executes it across Slack, WhatsApp, HubSpot, Calendar, and more.",
    bullets: [
      "Draft & send multi-channel messages",
      "Create CRM contacts on the fly",
      "Cancel meetings or raise issues instantly",
    ],
    image: "/fusionai/70fd4fbd7c7ac0d8.png",
    imageAlt: "Fusion AI one-command action dashboard",
  },
  {
    eyebrow: "Feature 02",
    title: "No-Code Workflow Builder",
    description:
      "Design complex, multi-step automations with drag-and-drop ease—no coding required.",
    bullets: [
      "Visual workflow canvas",
      "Pre-built action blocks",
      "Conditional logic & branching",
    ],
    image: "/fusionai/a6f11924f2f75275.png",
    imageAlt: "Fusion AI visual workflow builder",
  },
  {
    eyebrow: "Feature 03",
    title: "Natural-Language Interaction",
    description:
      "Chat with your AI agents to run tasks, query data, or generate content—just type what you need.",
    bullets: [
      "Context-aware Q&A",
      "Instant task execution",
      "Follow-up action chaining",
    ],
    image: "/fusionai/b0bd6b18bd776e04.png",
    imageAlt: "Fusion AI natural-language assistant",
  },
] as const;

const productFeatures = [
  {
    label: "Workflow",
    description:
      "Drag-and-drop multi-step automations with triggers, AI actions, and rules—built visually in minutes.",
    image: "/fusionai/66d4a144725e490d.png",
    imageAlt: "A visual multi-step workflow in Fusion AI",
  },
  {
    label: "Analytics",
    description:
      "Real-time dashboards surface trends, bottlenecks, and ROI at a glance—for faster decisions.",
    image: "/fusionai/b5f0052875825181.png",
    imageAlt: "Fusion AI analytics dashboard",
  },
  {
    label: "Integration",
    description:
      "One-click connectors and an open API sync CRM, chat, calendar, and more—everything stays in sync.",
    image: "/fusionai/d9fb45de16e7dbb2.png",
    imageAlt: "Fusion AI integration connectors",
  },
] as const;

export function FusionDetailedFeatures() {
  return (
    <section className="fusionDetailedFeatures" aria-labelledby="fusion-features-title">
      <header className="fusionDetailedHeader">
        <p className="fusionDetailedEyebrow">AI-Driven Features</p>
        <h2 className="fusionDetailedTitle" id="fusion-features-title">
          Build, scale and manage entire AI workforce
        </h2>
        <p className="fusionDetailedIntro">
          Fusion AI helps you tackle data bottlenecks, streamline analysis, and make
          smarter decisions with ease.
        </p>
      </header>

      <div className="fusionDetailedRows">
        {detailedFeatures.map((feature, index) => (
          <article
            className={`fusionDetailedRow ${index % 2 === 1 ? "fusionDetailedRowReverse" : ""}`}
            key={feature.title}
          >
            <div className="fusionDetailedCopy">
              <p className="fusionDetailedNumber">{feature.eyebrow}</p>
              <h3 className="fusionDetailedRowTitle">{feature.title}</h3>
              <p className="fusionDetailedDescription">{feature.description}</p>
              <ul className="fusionDetailedList">
                {feature.bullets.map((bullet) => (
                  <li className="fusionDetailedListItem" key={bullet}>
                    <span className="fusionDetailedCheck" aria-hidden="true">✓</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="fusionDetailedVisual">
              <Image
                className="fusionDetailedImage"
                src={feature.image}
                alt={feature.imageAlt}
                width={700}
                height={560}
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FusionProductFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = productFeatures[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % productFeatures.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="fusionProductFeatures" aria-labelledby="fusion-product-title">
      <header className="fusionProductHeader">
        <p className="fusionProductEyebrow">PRODUCT FEATURES</p>
        <h2 className="fusionProductTitle" id="fusion-product-title">
          Build workflows, track insights, connect tools.
        </h2>
      </header>

      <div
        className="fusionProductFrame"
        id="fusion-product-preview"
        role="tabpanel"
        aria-live="polite"
      >
        <Image
          className="fusionProductImage"
          src={activeFeature.image}
          alt={activeFeature.imageAlt}
          width={1240}
          height={712}
          sizes="(max-width: 767px) 100vw, 1240px"
          priority={activeIndex === 0}
        />
      </div>

      <div className="fusionProductTabs" role="tablist" aria-label="Product capabilities">
        {productFeatures.map((feature, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              className={`fusionProductTab ${isActive ? "fusionProductTabActive" : ""}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="fusion-product-preview"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              key={feature.label}
            >
              <span className="fusionProductTabLabel">{feature.label}</span>
              <span className="fusionProductTabDescription">{feature.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function FusionFeatures() {
  return (
    <>
      <FusionDetailedFeatures />
      <FusionProductFeatures />
    </>
  );
}
