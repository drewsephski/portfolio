export const portfolioChatOpenEvent = "portfolio-chat:open";

export function requestPortfolioChat() {
  window.dispatchEvent(new Event(portfolioChatOpenEvent));
}
