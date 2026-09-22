"use client";

import Image from "next/image";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import homeStyles from "./home.module.css";
import styles from "./featured-apps.module.css";

type FeaturedApp = {
  name: string;
  domain: string;
  category: string;
  description: string;
  slug: string;
  capture: string;
};

const apps: readonly FeaturedApp[] = [
  {
    name: "Menace UI",
    domain: "menaceui.com",
    category: "Components & templates",
    description: "Source-ready React interfaces with thoughtful motion, clear hierarchy, and the details that make a product feel finished.",
    slug: "menace-ui",
    capture: "menace-ui-20260907-smooth",
  },
  {
    name: "Menace Voice",
    domain: "voice.menaceui.com",
    category: "Voice AI platform",
    description: "Turn a brief into a voice agent. Shape the conversation, connect your tools, and bring it together in a visual workflow.",
    slug: "menace-voice",
    capture: "menace-voice-20260907-smooth",
  },
  {
    name: "Squid Agent",
    domain: "squidagent.app",
    category: "Developer tool",
    description: "Turn prompts, screenshots, and live sites into React prototypes with revision evidence.",
    slug: "squid-agent",
    capture: "squid-agent-20260824",
  },
  {
    name: "Elsewhere",
    domain: "elsewhere-alpha-web.fly.dev",
    category: "Agent workspace",
    description: "Give AI workers their own computers, memory, routines, and approvals that keep working when you close the laptop.",
    slug: "elsewhere",
    capture: "elsewhere-20260922",
  },
] as const;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export function FeaturedApps() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playing, setPlaying] = useState<Record<string, boolean>>({});
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => false);

  useEffect(() => {
    if (!reducedMotion) return;
    videoRefs.current.forEach((video) => video?.pause());
  }, [reducedMotion]);

  const togglePreview = (index: number, slug: string) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      void video.play().catch(() => setPlaying((current) => ({ ...current, [slug]: false })));
    } else {
      video.pause();
    }
  };

  return (
    <section id="featured-projects" className={styles.section} aria-labelledby="featured-projects-title">
      <div className={`${homeStyles.sectionHeader} ${styles.header}`}>
        <h2 id="featured-projects-title">Featured projects</h2>
      </div>
      <div className={styles.grid}>
        {apps.map((app, index) => {
          const isPlaying = playing[app.slug] ?? false;

          return (
            <article className={styles.card} key={app.slug}>
              <a className={styles.link} href={`https://${app.domain}`} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${app.name} (opens in a new tab)`}>
                <div className={styles.stage} data-project={app.slug}>
                  <div className={styles.browser}>
                    <div className={styles.toolbar} aria-hidden="true">
                      <span className={styles.dots}><i /><i /><i /></span>
                      <span>{app.domain}</span>
                      <ArrowUpRight />
                    </div>
                    <div className={styles.media} data-preview-media data-reduced-motion={reducedMotion}>
                      <Image src={`/assets/product-previews/${app.capture}-poster.jpg`} alt="" fill sizes="(max-width: 700px) calc(100vw - 72px), 520px" />
                      <video
                        ref={(video) => { videoRefs.current[index] = video; }}
                        poster={`/assets/product-previews/${app.capture}-poster.jpg`}
                        muted
                        playsInline
                        loop
                        preload={reducedMotion ? "none" : "metadata"}
                        aria-hidden="true"
                        tabIndex={-1}
                        onPlay={(event) => {
                          event.currentTarget.dataset.playing = "true";
                          setPlaying((current) => ({ ...current, [app.slug]: true }));
                        }}
                        onPause={(event) => {
                          event.currentTarget.dataset.playing = "false";
                          setPlaying((current) => ({ ...current, [app.slug]: false }));
                        }}
                      >
                        <source src={`/assets/product-previews/${app.capture}.mp4`} type="video/mp4" />
                        <source src={`/assets/product-previews/${app.capture}.webm`} type="video/webm" />
                      </video>
                    </div>
                  </div>
                </div>
                <div className={styles.title}><h3>{app.name}</h3><ArrowUpRight aria-hidden="true" /></div>
              </a>
              <div className={styles.cardMeta}>
                <p className={styles.category}>{app.category}</p>
                <button type="button" className={styles.playback} onClick={() => togglePreview(index, app.slug)} aria-label={`${isPlaying ? "Pause" : "Play"} ${app.name} preview`} aria-pressed={isPlaying}>
                  {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                  {isPlaying ? "Pause preview" : "Play preview"}
                </button>
              </div>
              <p className={styles.description}>{app.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
