"use client";

import { useEffect, useRef } from "react";

export function InfranexLottie({ src, className }: { src: string; className?: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;
    let animation: import("lottie-web").AnimationItem | undefined;

    Promise.all([import("lottie-web"), fetch(src).then((response) => response.json())]).then(
      ([module, animationData]) => {
        if (cancelled) return;
        animation = module.default.loadAnimation({
          container: element,
          renderer: "svg",
          loop: true,
          autoplay: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          animationData,
        });
      },
    );

    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [src]);

  return <div ref={container} className={className} aria-hidden="true" />;
}
