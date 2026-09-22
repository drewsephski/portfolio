"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ChatStatus, UIMessage } from "ai";
import { usePathname } from "next/navigation";
import { ChatComposer } from "./chat-composer";
import { ChatMessage } from "./chat-message";
import { SuggestedPrompts } from "./suggested-prompts";
import styles from "./portfolio-chat.module.css";

interface ChatPanelProps {
  open: boolean;
  messages: UIMessage[];
  status: ChatStatus;
  error: Error | undefined;
  onClose: () => void;
  onSend: (text: string) => void;
  onStop: () => void;
  onRetry: () => void;
  onClear: () => void;
  onExitComplete: () => void;
}

function textFromMessage(message: UIMessage | undefined) {
  if (!message) return "";
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function precedingUserText(messages: UIMessage[], index: number) {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const message = messages[cursor];
    if (message?.role === "user") return textFromMessage(message);
  }
  return "";
}

export function ChatPanel({
  open,
  messages,
  status,
  error,
  onClose,
  onSend,
  onStop,
  onRetry,
  onClear,
  onExitComplete,
}: ChatPanelProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (status === "submitted") stickToBottom.current = true;
  }, [status]);

  useEffect(() => {
    if (!open || !stickToBottom.current) return;
    const log = logRef.current;
    if (!log) return;
    log.scrollTo({
      top: log.scrollHeight,
      behavior: reducedMotion || status === "streaming" ? "auto" : "smooth",
    });
  }, [open, messages, status, error, reducedMotion]);

  function handleLogScroll() {
    const log = logRef.current;
    if (!log) return;
    stickToBottom.current = log.scrollHeight - log.scrollTop - log.clientHeight < 64;
  }

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (!panelRef.current?.contains(document.activeElement)) return;
      event.preventDefault();
      onClose();
    }

    function handlePointerDown(event: PointerEvent) {
      if (!(event.target instanceof Node) || panelRef.current?.contains(event.target)) return;
      onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, onClose]);

  function handleSectionNavigate() {
    if (narrow) onClose();
  }

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open ? (
    <motion.div
      key="portfolio-chat-panel"
      ref={panelRef}
      id="portfolio-chat-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="portfolio-chat-title"
      className={styles.panel}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 8 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Portfolio</p>
          <h2 id="portfolio-chat-title" className={styles.title}>
            Drew&apos;s AI
          </h2>
        </div>
        <div className={styles.headerActions}>
          {messages.length > 0 ? (
            <button type="button" className={styles.clear} onClick={onClear}>
              Clear chat
            </button>
          ) : null}
          <button type="button" className={styles.close} aria-label="Close chat" onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </div>
      </header>
      <div ref={logRef} className={styles.log} onScroll={handleLogScroll}>
        {messages.length === 0 ? (
          <div>
            <p className={styles.intro}>
              Hey — I&apos;m Drew&apos;s AI. Ask me about his projects, skills, experience, or what he&apos;s working on.
            </p>
            <SuggestedPrompts onSelect={onSend} />
          </div>
        ) : null}
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            userText={message.role === "assistant" ? precedingUserText(messages, index) : ""}
            streaming={status === "streaming" && index === messages.length - 1 && message.role === "assistant"}
            pathname={pathname}
            onSectionNavigate={handleSectionNavigate}
          />
        ))}
        {status === "submitted" ? (
          <p className={styles.pending} aria-live="polite">
            <span className={styles.srOnly}>Answering</span>
            <span className={styles.cursor} aria-hidden="true" />
          </p>
        ) : null}
        {error ? (
          <div className={styles.error} role="alert">
            <p>I couldn&apos;t answer that just now. Try again in a moment.</p>
            <button type="button" className={styles.retry} onClick={onRetry}>
              Retry
            </button>
          </div>
        ) : null}
      </div>
      <ChatComposer status={status} onSend={onSend} onStop={onStop} />
    </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
