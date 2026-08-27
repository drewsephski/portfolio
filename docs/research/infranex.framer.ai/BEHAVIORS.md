# Infranex Behaviors

- Interaction sweep: the page uses native vertical scrolling with Framer viewport-entry transforms; no scroll snapping was observed.
- Header: transparent/dark overlay at the top; desktop links are hidden on the 390px layout.
- Ambient visuals: smoky hero field and card backgrounds animate continuously. The clone uses CSS-only drifting radial gradients so it remains self-contained.
- Counters: reveal when the metrics block enters the viewport.
- Feature cards: subtle border/brightness lift on hover; media remains clipped inside rounded cards.
- Integration and testimonial rows: continuous horizontal motion; pause on hover; disabled for `prefers-reduced-motion`.
- Pricing: the center card is visually elevated on desktop; cards stack on mobile.
- FAQ: click-driven native disclosure behavior with one open row by default.
- Buttons/links: white-to-dark gradient surfaces brighten and translate their arrow on hover.
- Responsive: 3- and 4-column grids collapse to one column at mobile. Desktop 100px section padding becomes 60px at 390px. Hero H1 is 54px desktop and exactly 34px/37.4px mobile. Section headings are 40px desktop and exactly 24px/28.8px mobile.
