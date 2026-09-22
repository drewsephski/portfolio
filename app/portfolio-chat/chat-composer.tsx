import { ArrowUp, Square } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import type { ChatStatus } from "ai";
import { maxMessageLength } from "@/lib/portfolio-ai/limits";
import styles from "./portfolio-chat.module.css";

interface ChatComposerProps {
  status: ChatStatus;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function ChatComposer({ status, onSend, onStop }: ChatComposerProps) {
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const busy = status === "submitted" || status === "streaming";
  const trimmed = input.trim();

  function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!trimmed || busy) return;
    onSend(trimmed);
    setInput("");
    if (fieldRef.current) fieldRef.current.style.height = "auto";
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
    const field = event.currentTarget;
    setInput(field.value);
    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, 120)}px`;
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <textarea
        ref={fieldRef}
        value={input}
        rows={1}
        maxLength={maxMessageLength}
        placeholder="Ask about his work"
        aria-label="Message"
        autoFocus
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
      {busy ? (
        <button type="button" className={styles.send} aria-label="Stop response" onClick={onStop}>
          <Square aria-hidden="true" />
        </button>
      ) : (
        <button type="submit" className={styles.send} aria-label="Send message" disabled={!trimmed}>
          <ArrowUp aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
