# AgentLabRoiCapabilities Specification

## Overview
- Target file: `app/agentlab/agentlab-roi-capabilities.tsx`
- Screenshot: desktop part 02.
- Interaction model: scroll counters and continuous chip marquees.

## Exact geometry
- ROI: y 5194.58px, height 1019.11px desktop; 1030.31px mobile, padding 80px 20px.
- Capabilities: y 6213.69px, height 1711.89px desktop; 3060.31px mobile, padding 80px 20px.
- ROI content: “Impact You Can Measure”, 10x faster workflow execution, 80% reduction in repetitive tasks, 90.9% reliable task completion.
- Capabilities heading and five cards: Data Layer, Visual Agent Build, Workflow Orchestration, Multi Model AI, Integration. Preserve source descriptions and diagram labels.

## Styles and behavior
- ROI is white with a large electric-blue gradient visual (`#0036fa` to `#c0e2f9`).
- Capability cards use 1px neutral borders, no rounded SaaS-card styling, mixed white/black panels.
- Desktop bento layout; single-column mobile. Marquee chips translate linearly and stop under reduced motion.
