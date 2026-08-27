# Drew Sepeczi — Product Engineering & Interface Marketplace

This site is a living showcase of useful software and distinctive product design. It brings together shipped AI products, developer tools, and full-stack applications alongside a growing marketplace of polished Next.js interface studies and complete website templates.

Rather than presenting static case studies, the site lets visitors experience the work directly: watch real product previews, explore responsive concepts in the browser, and purchase production-ready foundations for their own projects.

## What you can explore

- **Shipped products** — A curated look at active SaaS products, AI workflows, developer tools, APIs, and design systems, each with an animated preview and a link to the live experience.
- **Hero components** — Focused interface studies spanning AI infrastructure, automation, analytics, wellness, and more. Every concept has its own interactive route and is available as a reusable component.
- **Complete templates** — Rich, multi-section Next.js sites for AI, automation, sales, and creative products. These go beyond a single hero to include the storytelling, proof, feature, pricing, FAQ, and conversion patterns a launch-ready site needs.
- **A direct path to collaboration** — The portfolio also introduces Drew's approach to product engineering and offers a simple way to start a conversation about new work.

## Built for more than inspiration

The marketplace is integrated with Stripe Checkout. After a successful purchase, the site verifies the payment and prepares the corresponding implementation package and setup guidance. The result is a gallery that works both as a portfolio and as a practical starting point for teams building their next product experience.

## Technology

- Next.js App Router
- React and TypeScript
- CSS Modules and custom responsive layouts
- Stripe Checkout and signed webhooks
- Vercel deployment

## Local development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

Run the standard project checks with:

```bash
pnpm lint
pnpm build
```

## Stripe marketplace checkout

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_SITE_URL`: the canonical site origin, without a trailing slash.
- `STRIPE_RESTRICTED_KEY`: a live or test restricted key that can create and read Checkout Sessions.
- `STRIPE_WEBHOOK_SECRET`: the signing secret for the matching Stripe webhook endpoint.

The webhook URL is `/api/stripe/webhook`. Subscribe it to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

For local webhook testing, forward Stripe events to the development server:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the webhook signing secret printed by the Stripe CLI only in `.env.local`. Never commit API keys or webhook secrets.
