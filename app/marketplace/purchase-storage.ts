const STORAGE_KEY = "pontail-marketplace-purchases-v2";
const PURCHASE_EVENT = "pontail-marketplace-purchase";

type StoredPurchase = {
  sessionId: string;
  agentPrompt: string;
};

function getPurchases(): Record<string, StoredPurchase> {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, StoredPurchase>;
  } catch {
    return {};
  }
}

export function getPurchaseSessionId(slug: string) {
  return getPurchases()[slug]?.sessionId ?? "";
}

export function getPurchasedAgentPrompt(slug: string) {
  return getPurchases()[slug]?.agentPrompt ?? "";
}

export function storeVerifiedPurchase(slug: string, purchase: StoredPurchase) {
  const purchases = getPurchases();
  purchases[slug] = purchase;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
  window.dispatchEvent(new Event(PURCHASE_EVENT));
}

export function subscribeToPurchases(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PURCHASE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PURCHASE_EVENT, onStoreChange);
  };
}
