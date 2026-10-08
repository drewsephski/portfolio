export const mobileChatMedia = "(max-width: 700px), (pointer: coarse)";

interface ChatViewport {
  layoutHeight: number;
  visualHeight: number;
  offsetTop: number;
  scale: number;
  restingBottom: number;
}

const panelGap = 12;

/** Fit the open panel inside the visual viewport without changing page layout. */
export function viewportPlacement(viewport: ChatViewport) {
  // Browser accessibility settings can override the requested zoom lock.
  if (Math.abs(viewport.scale - 1) > 0.01) return null;

  const inset = Math.max(0, viewport.layoutHeight - viewport.visualHeight - viewport.offsetTop);
  const bottom = Math.ceil(Math.max(viewport.restingBottom, inset + panelGap));
  const maxHeight = Math.max(0, Math.floor(viewport.layoutHeight - viewport.offsetTop - bottom - panelGap));

  return { bottom, maxHeight };
}
