"use client";

import { Check, Copy, Download, Lock, Terminal, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { marketplaceBySlug, type MarketplaceProduct } from "./catalog";
import { createCheckoutRequestGuard } from "./checkout-request.mjs";
import {
  getPurchasedAgentPrompt,
  getPurchaseSessionId,
  storeVerifiedPurchase,
  subscribeToPurchases,
} from "./purchase-storage";
import styles from "./purchase-dock.module.css";

export function PurchaseDock() {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean)[0] ?? "";
  const product = marketplaceBySlug.get(slug);

  if (!product) return null;

  return <ProductPurchaseDock key={product.slug} product={product} />;
}

function ProductPurchaseDock({ product }: { product: MarketplaceProduct }) {
  const slug = product.slug;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const checkoutRequestRef = useRef<ReturnType<typeof createCheckoutRequestGuard> | null>(null);
  const [dialogView, setDialogView] = useState<"checkout" | "setup">("checkout");
  const purchaseSessionId = useSyncExternalStore(
    subscribeToPurchases,
    () => getPurchaseSessionId(slug),
    () => "",
  );
  const unlocked = Boolean(purchaseSessionId);
  const [checkoutError, setCheckoutError] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);
  const [setupCopied, setSetupCopied] = useState(false);
  const [checkoutPending, setCheckoutPending] = useState(false);

  useEffect(() => {
    return () => checkoutRequestRef.current?.cancel();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const checkoutStatus = searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");

    if (checkoutStatus === "cancelled") {
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    if (checkoutStatus !== "success" || !sessionId || !product) return;

    let cancelled = false;

    void fetch(`/api/purchases/${encodeURIComponent(product.slug)}?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const result = (await response.json()) as { agentPrompt?: string; error?: string };
        if (!response.ok || !result.agentPrompt) throw new Error(result.error ?? "Unable to verify purchase");
        if (cancelled) return;

        storeVerifiedPurchase(product.slug, { sessionId, agentPrompt: result.agentPrompt });
        setDialogView("setup");
        dialogRef.current?.showModal();
        window.history.replaceState({}, "", window.location.pathname);
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        setCheckoutError(error instanceof Error ? error.message : "Unable to verify purchase");
        setDialogView("checkout");
        dialogRef.current?.showModal();
      });

    return () => {
      cancelled = true;
    };
  }, [product]);

  // Deep link from "Buy now" buttons elsewhere on the site: /<slug>?buy=1 opens checkout.
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("buy") !== "1") return;

    window.history.replaceState({}, "", window.location.pathname);
    if (getPurchaseSessionId(product.slug)) return;

    // The dialog starts on the checkout view, so it only needs opening.
    dialogRef.current?.showModal();
  }, [product.slug]);

  const setupCommand = `cd ~/Downloads
unzip ${product.slug}-nextjs.zip
cd ${product.slug}
pnpm install
pnpm dev`;

  const openDialog = (view: "checkout" | "setup") => {
    setCheckoutError("");
    setDialogView(view);
    dialogRef.current?.showModal();
  };

  const copyPrompt = async () => {
    const agentPrompt = getPurchasedAgentPrompt(product.slug);
    if (!agentPrompt) {
      openDialog("checkout");
      return;
    }
    await navigator.clipboard.writeText(agentPrompt);
    setPromptCopied(true);
    window.setTimeout(() => setPromptCopied(false), 1800);
  };

  const purchase = async () => {
    checkoutRequestRef.current?.cancel();
    const requestGuard = createCheckoutRequestGuard(product.slug);
    checkoutRequestRef.current = requestGuard;
    setCheckoutPending(true);
    setCheckoutError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: product.slug }),
        signal: requestGuard.signal,
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Unable to start checkout");
      if (!requestGuard.canRedirect(window.location.pathname)) return;
      window.location.assign(result.url);
    } catch (error) {
      if (requestGuard.signal.aborted) return;
      setCheckoutError(error instanceof Error ? error.message : "Unable to start checkout");
      setCheckoutPending(false);
      setDialogView("checkout");
      dialogRef.current?.showModal();
    } finally {
      if (checkoutRequestRef.current === requestGuard && requestGuard.signal.aborted) {
        checkoutRequestRef.current = null;
      }
    }
  };

  const copySetupCommand = async () => {
    await navigator.clipboard.writeText(setupCommand);
    setSetupCopied(true);
    window.setTimeout(() => setSetupCopied(false), 1800);
  };

  return (
    <>
      <aside className={styles.dock} aria-label={`${product.name} purchase options`}>
        <div className={styles.identity}><span className={styles.name}>{product.name}</span><span className={styles.meta}>{unlocked ? "Purchased · Files and prompt unlocked" : `Live demo · Next.js ${product.kind} by Drew Sepeczi`}</span></div>
        <div className={styles.actions}>
          {unlocked ? <>
            <button
              className={`${styles.button} ${styles.copyButton} ${promptCopied ? styles.copied : ""}`}
              type="button"
              onClick={copyPrompt}
              aria-label={promptCopied ? "Agent prompt copied" : "Copy agent prompt"}
            >
              <span className={styles.copyIcon} aria-hidden="true">
                {promptCopied ? <Check /> : <Copy />}
              </span>
              <span>{promptCopied ? "Copied" : "Copy agent prompt"}</span>
            </button>
            <button className={styles.button} type="button" aria-label="Download files" onClick={() => openDialog("setup")}><Download aria-hidden="true" /><span>Download files</span></button>
          </> : <button className={styles.button} type="button" onClick={() => openDialog("checkout")}><Lock aria-hidden="true" /><span>Agent prompt</span></button>}
          {!unlocked ? <button className={`${styles.button} ${styles.buy}`} type="button" onClick={purchase} disabled={checkoutPending}>{checkoutPending ? "Opening checkout…" : `Buy now · $${product.price}`}</button> : null}
        </div>
      </aside>
      <dialog className={styles.dialog} ref={dialogRef} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
        {dialogView === "checkout" ? (
          <div className={styles.dialogBody}>
            <div className={styles.dialogHeader}><div><p>Secure Stripe checkout</p><h2>Get {product.name}</h2></div><button className={styles.close} type="button" aria-label="Close checkout" onClick={() => dialogRef.current?.close()}><X aria-hidden="true" /></button></div>
            <div className={styles.summary}><span>{product.kind === "component" ? "Next.js hero component" : "Complete Next.js template"}</span><span>${product.price}</span></div>
            <ul className={styles.includes}>
              <li><Check aria-hidden="true" />Ready-to-run Next.js source files</li>
              <li><Check aria-hidden="true" />Agent prompt for fast customization</li>
            </ul>
            <p className={styles.note}>One-time purchase. Stripe securely collects payment, then returns you here to download your files.</p>
            {checkoutError ? <p className={styles.note} role="alert">{checkoutError}</p> : null}
            <button className={`${styles.button} ${styles.buy} ${styles.confirm}`} type="button" onClick={purchase} disabled={checkoutPending}>{checkoutPending ? "Opening secure checkout…" : `Continue to checkout · $${product.price}`}</button>
          </div>
        ) : (
          <div className={styles.dialogBody}>
            <div className={styles.dialogHeader}><div><p>Purchase complete</p><h2>Your files are ready</h2></div><button className={styles.close} type="button" aria-label="Close setup directions" onClick={() => dialogRef.current?.close()}><X aria-hidden="true" /></button></div>
            <ol className={styles.steps}>
              <li><span>1</span><div><strong>Download the template</strong><p>Save the ZIP file to your Downloads folder.</p><a className={`${styles.button} ${styles.downloadButton}`} href={`/api/downloads/${product.slug}?session_id=${encodeURIComponent(purchaseSessionId)}`} download><Download aria-hidden="true" />Download {product.name}</a></div></li>
              <li><span>2</span><div><strong>Open Terminal</strong><p>On your Mac, press Command + Space, type “Terminal,” then press Return.</p></div></li>
              <li><span>3</span><div><strong>Paste this command</strong><p>It unzips the files, installs everything, and starts the site.</p><div className={styles.command}><pre>{setupCommand}</pre><button className={setupCopied ? styles.commandCopied : ""} type="button" aria-label={setupCopied ? "Terminal command copied" : "Copy terminal command"} onClick={copySetupCommand}><span className={styles.copyIcon} aria-hidden="true">{setupCopied ? <Check /> : <Copy />}</span>{setupCopied ? "Copied" : "Copy"}</button></div></div></li>
              <li><span><Terminal aria-hidden="true" /></span><div><strong>Open your site</strong><p>When Terminal says it is ready, visit <a href="http://localhost:3000" target="_blank" rel="noreferrer">localhost:3000</a>.</p></div></li>
            </ol>
          </div>
        )}
      </dialog>
    </>
  );
}
