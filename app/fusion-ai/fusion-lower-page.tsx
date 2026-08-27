"use client";

import Image from "next/image";
import { useState } from "react";

const integrations = [
  { name: "Slack", slug: "slack" },
  { name: "Notion", slug: "notion" },
  { name: "HubSpot", slug: "hubspot" },
  { name: "Dropbox", slug: "dropbox" },
  { name: "Salesforce", slug: "salesforce" },
  { name: "WhatsApp", slug: "whatsapp" },
  { name: "Gmail", slug: "gmail" },
] as const;

const testimonials = [
  {
    quote: "Seamless Slack and Salesforce integrations keep our team in sync. Fusion AI ensures everyone’s on the same page.",
    name: "Mat Mursmark",
    role: "Chief Growth Officer",
    image: "/fusionai/6cf5dee736d523fd.png",
  },
  {
    quote: "Fusion AI cut our onboarding time by 50%—setup was effortless, and our AI agents are now core to daily ops.",
    name: "Chris Milkulin",
    role: "Performance Marketer",
    image: "/fusionai/a4102272b4ba6a8d.png",
  },
  {
    quote: "Automating lead follow-ups boosted our conversion rate by 30% without adding headcount. Fusion AI is a game-changer.",
    name: "Audrey Madden",
    role: "Chief Growth Officer",
    image: "/fusionai/c4a4867088cebd64.png",
  },
  {
    quote: "Real-time insights from AI agents help us spot trends before they emerge—our decisions are smarter and faster.",
    name: "Jamal Richardson",
    role: "Head of Analytics",
    image: "/fusionai/2770120a3d19d7fa.png",
  },
  {
    quote: "Fusion AI gives our customers faster answers while keeping every conversation personal, consistent, and on-brand.",
    name: "Priya Desai",
    role: "Customer Success Manager",
    image: "/fusionai/982156c11cd71a90.png",
  },
];

const steps = [
  {
    number: "1.",
    title: "Select a trigger",
    description: "Choose an event or schedule that kicks off your workflow.",
    image: "/fusionai/ce51920d59dede1e.png",
  },
  {
    number: "2.",
    title: "Connect your apps",
    description: "Sync Fusion AI with your tools—CRM, email, Slack, and more.",
    image: "/fusionai/900701dc9db88767.png",
  },
  {
    number: "3.",
    title: "Let AI do the work",
    description: "Lets Fusion AI execute tasks automatically.",
    image: "/fusionai/f5d520067650be91.png",
  },
];

const faqs = [
  {
    question: "What is Fusion AI and how does it work?",
    answer: "Fusion AI is an AI workspace that connects your tools and automates repeatable workflows.",
  },
  {
    question: "Which apps can I integrate?",
    answer: "Fusion AI supports 50+ integrations, including Slack, HubSpot, Zendesk, Salesforce, Google Workspace, WhatsApp, Zapier, and more.",
  },
  {
    question: "How does Fusion AI automate tasks?",
    answer: "Fusion AI uses triggers, connected apps, and AI agents to complete routine tasks automatically from start to finish.",
  },
  {
    question: "Is my data secure with Fusion AI?",
    answer: "Yes. Your data is protected with secure connections and industry-standard safeguards at every step.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "Our team is available to help with setup, integrations, troubleshooting, and workflow optimization.",
  },
];

const footerColumns = [
  { title: "Main Page", links: ["Home", "About", "Pricing", "Blogs", "Contact"] },
  { title: "Quick Links", links: ["Integration", "Teams", "Career", "FAQ", "404"] },
  { title: "Others", links: ["Privacy Policy", "Terms & Condition", "Waitlist", "Changelog"] },
];

