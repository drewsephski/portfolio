"use client";

import { useState } from "react";
import styles from "./features-studio.module.css";

const useCases = [
  {
    label: "Social Campaigns",
    copy: "Generate platform-ready images and short video concepts for launches, ads, reels, and daily content.",
  },
  {
    label: "Product Visuals",
    copy: "Create polished product imagery for launches, landing pages, ads, and social campaigns.",
  },
  {
    label: "Video Storyboards",
    copy: "Turn an idea into clear visual sequences for scenes, camera direction, pacing, and mood.",
  },
  {
    label: "Brand Experiments",
    copy: "Explore new visual directions, styles, colors, and compositions while keeping the brand in view.",
  },
];

const benefits = [
  ["production", "Faster Visual Production", "Create campaign-ready images and clips without waiting on long production cycles."],
  ["brand", "Consistent Brand Looks", "Keep colors, moods, product details, and visual style aligned across every asset."],
  ["control", "Prompt Control", "Shape subject, lighting, motion, camera angle, and composition with clear direction."],
  ["tests", "More Creative Tests", "Explore more concepts, thumbnails, ads, and storyboards before choosing a winner."],
  ["channels", "Ready for Every Channel", "Export visuals for social, ads, landing pages, presentations, and product launches."],
  ["teams", "Built for Teams", "Give marketers, designers, and founders one shared place to create AI visuals."],
] as const;

type BenefitIconName = (typeof benefits)[number][0];

function BenefitIcon({ name }: { name: BenefitIconName }) {
  if (name === "production") {
    return <svg viewBox="0 0 40 40"><path d="M13 7h14M13 33h14M15 8c0 7 1 8 5 12-4 4-5 5-5 12M25 8c0 7-1 8-5 12 4 4 5 5 5 12" /><path className={styles.iconAccent} d="m17 29 3-3 3 3" /></svg>;
  }
  if (name === "brand") {
    return <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="10" /><circle className={styles.iconOrbit} cx="20" cy="7" r="2.5" /><path className={styles.iconAccent} d="M15.5 20a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Z" /></svg>;
  }
  if (name === "control") {
    return <svg viewBox="0 0 40 40"><path d="M8 11h24M8 20h24M8 29h24" /><circle className={styles.sliderOne} cx="15" cy="11" r="3" /><circle className={styles.sliderTwo} cx="26" cy="20" r="3" /><circle className={styles.sliderThree} cx="18" cy="29" r="3" /></svg>;
  }
  if (name === "tests") {
    return <svg viewBox="0 0 40 40"><rect className={styles.testBack} x="9" y="10" width="19" height="20" rx="3" /><rect className={styles.testFront} x="13" y="7" width="19" height="20" rx="3" /><path className={styles.iconAccent} d="m18 17 3 3 6-7" /></svg>;
  }
  if (name === "channels") {
    return <svg viewBox="0 0 40 40"><circle className={styles.channelCore} cx="20" cy="20" r="4" /><circle cx="9" cy="10" r="3" /><circle cx="31" cy="10" r="3" /><circle cx="9" cy="30" r="3" /><circle cx="31" cy="30" r="3" /><path d="m17 17-6-5m12 5 6-5m-12 11-6 5m12-5 6 5" /></svg>;
  }
  return <svg viewBox="0 0 40 40"><circle className={styles.teamLead} cx="20" cy="13" r="4" /><circle className={styles.teamLeft} cx="11" cy="20" r="3" /><circle className={styles.teamRight} cx="29" cy="20" r="3" /><path d="M12 31c1-5 4-7 8-7s7 2 8 7M5 30c.7-3.7 2.7-5.7 6-5.7M35 30c-.7-3.7-2.7-5.7-6-5.7" /></svg>;
}

function Heading({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <header className={styles.heading}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2>{children}</h2>
    </header>
  );
}

export function FeaturesStudio() {
  const [activeUseCase, setActiveUseCase] = useState(0);

  return (
    <div className={styles.studio}>
      <section className={`${styles.section} ${styles.features}`} id="features">
        <Heading eyebrow="Introducing DreamMotion">
          Generate, edit, animate, and export brand-ready visuals.
        </Heading>

        <div className={styles.featureGrid}>
          <article className={`${styles.card} ${styles.imageGenerator}`}>
            <h3>AI Image Generator</h3>
            <p>Turn a prompt into polished images, product shots, scenes, and campaign visuals.</p>
            <div className={styles.prompt}><span aria-hidden="true">✣</span><span>Make it Anime</span><i /></div>
          </article>
          <article className={`${styles.card} ${styles.videoGenerator}`}>
            <h3>Cinematic Video Generator</h3>
            <p>Create short AI videos with motion, mood, camera direction, and visual continuity.</p>
            <img src="/dreammotion/assets/979c779ecd0551cc.png" alt="Cinematic AI video frames" />
          </article>
          <article className={`${styles.card} ${styles.models}`}>
            <h3>All Models, One Studio</h3>
            <p>Access leading image and video generation workflows from one clean workspace.</p>
            <img src="/dreammotion/assets/027b5148bd3195b1.png" alt="Red tree generated in DreamMotion" />
          </article>
          <article className={`${styles.card} ${styles.presets}`}>
            <h3>Style Presets</h3>
            <p>Move from photoreal to anime, editorial, product, 3D, or surreal looks in seconds.</p>
            <div className={styles.waveform} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          </article>
          <article className={`${styles.card} ${styles.keyframes}`}>
            <h3>Keyframe Control</h3>
            <p>Guide scenes with reference frames, camera cues, pacing, and visual direction.</p>
            <img src="/dreammotion/assets/98f9d314ae8b9f45.png" alt="Start and end frame controls" />
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.useCases}`} aria-labelledby="use-cases-title">
        <Heading eyebrow="Use cases">
          <span id="use-cases-title">Explore every visual direction with one AI studio.</span>
        </Heading>
        <div className={styles.useCasePanel}>
          <div className={styles.useCaseCopy}>
            <div className={styles.tabs} role="tablist" aria-label="DreamMotion use cases">
              {useCases.map((item, index) => (
                <button
                  className={index === activeUseCase ? styles.activeTab : undefined}
                  key={item.label}
                  onClick={() => setActiveUseCase(index)}
                  role="tab"
                  aria-selected={index === activeUseCase}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
                </button>
              ))}
            </div>
            <p className={styles.activeCopy} role="tabpanel" key={activeUseCase}>{useCases[activeUseCase].copy}</p>
          </div>
          <div className={styles.useCaseArt}>
            <img className={styles.artFrame} src="/dreammotion/assets/4b66c8d1da7317e6.png" alt="DreamMotion visual creation workspace" />
            <img className={styles.artForeground} src="/dreammotion/assets/4d341371792bdb06.png" alt="Generated campaign visual" />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.benefits}`} id="benefits">
        <Heading eyebrow="Benefits">
          Faster production, sharper concepts, and campaign assets ready in minutes.
        </Heading>
        <div className={styles.benefitGrid}>
          {benefits.map(([icon, title, copy]) => (
            <article className={styles.benefitCard} key={title}>
              <span className={styles.benefitIcon} aria-hidden="true"><BenefitIcon name={icon} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FeaturesStudio;
