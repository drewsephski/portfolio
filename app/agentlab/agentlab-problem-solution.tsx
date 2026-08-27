import styles from "./agentlab-problem-solution.module.css";

const problems = [
  {
    icon: "⌘",
    title: "No Unified Agent Layer",
    description: "Disconnected tools and data keep teams from building agents on one dependable foundation.",
  },
  {
    icon: "↻",
    title: "Time-Consuming Tasks",
    description: "Manual handoffs and repetitive work slow delivery and leave less time for higher-value decisions.",
  },
  {
    icon: "▦",
    title: "Zero Process Visibility",
    description: "Fragmented systems make it difficult to see progress, diagnose failures, or improve performance.",
  },
] as const;

const features = [
  {
    eyebrow: "AGENT BUILDER",
    title: "Build and Deploy Agents in Minutes",
    description:
      "Design intelligent agents with a visual builder — no coding required. Define triggers, actions, and logic with an intuitive drag-and-drop interface.",
    bullets: ["Visual no-code agent builder", "Pre-built agent templates", "One-click deployment to production"],
    visual: "builder",
  },
  {
    eyebrow: "WORKFLOW AUTOMATION",
    title: "Automate Complex Multi-Step Workflows",
    description:
      "Deploy intelligent AI agents that understand your business context, coordinate complex workflows, and execute tasks with unprecedented precision.",
    bullets: ["Automated workflow orchestration", "Context-aware task execution", "Enterprise-grade reliability"],
    visual: "workflow",
  },
  {
    eyebrow: "ANALYTICS & INSIGHTS",
    title: "Monitor Agent Performance in Real Time",
    description:
      "Track performance metrics, identify bottlenecks, and optimize agent efficiency with real-time analytics.",
    bullets: ["Real-time performance monitoring", "Automated bottleneck detection", "Predictive analytics insights"],
    visual: "analytics",
  },
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className={styles.eyebrow}><span aria-hidden="true" />{children}</p>;
}

function FeatureVisual({ type }: { type: (typeof features)[number]["visual"] }) {
  if (type === "builder") {
    return (
      <div className={`${styles.visual} ${styles.builderVisual}`} aria-label="Visual agent builder preview">
        <div className={styles.builderPanel}>
          <b>SUPPORT AGENT</b>
          <div className={styles.node}>When a request arrives</div>
          <span className={styles.connector} />
          <div className={styles.node}>Draft a helpful response</div>
        </div>
      </div>
    );
  }

  if (type === "workflow") {
    return (
      <div className={`${styles.visual} ${styles.workflowVisual}`} aria-label="Automated workflow preview">
        <div className={styles.workflowPanel}>
          <div className={styles.panelTop}><b>WORKFLOW · RUNNING</b><span>● Lead Enrichment</span></div>
          {["Trigger: New Lead", "Enrich lead data via API", "Score & qualify lead", "Route to sales team", "Log activity to CRM"].map((step, index) => (
            <div className={styles.workflowStep} key={step}><i className={index === 0 ? styles.activeStep : ""} />{step}</div>
          ))}
          <div className={styles.progressLabel}><b>PROGRESS</b><b>20%</b></div>
          <div className={styles.progress}><span /></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.visual} ${styles.analyticsVisual}`} aria-label="Real-time analytics preview">
      <div className={styles.analyticsPanel}>
        <b>ANALYTICS OVERVIEW</b>
        <div className={styles.metrics}><span><strong>1,247</strong>Tasks Today</span><span><strong>98.4%</strong>Success Rate</span><span><strong>1.2s</strong>Avg Duration</span></div>
        <div className={styles.bars}>{[42,63,50,78,55,86,74,91,58,76,83,94].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
        <small>Task volume — last 12 hours</small>
      </div>
    </div>
  );
}

export function AgentLabProblemSolution() {
  return (
    <>
      <section className={styles.problem}>
        <div className={styles.problemInner}>
          <div className={styles.reveal}>
            <Eyebrow>THE PROBLEM</Eyebrow>
            <h2>Most Organizations Operate with Broken Data Pipelines, Siloed Teams, and Outdated Workflows.</h2>
          </div>
          <div className={styles.problemGrid}>
            {problems.map((problem) => (
              <article className={styles.problemCard} key={problem.title}>
                <span className={styles.problemIcon} aria-hidden="true">{problem.icon}</span>
                <div><h3>{problem.title}</h3><p>{problem.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.solution}>
        <div className={styles.solutionInner}>
          <header className={`${styles.solutionHeader} ${styles.reveal}`}>
            <Eyebrow>THE SOLUTION</Eyebrow>
            <h2>Streamline Development, Reduce Errors, and Increase Deployment Speed by 10x with Enterprise-Grade AI Agent Infrastructure</h2>
          </header>
          <div className={styles.features}>
            {features.map((feature, index) => (
              <article className={`${styles.feature} ${index % 2 ? styles.reverse : ""}`} key={feature.eyebrow}>
                <div className={`${styles.featureCopy} ${styles.reveal}`}>
                  <Eyebrow>{feature.eyebrow}</Eyebrow>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <ul>{feature.bullets.map((bullet) => <li key={bullet}><span aria-hidden="true">→</span>{bullet}</li>)}</ul>
                </div>
                <FeatureVisual type={feature.visual} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
