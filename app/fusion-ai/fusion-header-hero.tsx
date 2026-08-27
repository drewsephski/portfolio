"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navigation = ["About us", "Pricing", "Integration", "Blog", "Contact"];
const models = ["GPT 5.5", "Claude 4.1", "Gemini 2.5"];
const promptModes = {
  Chat: "Create CRM contact from emails",
  "Launch Workflow": "Launch a lead follow-up workflow",
  "Data Analysis": "Analyze this week’s campaign performance",
} as const;

export function FusionHeaderHero() {
  const [model, setModel] = useState(models[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [prompt, setPrompt] = useState<string>(promptModes.Chat);
  const [activeMode, setActiveMode] = useState<keyof typeof promptModes>("Chat");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">("idle");
  const modelMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: PointerEvent) => {
      if (!modelMenuRef.current?.contains(event.target as Node)) setModelOpen(false);
    };
    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, []);

  const selectMode = (mode: keyof typeof promptModes) => {
    setActiveMode(mode);
    setPrompt(promptModes[mode]);
    setSendState("idle");
  };

  const sendPrompt = () => {
    if (!prompt.trim() || sendState === "sending") return;
    setSendState("sending");
    window.setTimeout(() => setSendState("sent"), 900);
  };

  return (
    <section className="fusionHero" id="about">
      <div className="fusionHeroMedia" aria-hidden="true">
        <video className="fusionHeroVideo" autoPlay loop muted playsInline preload="metadata">
          <source src="/fusionai/fusion-hero-background.mp4" type="video/mp4" />
        </video>
      </div>
      <header className="fusionHeader">
        <Link className="fusionBrand" href="/fusion-ai" aria-label="Fusion AI home">
          <Image
            className="fusionBrandMark"
            src="/fusionai/5be44c708c65e8c7.png"
            alt=""
            width={40}
            height={40}
          />
          <span className="fusionBrandName">Fusion AI</span>
        </Link>

        <nav className="fusionNav" aria-label="Main navigation">
          {navigation.map((item) => (
            <a className="fusionNavLink" href={`#${item.toLowerCase().replace(" ", "-")}`} key={item}>
              {item}
            </a>
          ))}
        </nav>

        <div className="fusionHeaderActions">
          <a className="fusionHeaderWaitlist" href="#waitlist">Waitlist</a>
          <a className="fusionHeaderButton" href="#get-started"><span className="fusionButtonText"><span>Get Started</span><span aria-hidden="true">Get Started</span></span></a>
        </div>

        <button className="fusionMenuButton" type="button" aria-label="Open navigation menu">
          <span className="fusionMenuLine" />
          <span className="fusionMenuLine" />
        </button>
      </header>

      <div className="fusionHeroContent">
        <p className="fusionEyebrow">Supercharge Your AI Workflows</p>
        <h1 className="fusionHeroTitle">Automate Your AI Workflows with AI Agent</h1>
        <p className="fusionHeroDescription">
          Connect your favorite apps, set triggers and watch AI handle the rest - no coding required.
          Get up and running in minutes.
        </p>
        <div className="fusionHeroActions">
          <a className="fusionPrimaryCta" href="#get-started"><span className="fusionButtonText"><span>Get Started - Free</span><span aria-hidden="true">Get Started - Free</span></span></a>
          <a className="fusionSecondaryCta" href="#pricing"><span className="fusionButtonText"><span>View Pricing</span><span aria-hidden="true">View Pricing</span></span></a>
        </div>
      </div>

      <div className="fusionHeroVisual">
        <div className={`fusionPromptComposer fusionPromptComposer${sendState === "sending" ? "Sending" : sendState === "sent" ? "Sent" : ""}`} aria-label="AI workflow prompt example">
          <div className="fusionPromptToolbar">
            <div className="fusionModelPicker" ref={modelMenuRef}>
              <button className="fusionModelSelect" type="button" aria-label="Select AI model" aria-haspopup="listbox" aria-expanded={modelOpen} onClick={() => setModelOpen((open) => !open)}>
                <span className="fusionOpenAiMark" aria-hidden="true">◎</span>
                {model}
                <span className="fusionChevron" aria-hidden="true">⌄</span>
              </button>
              {modelOpen && <div className="fusionModelMenu" role="listbox" aria-label="AI models">
                {models.map((option) => <button className="fusionModelOption" type="button" role="option" aria-selected={model === option} onClick={() => { setModel(option); setModelOpen(false); }} key={option}><span aria-hidden="true">◎</span>{option}{model === option && <span className="fusionModelCheck" aria-hidden="true">✓</span>}</button>)}
              </div>}
            </div>
            <button className="fusionGlobeButton" type="button" aria-label="Browse the web">
              <span aria-hidden="true">◎</span>
            </button>
          </div>
          <label className="fusionPromptText"><span className="fusionSrOnly">Workflow prompt</span><input value={prompt} onChange={(event) => { setPrompt(event.target.value); setSendState("idle"); }} onKeyDown={(event) => { if (event.key === "Enter") sendPrompt(); }} /></label>
          <div className="fusionPromptBottom">
            <div className="fusionPromptModes" aria-label="Workflow modes">
              {(Object.keys(promptModes) as Array<keyof typeof promptModes>).map((mode) => <button className={activeMode === mode ? "fusionPromptModeActive" : ""} type="button" aria-pressed={activeMode === mode} onClick={() => selectMode(mode)} key={mode}>{mode}</button>)}
            </div>
            <button className="fusionSendButton" type="button" onClick={sendPrompt} disabled={!prompt.trim() || sendState === "sending"}>
              <Image src="/fusionai/750873bd76e64677.png" alt="" width={24} height={24} />
              <span>{sendState === "sending" ? "Running" : sendState === "sent" ? "Sent" : "Send"}</span>
            </button>
          </div>
          <div className="fusionPromptProgress" aria-hidden="true"><span /></div>
        </div>
        <div className="fusionHeroDashboardFrame" aria-hidden="true">
          <Image
            className="fusionHeroDashboard"
            src="/fusionai/56fd11be3ac55ac2.png"
            alt=""
            width={2280}
            height={1098}
            priority
          />
        </div>
      </div>
    </section>
  );
}
