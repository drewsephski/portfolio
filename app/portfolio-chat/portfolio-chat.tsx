"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { marketplaceBySlug } from "@/app/marketplace/catalog";
import { ChatPanel } from "./chat-panel";
import { ChatTrigger } from "./chat-trigger";
import { portfolioChatOpenEvent } from "./open-portfolio-chat";
import styles from "./portfolio-chat.module.css";

export function PortfolioChat() {
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
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
    triggerRef.current?.focus();
  }, [open, triggerVisible]);

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
    <div className={raised ? `${styles.root} ${styles.raised}` : styles.root}>
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
