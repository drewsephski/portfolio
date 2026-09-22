"use client";

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes, MouseEvent } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SparklesIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SparklesIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const sparkleVariants: Variants = {
  initial: {
    y: 0,
    fill: "none",
  },
  hover: {
    y: [0, -1, 0, 0],
    fill: "currentColor",
    transition: {
      duration: 1,
      times: [0, 0.2, 0.45, 1],
      ease: "easeInOut",
    },
  },
};

const starVariants: Variants = {
  initial: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  blink: {
    opacity: [0, 1, 0, 0, 0, 0, 1],
    transition: {
      duration: 2,
      times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
      ease: "easeInOut",
    },
  },
};

const SparklesIcon = forwardRef<SparklesIconHandle, SparklesIconProps>(function SparklesIcon(
  { onMouseEnter, onMouseLeave, className, size = 28, ...props },
  ref,
) {
  const starControls = useAnimation();
  const sparkleControls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation() {
        void sparkleControls.start("hover");
        void starControls.start("blink");
      },
      stopAnimation() {
        void sparkleControls.start("initial");
        void starControls.start("initial");
      },
    };
  });

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(event);
        return;
      }

      void sparkleControls.start("hover");
      void starControls.start("blink");
    },
    [onMouseEnter, sparkleControls, starControls],
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(event);
        return;
      }

      void sparkleControls.start("initial");
      void starControls.start("initial");
    },
    [onMouseLeave, sparkleControls, starControls],
  );

  return (
    <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      <svg
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.path
          animate={sparkleControls}
          d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
          variants={sparkleVariants}
        />
        <motion.path animate={starControls} d="M20 3v4" variants={starVariants} />
        <motion.path animate={starControls} d="M22 5h-4" variants={starVariants} />
        <motion.path animate={starControls} d="M4 17v2" variants={starVariants} />
        <motion.path animate={starControls} d="M5 18H3" variants={starVariants} />
      </svg>
    </div>
  );
});

export { SparklesIcon };
