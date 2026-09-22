"use client";

import { useReducedMotion } from "framer-motion";
import { useRef, type ButtonHTMLAttributes, type PointerEvent, type RefObject } from "react";
import { SparklesIcon, type SparklesIconHandle } from "@/components/icons/sparkles";
import styles from "./portfolio-chat.module.css";

interface SparklesButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonRef?: RefObject<HTMLButtonElement | null>;
}

export function SparklesButton({
  buttonRef,
  className,
  children,
  onClick,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: SparklesButtonProps) {
  const iconRef = useRef<SparklesIconHandle>(null);
  const reducedMotion = useReducedMotion();

  function play() {
    if (reducedMotion) return;
    iconRef.current?.startAnimation();
  }

  function rest() {
    iconRef.current?.stopAnimation();
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    play();
    onPointerDown?.(event);
  }

  return (
    <button
      {...props}
      ref={buttonRef}
      type="button"
      className={className}
      onMouseEnter={(event) => {
        play();
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        rest();
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        play();
        onFocus?.(event);
      }}
      onBlur={(event) => {
        rest();
        onBlur?.(event);
      }}
      onPointerDown={handlePointerDown}
      onClick={(event) => {
        play();
        onClick?.(event);
      }}
    >
      <SparklesIcon ref={iconRef} size={14} className={styles.sparkles} />
      {children}
    </button>
  );
}
