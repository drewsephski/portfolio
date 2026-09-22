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
} & (
  | { capture: string; poster?: never }
  | { capture?: never; poster: string }
);

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
    poster: "elsewhere-20260922",
  },
] as const;

const hoverQuery = "(hover: hover) and (pointer: fine)";

function subscribeToHover(onChange: () => void) {
  const query = window.matchMedia(hoverQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getHoverSnapshot() {
  return window.matchMedia(hoverQuery).matches;
}

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
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playback, setPlayback] = useState<"auto" | "playing" | "paused">("auto");
  const [active, setActive] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const canHover = useSyncExternalStore(subscribeToHover, getHoverSnapshot, () => true);
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => false);

  const selectedIndex = canHover && playback === "auto" ? hovered ?? focused : null;
  const showPlay = playback === "paused" || (canHover && playback === "auto");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      const inView = visible.size > 0;
      setActive(inView);
      if (inView) setHasEntered(true);
    }, { threshold: 0.15 });
    section.querySelectorAll("[data-preview-media]").forEach((media) => observer.observe(media));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const videos = videoRefs.current.filter((video, index): video is HTMLVideoElement => {
      if (!video) return false;
      video.playbackRate = 2;
      if (canHover && playback === "auto" && index !== selectedIndex) {
        video.pause();
        video.dataset.playing = "false";
        if (video.currentTime !== 0) video.currentTime = 0;
        return false;
      }
      return true;
    });
    const stopTogether = () => videos.forEach((video) => video.pause());
    if (videos.length === 0 || !active || playback === "paused" || reducedMotion) {
      stopTogether();
      return;
    }

    let cancelled = false;
    let starting = false;
    const playTogether = () => {
      if (cancelled || starting || document.hidden || !videos.every((video) => video.readyState >= 3)) return;
      if (videos.every((video) => !video.paused)) return;
      const time = Math.min(...videos.map((video) => video.currentTime));
      for (const video of videos) {
        if (Math.abs(video.currentTime - time) > 0.08) video.currentTime = time;
      }
      starting = true;
      void Promise.all(videos.map((video) => video.play()))
        .then(() => {
          if (cancelled) return;
          videos.forEach((video) => { video.dataset.playing = "true"; });
        })
        .catch(() => { if (!cancelled) stopTogether(); })
        .finally(() => { starting = false; });
    };
    const replayTogether = () => {
      stopTogether();
      videos.forEach((video) => { video.currentTime = 0; });
      playTogether();
    };
    const handleVisibility = () => document.hidden ? stopTogether() : playTogether();
    for (const video of videos) {
      video.addEventListener("canplay", playTogether);
      video.addEventListener("waiting", stopTogether);
      video.addEventListener("ended", replayTogether);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    playTogether();
    return () => {
      cancelled = true;
      stopTogether();
      for (const video of videos) {
        video.removeEventListener("canplay", playTogether);
        video.removeEventListener("waiting", stopTogether);
        video.removeEventListener("ended", replayTogether);
      }
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [active, playback, reducedMotion, hasEntered, canHover, selectedIndex]);

  return (
    <section ref={sectionRef} id="featured-projects" className={styles.section} aria-labelledby="featured-projects-title">
      <div className={`${homeStyles.sectionHeader} ${styles.header}`}>
        <h2 id="featured-projects-title">Featured projects</h2>
        <button type="button" className={styles.playback} onClick={() => setPlayback(showPlay ? "playing" : "paused")}>
          {showPlay ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          {showPlay ? "Play previews" : "Pause previews"}
        </button>
      </div>
      <div className={styles.grid}>
        {apps.map((app, index) => (
          <article className={styles.card} key={app.slug} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setFocused(index)} onBlur={() => setFocused(null)}>
            <a className={styles.link} href={`https://${app.domain}`} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${app.name} (opens in a new tab)`}>
              <div className={styles.stage} data-project={app.slug}>
                <div className={styles.browser}>
                  <div className={styles.toolbar} aria-hidden="true">
                    <span className={styles.dots}><i /><i /><i /></span>
                    <span>{app.domain}</span>
                    <ArrowUpRight />
                  </div>
                  <div className={styles.media} data-preview-media data-reduced-motion={reducedMotion}>
                    <Image src={`/assets/product-previews/${app.capture ? `${app.capture}-poster.jpg` : `${app.poster}-poster.png`}`} alt="" fill sizes="(max-width: 700px) calc(100vw - 72px), 520px" />
                    {app.capture && hasEntered && !reducedMotion ? (
                      <video ref={(video) => { videoRefs.current[index] = video; }} poster={`/assets/product-previews/${app.capture}-poster.jpg`} muted playsInline preload="auto" aria-hidden="true" tabIndex={-1}>
                        <source src={`/assets/product-previews/${app.capture}.mp4`} type="video/mp4" />
                        <source src={`/assets/product-previews/${app.capture}.webm`} type="video/webm" />
                      </video>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className={styles.title}><h3>{app.name}</h3><ArrowUpRight aria-hidden="true" /></div>
            </a>
            <p className={styles.category}>{app.category}</p>
            <p className={styles.description}>{app.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