export function FusionLowerPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <section className="fusionIntegrations" id="integrations" aria-labelledby="fusion-integrations-title">
        <div className="fusionLowerIntro">
          <p className="fusionLowerEyebrow">POWERFUL INTEGRATIONS</p>
          <h2 className="fusionLowerTitle" id="fusion-integrations-title">Seamlessly Integrate Every App</h2>
          <a className="fusionTextLink" href="#integration">Explore All <span aria-hidden="true">↗</span></a>
        </div>
        <div className="fusionIntegrationRail" aria-label="Supported integrations">
          <div className="fusionIntegrationTrack">
            {[...integrations, ...integrations].map((integration, index) => (
              <div className="fusionIntegrationPill" key={`${integration.slug}-${index}`} aria-hidden={index >= integrations.length}>
                <span className="fusionIntegrationLogo">
                  <Image
                    src={`/fusionai/integrations/${integration.slug}.svg`}
                    alt=""
                    width={36}
                    height={36}
                  />
                </span>
                <span>{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fusionStories" aria-labelledby="fusion-stories-title">
        <Image className="fusionStoriesGlow" src="/fusionai/82bded93c17e8053.png" alt="" fill sizes="100vw" />
        <div className="fusionLowerIntro fusionStoriesIntro">
          <p className="fusionLowerEyebrow">SUCCESS STORIES</p>
          <h2 className="fusionLowerTitle" id="fusion-stories-title">Hear from our customers &amp; their success stories</h2>
        </div>
        <div className="fusionStoryRail">
          <div className="fusionStoryTrack">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <article className="fusionStoryCard" key={`${testimonial.name}-${index}`} aria-hidden={index >= testimonials.length}>
                <p className="fusionStoryQuote">“{testimonial.quote}”</p>
                <footer className="fusionStoryPerson">
                  <Image className="fusionStoryAvatar" src={testimonial.image} alt="" width={52} height={52} />
                  <div><strong>{testimonial.name}</strong><span>{testimonial.role}</span></div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="fusionSteps" aria-labelledby="fusion-steps-title">
        <div className="fusionLowerIntro">
          <p className="fusionLowerEyebrow">AI-Driven Features</p>
          <h2 className="fusionLowerTitle" id="fusion-steps-title">Automate workflows in three simple steps</h2>
        </div>
        <div className="fusionStepGrid">
          {steps.map((step) => (
            <article className="fusionStepCard" key={step.number}>
              <div className="fusionStepImageWrap">
                <Image className="fusionStepImage" src={step.image} alt="" width={430} height={330} />
              </div>
              <div className="fusionStepCopy">
                <span className="fusionStepNumber">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fusionFaq" id="faq" aria-labelledby="fusion-faq-title">
        <div className="fusionFaqIntro">
          <p className="fusionLowerEyebrow">FAQ</p>
          <h2 className="fusionLowerTitle" id="fusion-faq-title">Frequently asked questions</h2>
          <div className="fusionFaqContact">
            <h3>Got any Questions? Let us know!</h3>
            <p>Reach out and our team will get right back to you.</p>
            <a href="#contact">Contact us <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="fusionFaqList">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div className={`fusionFaqItem${isOpen ? " fusionFaqItemOpen" : ""}`} key={faq.question}>
                <button className="fusionFaqButton" type="button" aria-expanded={isOpen} aria-controls={`fusion-faq-answer-${index}`} onClick={() => setOpenFaq(isOpen ? null : index)}>
                  <span>{faq.question}</span><span className="fusionFaqToggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                <div
                  className="fusionFaqAnswer"
                  id={`fusion-faq-answer-${index}`}
                  aria-hidden={!isOpen}
                  inert={!isOpen ? true : undefined}
                >
                  <div><p>{faq.answer}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="fusionFinalCta" id="get-started" aria-labelledby="fusion-cta-title">
        <div className="fusionFinalCtaInner">
          <h2 id="fusion-cta-title">Start Your AI Automation Journey Today</h2>
          <p>Sign up for Fusion AI and let AI handle your routine tasks—no credit card needed.</p>
          <div className="fusionFinalCtaActions">
            <a className="fusionFinalPrimary" href="#waitlist"><span className="fusionButtonText"><span>Get Started - Free</span><span aria-hidden="true">Get Started - Free</span></span></a>
            <a className="fusionFinalSecondary" href="#pricing"><span className="fusionButtonText"><span>View Pricing</span><span aria-hidden="true">View Pricing</span></span></a>
          </div>
        </div>
      </section>

      <footer className="fusionFooter" id="contact">
        <div className="fusionFooterTop">
          <div className="fusionFooterBrand">
            <a className="fusionFooterLogo" href="#top"><Image className="fusionFooterMark" src="/fusionai/5be44c708c65e8c7.png" alt="" width={40} height={40} /><strong>Fusion AI</strong></a>
            <p>Fusion AI and let AI handle your routine tasks.</p>
          </div>
          <nav className="fusionFooterNav" aria-label="Footer navigation">
            {footerColumns.map((column) => (
              <div className="fusionFooterColumn" key={column.title}>
                <h3>{column.title}</h3>
                {column.links.map((link) => <a href={`#${link.toLowerCase().replaceAll(" ", "-")}`} key={link}>{link}</a>)}
              </div>
            ))}
          </nav>
        </div>
        <div className="fusionFooterBottom">
          <p>© 2026 Design &amp; Developed by Amani Design.</p>
          <div className="fusionFooterSocials" aria-label="Social links"><a href="#linkedin" aria-label="LinkedIn">in</a><a href="#x" aria-label="X">𝕏</a><a href="#instagram" aria-label="Instagram">◎</a></div>
        </div>
      </footer>
    </>
  );
}
