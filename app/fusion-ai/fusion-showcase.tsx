"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const trustedCompanies = ["Webflow", "Dropbox", "Notion", "Slack", "Intercom"];

const features = [
  {
    title: "Seamless Integrations",
    description: "Integrate Slack, HubSpot, Zendesk & more—automate data flow instantly.",
    image: "/fusionai/4a4a5ca512fa70f6.png",
    width: 512,
    height: 378,
    alt: "Fusion AI integrations arranged around the Fusion logo",
  },
  {
    title: "Conversational Actions",
    description: "Create records, assign tasks & queue emails with a simple prompt in seconds flat.",
    image: "/fusionai/a469097571b5dd96.png",
    width: 1024,
    height: 543,
    alt: "Fusion AI conversational action interface",
  },
  {
    title: "Visual Workflow Designer",
    description: "Drag & drop AI actions to build workflows visually— no coding required.",
    image: "/fusionai/f4f2ef48a5d7ea52.png",
    width: 1024,
    height: 482,
    alt: "Fusion AI visual workflow designer",
  },
  {
    title: "Multi-Channel Automation",
    description: "Trigger email, SMS & chat messages automatically on schedule.",
    image: "/fusionai/457f92aac3436f5f.png",
    width: 512,
    height: 457,
    alt: "Fusion AI multi-channel automation interface",
  },
];

const industries = [
  {
    name: "Customer Support",
    image: "/fusionai/industries/customer-support.png",
  },
  {
    name: "Healthcare",
    image: "/fusionai/industries/healthcare.png",
  },
  {
    name: "Marketing",
    image: "/fusionai/industries/marketing.png",
  },
  {
    name: "Education",
    image: "/fusionai/industries/education.png",
  },
  {
    name: "Finance",
    image: "/fusionai/industries/finance.png",
  },
];

const conversation = [
  "Hey, can you generate a customer follow-up list",
  "Done—compiled 60 leads and emailed the list to you. Ready for your outreach!",
  "That’s awesome, thanks!",
  "Want me to draft a quick template for your outreach?",
];

export function FusionShowcase() {
  const [visibleMessages, setVisibleMessages] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => setVisibleMessages((count) => count >= conversation.length ? 1 : count + 1), 1900);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <section className="fusionTrusted" aria-labelledby="fusion-trusted-title">
        <p className="fusionTrustedTitle" id="fusion-trusted-title">
          Trusted by 150,000+ users worldwide
        </p>
        <div className="fusionTrustedRail" aria-label="Trusted companies">
          {trustedCompanies.map((company) => (
            <span className="fusionTrustedCompany" key={company}>{company}</span>
          ))}
        </div>
      </section>

      <section className="fusionFeatures" id="integration" aria-labelledby="fusion-features-title">
        <div className="fusionSectionIntro">
          <p className="fusionSectionEyebrow">AI-Driven Features</p>
          <h2 className="fusionSectionTitle" id="fusion-features-title">
            Build, scale and manage entire AI workforce
          </h2>
          <p className="fusionSectionDescription">
            Fusion AI helps you tackle data bottlenecks, streamline analysis, and make smarter decisions with ease.
          </p>
        </div>

        <div className="fusionBentoGrid">
          {[features.slice(0, 2), features.slice(2, 4)].map((row, rowIndex) => (
            <div className={`fusionBentoRow fusionBentoRow${rowIndex + 1}`} key={rowIndex}>
              {row.map((feature, featureIndex) => {
                const index = rowIndex * 2 + featureIndex;

                return (
                  <article
                    className={`fusionFeatureCard fusionFeatureCard${index + 1}`}
                    key={feature.title}
                  >
                    <div className="fusionFeatureFace">
                      <div className="fusionFeatureVisual">
                        <Image
                          className="fusionFeatureImage"
                          src={feature.image}
                          alt={feature.alt}
                          width={feature.width}
                          height={feature.height}
                          sizes="(max-width: 767px) calc(100vw - 50px), 60vw"
                        />
                      </div>
                      <div className="fusionFeatureCopy">
                        <h3 className="fusionFeatureTitle">{feature.title}</h3>
                        <p className="fusionFeatureDescription">{feature.description}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="fusionChatShowcase" aria-labelledby="fusion-chat-title">
        <div className="fusionAiPoweredTitleRow">
          <Image
            className="fusionAiPoweredOrb"
            src="/fusionai/9d886c3b01f10b4b.png"
            alt=""
            width={127}
            height={127}
          />
          <h2 className="fusionAiPoweredTitle" id="fusion-chat-title">
            AI <span className="fusionAiPoweredGradient">Powered</span>
          </h2>
        </div>

        <div className="fusionDashboardGroup">
          <div className="fusionDashboardPicture">
            <Image
              className="fusionDashboardImage fusionDashboardImageDesktop"
              src="/fusionai/a405fb5d186a4e4b.png"
              alt="Fusion AI workspace dashboard"
              width={2280}
              height={1612}
            />
            <Image
              className="fusionDashboardImage fusionDashboardImageMobile"
              src="/fusionai/chat-showcase-mobile.png"
              alt="Fusion AI workspace dashboard"
              width={2280}
              height={1612}
            />
          </div>

          <div className="fusionConversationOverlay" aria-live="polite">
            <div className="fusionConversationStatus"><span className="fusionLiveDot" /> Agent is working <strong>{Math.round((visibleMessages / conversation.length) * 100)}%</strong></div>
            {conversation.slice(0, visibleMessages).map((message, index) => (
              <p
                className={`fusionConversationMessage fusionConversationMessage${index + 1} fusionConversationMessageVisible`}
                key={message}
              >
                {message}
              </p>
            ))}
            {visibleMessages < conversation.length && <div className="fusionStreamingDots" aria-label="Fusion AI is responding"><i /><i /><i /></div>}
          </div>
        </div>

        <div className="fusionIndustryCards" aria-label="Industries">
          {industries.map((industry) => (
            <article className="fusionIndustryCard" key={industry.name}>
              <Image
                className="fusionIndustryCardImage"
                src={industry.image}
                alt=""
                width={2280}
                height={1612}
              />
              <h3 className="fusionIndustryCardName">{industry.name}</h3>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
