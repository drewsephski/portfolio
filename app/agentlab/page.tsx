import { AgentLabHeaderHero } from "./agentlab-header-hero";
import { AgentLabLowerPage } from "./agentlab-lower-page";
import { AgentLabProblemSolution } from "./agentlab-problem-solution";
import { AgentLabRoiCapabilities } from "./agentlab-roi-capabilities";
import styles from "./page.module.css";

export default function AgentLabPage() {
  return <main className={styles.page}><AgentLabHeaderHero /><AgentLabProblemSolution /><AgentLabRoiCapabilities /><AgentLabLowerPage /></main>;
}
