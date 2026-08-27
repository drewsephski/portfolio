import Image from "next/image";

import styles from "./agentlab-roi-capabilities.module.css";

const integrations = [
  { name: "Salesforce", src: "/fusionai/integrations/salesforce.svg" },
  { name: "Slack", src: "/fusionai/integrations/slack.svg" },
  { name: "HubSpot", src: "/fusionai/integrations/hubspot.svg" },
  { name: "Notion", src: "/fusionai/integrations/notion.svg" },
  { name: "Gmail", src: "/fusionai/integrations/gmail.svg" },
  { name: "Dropbox", src: "/fusionai/integrations/dropbox.svg" },
  { name: "WhatsApp", src: "/fusionai/integrations/whatsapp.svg" },
] as const;

const models = ["GPT-4o", "Claude", "DALL·E", "ElevenLabs"] as const;

function Eyebrow({ children }: { children: string }) {
  return <p className={styles.eyebrow}><span aria-hidden="true" />{children}</p>;
}

function FlowNode({ label, children }: { label: string; children: string }) {
  return <div className={styles.flowNode}><small>{label}</small><span>{children}</span></div>;
}

export function AgentLabRoiCapabilities() {
  return (
    <>
      <section className={styles.roi}>
        <div className={styles.shell}>
          <Eyebrow>ROI</Eyebrow>
          <h2 className={styles.roiTitle}>Impact You Can Measure</h2>
          <div className={styles.roiGrid}>
            <div className={styles.chartPanel}>
              <div className={styles.metricRow}>
                <div><strong>10x</strong><span>Faster workflow execution</span></div>
                <div><strong>80%</strong><span>Reduction in repetitive tasks</span></div>
              </div>
              <div className={styles.chart} aria-hidden="true">
                <svg viewBox="0 0 600 250" preserveAspectRatio="none">
                  <defs><linearGradient id="agentlab-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3472ff" stopOpacity=".78"/><stop offset="1" stopColor="#eaf1ff" stopOpacity=".08"/></linearGradient></defs>
                  <path d="M0 214 L58 220 L143 170 L240 151 L310 136 L384 73 L445 79 L487 68 L600 0 L600 250 L0 250 Z" fill="url(#agentlab-chart-fill)"/>
                  <path d="M0 214 L58 220 L143 170 L240 151 L310 136 L384 73 L445 79 L487 68 L600 0" fill="none" stroke="#2863ff" strokeWidth="3"/>
                  <path d="M265 144V250M386 73V250M487 68V250" stroke="white" strokeOpacity=".85" strokeWidth="3"/>
                  <rect x="379" y="66" width="14" height="14" fill="#2863ff"/>
                </svg>
              </div>
            </div>
            <div className={styles.copyPanel}>
              <div>
                <h3>Automate your most complex, high-impact multi-step workflows</h3>
                <p>Streamline multi-step processes, reduce manual effort, and improve consistency across your operations with real-time execution and control.</p>
              </div>
              <div className={styles.completion}><strong>90.9%</strong><span>Reliable task completion across workflows</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.capabilities}>
        <div className={styles.shell}>
          <Eyebrow>CAPABILITIES</Eyebrow>
          <h2 className={styles.capabilitiesTitle}>Discover How AI Agents Automate<br className={styles.desktopBreak} /> Real Business Workflows and Deliver<br className={styles.desktopBreak} /> Measurable Results</h2>
          <div className={styles.bento}>
            <article className={styles.card}>
              <div className={styles.dataVisual} aria-hidden="true"><div className={styles.layers}><i/><i/><i/><i/></div><span>Data Layer</span></div>
              <h3>Data Source</h3><p>Pull live data from any source — databases, APIs, or cloud storage — and give your agents a unified, always-current data layer.</p>
            </article>
            <article className={styles.card}>
              <div className={styles.agentVisual} aria-hidden="true">
                <FlowNode label="TRIGGER">Webhook</FlowNode><b/><FlowNode label="PROCESS">Analyze Data</FlowNode><b/><FlowNode label="ACTION">Send Response</FlowNode><em>Ready to deploy</em>
              </div>
              <h3>Visual Agent Build</h3><p>Design and configure AI agents visually — no code needed. Set triggers, define logic, and deploy production-ready agents in minutes.</p>
            </article>
            <article className={styles.card}>
              <div className={styles.workflowVisual} aria-hidden="true"><div>Schedule Weekly report</div><span /></div>
              <h3>Workflow Orchestration</h3><p>Automate multi-step business processes end-to-end. Your agents handle sequencing, error recovery, and handoffs so your team stays focused.</p>
            </article>
            <article className={`${styles.card} ${styles.wideCard}`}>
              <div className={styles.modelVisual} aria-label="Task input routed by AI to GPT-4o, Claude, DALL-E, or ElevenLabs">
                <span className={styles.inputNode}>Task Input</span>
                <i className={styles.inputLine} aria-hidden="true" />
                <strong>AI Router</strong>
                <div className={styles.modelBranches} aria-hidden="true"><i /><i /><i /><i /></div>
                <div className={styles.modelNodes}>{models.map((model) => <span key={model}>{model}</span>)}</div>
              </div>
              <h3>Multi Model AI</h3><p>Route tasks intelligently to the right AI model — GPT, Claude, DALL-E, or ElevenLabs — based on task type and performance goals.</p>
            </article>
            <article className={`${styles.card} ${styles.integrationCard}`}>
              <div className={styles.integrations} aria-label="Integrations with Salesforce, Slack, HubSpot, Notion, Gmail, Dropbox, and WhatsApp">
                {integrations.map((integration) => <span key={integration.name} title={integration.name}><Image src={integration.src} alt={integration.name} width={25} height={25} /></span>)}
              </div>
              <h3>Integration</h3><p>Connect AgentLab to the tools your team already uses — CRMs, support desks, and databases — with native integrations in just clicks.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
