"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useRef, useSyncExternalStore, type CSSProperties } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

type RevealMode = "words" | "letters" | "lines";
type TextAlignment = "left" | "center" | "right";

type ScrollRevealTextProps = {
  children: string;
  className?: string;
  ghostColor?: string;
  ghostOpacity?: number;
  mode?: RevealMode;
  progressTarget?: "self" | "section";
  showGhost?: boolean;
  textAlign?: TextAlignment;
};

function splitText(text: string, mode: RevealMode) {
  if (mode === "letters") return Array.from(text);
  if (mode === "lines") return text.split("\n");
  return text.split(" ");
}

function RevealToken({
  index,
  progress,
  reducedMotion,
  total,
  value,
}: {
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
  total: number;
  value: string;
}) {
  const revealWindow = Math.max(7, Math.ceil(total * 0.18));
  const start = index / Math.max(total - 1 + revealWindow, 1);
  const end = Math.min((index + revealWindow) / Math.max(total - 1 + revealWindow, 1), 1);
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.span
      aria-hidden="true"
      style={reducedMotion ? { opacity: 1 } : { opacity }}
    >
      {value}
    </motion.span>
  );
}

export function ScrollRevealText({
  children,
  className,
  ghostColor = "#f1f1ef",
  ghostOpacity = 0.12,
  mode = "words",
  progressTarget = "self",
  showGhost = true,
  textAlign = "left",
}: ScrollRevealTextProps) {
  const progressTargetRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => false);
  const tokens = splitText(children, mode);
  const separator = mode === "words" ? "\u00a0" : mode === "lines" ? "\n" : "";
  const { scrollYProgress } = useScroll({
    target: progressTargetRef,
    offset: ["start 88%", "end 58%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0005,
  });
  const alignment = { textAlign } satisfies CSSProperties;
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    progressTargetRef.current = progressTarget === "section"
      ? node?.closest("section") ?? node
      : node;
  }, [progressTarget]);

  return (
    <div ref={setContainerRef} className={className} data-mode={mode} style={alignment}>
      <div className="scrollRevealText__stack">
        {showGhost && !prefersReducedMotion ? (
          <p
            aria-hidden="true"
            className="scrollRevealText__ghost"
            style={{ color: ghostColor, opacity: ghostOpacity }}
          >
            {tokens.map((token, index) => (
              <span
                className="scrollRevealText__token"
                data-whitespace={/^\s$/u.test(token) || undefined}
                key={`${token}-ghost-${index}`}
              >
                {token}{separator}
              </span>
            ))}
          </p>
        ) : null}
        <p aria-label={children} className="scrollRevealText__copy">
          {tokens.map((token, index) => (
            <span
              className="scrollRevealText__token"
              data-whitespace={/^\s$/u.test(token) || undefined}
              key={`${token}-${index}`}
            >
              <RevealToken
                index={index}
                progress={smoothProgress}
                reducedMotion={prefersReducedMotion}
                total={tokens.length}
                value={`${token}${separator}`}
              />
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
