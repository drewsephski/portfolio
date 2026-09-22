import { suggestedPrompts } from "@/lib/portfolio/content";
import styles from "./portfolio-chat.module.css";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className={styles.suggestions}>
      {suggestedPrompts.map((prompt) => (
        <button key={prompt} type="button" className={styles.suggestion} onClick={() => onSelect(prompt)}>
          {prompt}
        </button>
      ))}
    </div>
  );
}
