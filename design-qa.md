# Design QA

**Comparison target**

- Source visual truth: `output/design-qa/source-desktop.png` — live `drewsepeczi.xyz` portfolio captured at a 1440 × 1000 requested browser viewport (1265 × 1252 output pixels, density 1).
- Implementation: `output/design-qa/implementation-desktop.png` — local Pontail homepage captured at the matching requested viewport (1265 × 3137 output pixels, density 1).
- Responsive evidence: `output/design-qa/implementation-mobile.png` — local homepage at a 390 × 844 requested viewport (375 × 3491 output pixels, density 1).
- Combined comparison: `output/design-qa/source-vs-implementation.png`.
- State: dark theme, homepage, no hover, signed-out public view.

**Full-view comparison evidence**

The combined image confirms that the implementation preserves the source portfolio’s black canvas, restrained neutral palette, direct biographical positioning, real product names and descriptions, and text-first tone. It intentionally expands the information hierarchy: real products become the primary editorial grid while the existing Pontail landing pages become a secondary interface-studies archive. This is an integration/redesign, so the added scale and page length are expected rather than fidelity drift.

**Focused region comparison evidence**

The hero, product grid, interface-study rows, footer, and mobile stack were inspected at readable scale. A separate dialog-state capture confirmed that the first project preview opens, presents the correct image and close control, and closes successfully. No additional crops were needed because typography, rules, metadata, and image treatment remained readable in the full-resolution captures.

**Required fidelity surfaces**

- Fonts and typography: neutral sans-serif family and compact utility labels remain consistent with the source; display scale creates a clearer premium hierarchy without introducing a competing visual style.
- Spacing and layout rhythm: desktop grid, section intervals, rule alignment, and mobile single-column stack are consistent and free of visible overflow.
- Colors and visual tokens: near-black background, off-white foreground, and subdued gray metadata maintain the source’s restrained contrast system.
- Image quality and assets: existing real landing-page screenshots remain local and unchanged. Product cards now use six project-local, ImageGen-authored transparent WebP interiors with truthful product metaphors, responsive crops, and a shared graphite, off-white, and acid-lime material system.
- Copy and content: the six live products and their roles are accurately integrated from the source; the hero clearly states Drew’s product-engineering focus.

**Findings**

- No actionable P0, P1, or P2 findings.

**Open Questions**

- None blocking. Future case-study pages could add outcomes and technical decisions once verified project-specific material is available.

**Implementation Checklist**

- [x] Real products lead the portfolio.
- [x] Existing landing pages remain available as secondary studies.
- [x] Desktop and mobile layouts verified.
- [x] Primary preview dialog interaction verified.
- [x] Browser console checked; dialog image loading warning corrected.

**Comparison history**

- Initial comparison: no P0/P1/P2 visual findings. One non-blocking development warning appeared when the dialog image became the LCP candidate.
- Fix: marked the selected dialog image for eager loading.
- Post-fix evidence: static verification rerun; no visual layout change was required.
- Bento visual refinement: generated one isolated interior per product card, rejected opaque checkerboard outputs, extracted genuine alpha, optimized the accepted assets to 99–295 KB WebPs, and verified the integrated grid at 1440 × 1000 and 390 × 844.

**Follow-up Polish**

- P3: Consider replacing generic product-type labels with verified product outcomes when measurable evidence is available.

final result: passed
