"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { marketplaceBySlug } from "@/app/marketplace/catalog";
import { ChatPanel } from "./chat-panel";
import { ChatTrigger } from "./chat-trigger";
import { portfolioChatOpenEvent } from "./open-portfolio-chat";
import { mobileChatMedia, viewportPlacement } from "./viewport-placement";
import styles from "./portfolio-chat.module.css";

export function PortfolioChat() {
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);
  const [open, setOpen] = useState(false);
  const [triggerVisible, setTriggerVisible] = useState(true);
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, setMessages, status, error, stop, regenerate, clearError } = useChat({
    transport,
  });

  useEffect(() => {
    if (open || !restoreFocus.current || !triggerVisible) return;
    restoreFocus.current = false;
    triggerRef.current?.focus({ preventScroll: true });
  }, [open, triggerVisible]);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    const root = rootRef.current;

    const media = window.matchMedia(mobileChatMedia);
    const viewport = window.visualViewport;
    let frame = 0;

    function reset() {
      root.style.removeProperty("bottom");
      root.style.removeProperty("--chat-panel-max-height");
    }

    function place() {
      // Read the CSS resting position, including safe areas and purchase docks.
      reset();
      if (!media.matches) return;
      const current = window.visualViewport;
      const placement = viewportPlacement({
        layoutHeight: document.documentElement.clientHeight,
        visualHeight: current?.height ?? window.innerHeight,
        offsetTop: current?.offsetTop ?? 0,
        scale: current?.scale ?? 1,
        restingBottom: parseFloat(getComputedStyle(root).bottom),
      });
      if (!placement) return;
      root.style.bottom = `${placement.bottom}px`;
      root.style.setProperty("--chat-panel-max-height", `${placement.maxHeight}px`);
    }

    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    }

    place();
    viewport?.addEventListener("resize", schedule);
    viewport?.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);

    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", schedule);
      viewport?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      reset();
    };
  }, [open, pathname]);

  useEffect(() => {
    function handleOpenRequest() {
      setTriggerVisible(false);
      setOpen(true);
    }

    window.addEventListener(portfolioChatOpenEvent, handleOpenRequest);
    return () => window.removeEventListener(portfolioChatOpenEvent, handleOpenRequest);
  }, []);

  if (pathname === "/inbox" || pathname.startsWith("/inbox/")) return null;

  const slug = pathname.split("/").filter(Boolean)[0] ?? "";
  const raised = marketplaceBySlug.has(slug);

  function handleOpen() {
    setTriggerVisible(false);
    setOpen(true);
  }

  function handleClose() {
    restoreFocus.current = true;
    setOpen(false);
  }

  function handleClear() {
    if (status === "submitted" || status === "streaming") stop();
    clearError();
    setMessages([]);
  }

  function handleSend(text: string) {
    if (status === "submitted" || status === "streaming") return;
    void sendMessage({ text }, { body: { page: pathname } });
  }

  return (
    <div ref={rootRef} className={raised ? `${styles.root} ${styles.raised}` : styles.root}>
      <ChatPanel
        open={open}
        messages={messages}
        status={status}
        error={error}
        onClose={handleClose}
        onSend={handleSend}
        onStop={() => stop()}
        onRetry={() => {
          void regenerate({ body: { page: pathname } });
        }}
        onClear={handleClear}
        onExitComplete={() => setTriggerVisible(true)}
      />
      {triggerVisible ? <ChatTrigger buttonRef={triggerRef} onOpen={handleOpen} /> : null}
    </div>
  );
}
