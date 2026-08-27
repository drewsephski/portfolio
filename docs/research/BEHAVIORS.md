# AgentLab Behaviors

- Navigation links use a vertical rolling-text hover transition. On mobile the full link set collapses behind a menu toggle.
- Hero badges and action chips move horizontally in continuous loops; the hero media is an autoplaying, muted, looping video.
- Headline and metric content enters as it reaches the viewport. Implementation: CSS reveal animation with IntersectionObserver at roughly 15% visibility.
- Solution and capabilities mockups are visual demonstrations, not forms or backend-connected tools.
- Testimonial controls are click-driven and switch one testimonial at a time with a fade/slide transition.
- FAQ is click-driven, single-open, with the first answer visible on load; height and opacity animate over 300ms.
- Buttons and bordered cards invert or lift slightly on hover in 200-300ms.
- Desktop switches to stacked layouts below approximately 768px. Mobile section padding is generally 80px 20px; hero is 100px 16px 48px.
- Reduced-motion preference disables continuous marquees, reveals, and animated scrolling.
