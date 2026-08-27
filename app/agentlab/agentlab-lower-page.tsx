"use client";

import { useState } from "react";
import { ArrowIcon, PlusIcon } from "./icons";
import styles from "./agentlab-lower-page.module.css";
import type { FaqItem, Industry, Testimonial } from "./types";

const industries: Industry[] = [
  { icon: "▥", title: "Finance", description: "Automate account inquiries and fraud detection while maintaining SOC 2 compliance" },
  { icon: "▦", title: "Healthcare", description: "Patient scheduling, prescription refills, and care coordination with full HIPAA compliance standards" },
  { icon: "⌑", title: "E-commerce", description: "Handle order tracking, returns processing, and product recommendations at scale during peak seasons" },
  { icon: "▤", title: "Education", description: "Student enrollment support and course recommendations for learning platforms" },
  { icon: "▣", title: "Enterprise", description: "IT helpdesk automation, employee onboarding workflows, and internal request management at scale" },
  { icon: "▧", title: "Insurance", description: "Claims status updates, policy inquiries, and document collection with secure data handling protocols" },
];

const testimonials: Testimonial[] = [
  { headline: "The orchestration layer simplifies complex workflows and makes easier to manage.", metric: "85%", quote: "AgentLab brings much-needed structure to AI automation workflows. The orchestration layer makes complex systems easier to understand, manage efficiently, and scale without breaking.", name: "Colton Pond", role: "Head of Partnership" },
  { headline: "Orchestration simplifies workflows and improves overall system efficiency.", metric: "82%", quote: "AgentFlow brings structure to AI workflows, while its orchestration layer simplifies complexity and improves efficiency, enabling scalable and reliable system performance.", name: "Ethan Walker", role: "CTO" },
  { headline: "Orchestration brings clarity and structure to complex digital workflows.", metric: "79%", quote: "AgentFlow organizes automation workflows effectively, reduces system complexity, and enhances control while supporting smooth, scalable growth.", name: "Sophia Martinez", role: "Product Manager" },
  { headline: "One streamlined workflow system for every connected service.", metric: "88%", quote: "AgentFlow delivers clarity to automation processes and improves coordination, ensuring consistent performance with reliable execution.", name: "Noah Williams", role: "Cloud Engineer" },
];

const faqs: FaqItem[] = [
  { question: "What Exactly Is an AI Agent?", answer: "An AI Agent is more than just a chatbot; it is a system designed to perform tasks autonomously. While a chatbot answers questions, an agent can use tools, browse the web, and execute workflows to achieve a specific goal." },
  { question: "What Tools Can the AI Agent Connect To?", answer: "AI agents can connect to APIs, databases, CRM systems, cloud platforms, messaging apps, and third-party services to expand their capabilities." },
  { question: "How Do we Measure if the AI Agent Is Successful?", answer: "Measure task completion rate, response accuracy, and how often users reach the right result without needing help." },
  { question: "What Metrics Can we Use to Evaluate User Satisfaction?", answer: "Common signals include customer satisfaction scores, Net Promoter Score, direct feedback, and behavioral outcomes." },
  { question: "How Frequently Should we Conduct Performance Reviews of the AI?", answer: "Use continuous monitoring with a structured monthly review of accuracy, task success, and user satisfaction." },
  { question: "How Long Does It Take to Design and Deploy an AI Agent?", answer: "Timing depends on scope, data availability, integration needs, and testing. Planning, iteration, and optimization continue after the initial deployment." },
];

function Eyebrow({ children }: { children: React.ReactNode }) { return <p className={styles.eyebrow}><span />{children}</p>; }

export function AgentLabLowerPage() {
  const [testimonial, setTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const current = testimonials[testimonial];

  return <>
    <section className={styles.industry} id="industry">
      <div className={styles.rail}><Eyebrow>Industry</Eyebrow><h2>Solutions Across Every Sector</h2><div className={styles.industryGrid}>{industries.map((item) => <article key={item.title}><div className={styles.iconTile}>{item.icon}</div><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div>
    </section>
    <section className={styles.testimonials} id="testimonials">
      <div className={styles.rail}><Eyebrow>Testimonials</Eyebrow><div className={styles.sectionLead}><h2>What People Are Saying</h2><a href="#testimonials"><ArrowIcon /> See all case studies</a></div>
        <div className={styles.testimonialCard} key={testimonial}><div className={styles.brandPanel}><span>✦ ZenZap</span></div><div className={styles.testimonialHeadline}><h3>{current.headline}</h3><div><strong>{current.metric}</strong><small>Reduction in manual work</small></div></div><blockquote>“{current.quote}”<footer><b>{current.name}</b><span>{current.role}</span></footer></blockquote></div>
        <div className={styles.carouselControls}><button aria-label="Previous testimonial" onClick={() => setTestimonial((testimonial - 1 + testimonials.length) % testimonials.length)}>←</button><span>{testimonial + 1} / {testimonials.length}</span><button aria-label="Next testimonial" onClick={() => setTestimonial((testimonial + 1) % testimonials.length)}>→</button></div>
      </div>
    </section>
    <section className={styles.compliance}><div className={`${styles.rail} ${styles.complianceGrid}`}><div><Eyebrow>Compliance</Eyebrow><h2>Enterprise-Grade<br />Security Standards</h2><div className={styles.badges}><span>SOC 2</span><span>GDPR</span><span>HIPAA</span></div></div><div className={styles.securityCards}>{[["◉","End-to-End Encryption","All data encrypted in transit and at rest using AES-256"],["♙","Zero Data Retention","Your data is never stored or used for model training"],["▤","Private Deployment","Deploy in your own VPC for complete data sovereignty"]].map(([icon,title,copy])=><article key={title}><i>{icon}</i><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={styles.faq} id="faq"><div className={`${styles.rail} ${styles.faqGrid}`}><div><Eyebrow>FAQs</Eyebrow><h2>Have questions?<br />Find answers.</h2><h4>Have more questions?</h4><p>Reach out to our friendly support team</p><a className={styles.lightButton} href="#faq"><ArrowIcon /> Talk to sales</a></div><div className={styles.accordion}>{faqs.map((item,index)=><article className={openFaq===index?styles.open:""} key={item.question}><button aria-expanded={openFaq===index} onClick={()=>setOpenFaq(openFaq===index?-1:index)}><span>{item.question}</span><PlusIcon /></button><div className={styles.answer}><p>{item.answer}</p></div></article>)}</div></div></section>
    <footer className={styles.footer}><section className={styles.cta}><div className={styles.rail}><h2>Ready to Automate<br />your Workflow?</h2><div><p>Join leading enterprises using AgentLab to scale operations, reduce costs, and deliver results faster than ever before.</p><div className={styles.ctaButtons}><a href="#faq"><ArrowIcon /> Talk to sales</a><a href="#">View pricing</a></div></div></div></section><div className={`${styles.rail} ${styles.footerGrid}`}><div className={styles.footerBrand}><h2>AgentLab</h2><p>Building the future of intelligent automation with AI agents that think, act, and deliver.</p><small>© 2026&nbsp; Design &amp; Developed by Amani Design</small></div>{[["Main","Product","About","Pricing","Case Study","Blog","Contact"],["Useful","Industry","Teams","Career","Changelog","FAQ"],["Others","Privacy Policy","Terms & Conditions","Cookie Policy","Waitlist","404"],["Social","Facebook","LinkedIn","X","Instagram"]].map(([label,...links])=><nav key={label} aria-label={label}><b>{label}</b>{links.map(link=><a key={link} href="#">{link}</a>)}</nav>)}</div></footer>
  </>;
}
