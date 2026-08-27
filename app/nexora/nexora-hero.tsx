"use client";

import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  FileText,
  HandCoins,
  Home,
  Landmark,
  ListTodo,
  MoreHorizontal,
  MoveRight,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  WalletCards,
  Workflow,
} from "lucide-react";
import { Button } from "./button";
import styles from "./nexora.module.css";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4";

const navItems = ["Home", "Pricing", "About", "Contact"] as const;

const sidebarItems = [
  { label: "Home", icon: Home, active: true },
  { label: "Tasks", icon: ListTodo, badge: "10" },
  { label: "Transactions", icon: MoveRight },
  { label: "Payments", icon: CircleDollarSign, chevron: true },
  { label: "Cards", icon: CreditCard },
  { label: "Capital", icon: Landmark },
  { label: "Accounts", icon: WalletCards, chevron: true },
] as const;

const workflowItems = [
  { label: "Trake rutes", icon: Workflow },
  { label: "Payments", icon: HandCoins },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings },
] as const;

const actions = [
  { label: "Send", icon: Send, accent: true },
  { label: "Request", icon: ArrowDownToLine },
  { label: "Transfer", icon: MoveRight },
  { label: "Deposit", icon: Landmark },
  { label: "Pay Bill", icon: FileText },
  { label: "Create Invoice", icon: Plus },
] as const;

const accounts = [
  ["Credit", "$98,125.50"],
  ["Treasury", "$6,750,200.00"],
  ["Operations", "$1,592,864.82"],
] as const;

const transactions = [
  ["May 24", "AWS", "-$5,200", "Pending"],
  ["May 23", "Client Payment", "+$125,000", "Completed"],
  ["May 22", "Payroll", "-$85,450", "Completed"],
  ["May 21", "Office Supplies", "-$1,200", "Completed"],
] as const;

const fadeUp = (distance: number, duration: number, delay = 0) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function DashboardPreview() {
  return (
    <motion.div className={styles.dashboardSlot} {...fadeUp(30, 0.8, 0.5)}>
      <div
        className={styles.glassFrame}
        style={{
          background: "rgba(255, 255, 255, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "var(--shadow-dashboard)",
        }}
      >
        <div className={styles.dashboard} aria-label="Nexora dashboard preview">
          <header className={styles.dashboardTopbar}>
            <div className={styles.dashboardBrand}>
              <span className={styles.dashboardMark}>N</span>
              <span>Nexora</span>
              <ChevronDown aria-hidden="true" />
            </div>

            <div className={styles.search}>
              <Search aria-hidden="true" />
              <span>Search</span>
              <kbd>⌘K</kbd>
            </div>

            <div className={styles.dashboardControls}>
              <span>Move Money</span>
              <Bell aria-hidden="true" />
              <span className={styles.avatar}>JB</span>
            </div>
          </header>

          <div className={styles.dashboardBody}>
            <aside className={styles.sidebar}>
              <nav aria-label="Dashboard navigation">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      className={
                        "active" in item && item.active
                          ? styles.sidebarActive
                          : styles.sidebarItem
                      }
                      key={item.label}
                    >
                      <Icon aria-hidden="true" />
                      <span>{item.label}</span>
                      {"badge" in item && <em>{item.badge}</em>}
                      {"chevron" in item && item.chevron && (
                        <ChevronRight className={styles.itemChevron} aria-hidden="true" />
                      )}
                    </div>
                  );
                })}
              </nav>
              <p className={styles.sidebarLabel}>Workflows</p>
              <nav aria-label="Workflow navigation">
                {workflowItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className={styles.sidebarItem} key={item.label}>
                      <Icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </nav>
            </aside>

            <main className={styles.dashboardMain}>
              <h2>Welcome, Jane</h2>

              <div className={styles.actionRow}>
                <div className={styles.actionButtons}>
                  {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <span
                        className={
                          "accent" in action && action.accent
                            ? styles.actionAccent
                            : styles.action
                        }
                        key={action.label}
                      >
                        <Icon aria-hidden="true" />
                        {action.label}
                      </span>
                    );
                  })}
                </div>
                <span className={styles.customize}>
                  <SlidersHorizontal aria-hidden="true" />
                  Customize
                </span>
              </div>

              <div className={styles.cardRow}>
                <section className={styles.balanceCard}>
                  <div className={styles.cardHeading}>
                    <span>Mercury Balance</span>
                    <CheckCircle2 aria-hidden="true" />
                  </div>
                  <p className={styles.balance}>
                    $8,450,190<span>.32</span>
                  </p>
                  <div className={styles.balanceMeta}>
                    <span>Last 30 Days</span>
                    <strong>+$1.8M</strong>
                    <em>-$900K</em>
                  </div>
                  <svg
                    className={styles.chart}
                    viewBox="0 0 420 80"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="nexora-chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 62 C42 67 58 43 91 48 C124 53 138 24 174 34 C213 45 229 59 263 39 C299 17 316 26 348 20 C381 14 393 9 420 5 L420 80 L0 80 Z"
                      fill="url(#nexora-chart-fill)"
                    />
                    <path
                      d="M0 62 C42 67 58 43 91 48 C124 53 138 24 174 34 C213 45 229 59 263 39 C299 17 316 26 348 20 C381 14 393 9 420 5"
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="1.5"
                    />
                  </svg>
                </section>

                <section className={styles.accountsCard}>
                  <div className={styles.accountsHeading}>
                    <span>Accounts</span>
                    <div>
                      <Plus aria-hidden="true" />
                      <MoreHorizontal aria-hidden="true" />
                    </div>
                  </div>
                  <div className={styles.accountRows}>
                    {accounts.map(([name, amount]) => (
                      <div className={styles.accountRow} key={name}>
                        <span>{name}</span>
                        <strong>{amount}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className={styles.transactionsCard}>
                <h3>Recent Transactions</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(([date, description, amount, status]) => (
                      <tr key={`${date}-${description}`}>
                        <td>{date}</td>
                        <td>{description}</td>
                        <td>{amount}</td>
                        <td>
                          <span
                            className={
                              status === "Pending" ? styles.pending : styles.completed
                            }
                          >
                            {status === "Completed" && <Check aria-hidden="true" />}
                            {status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </main>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function NexoraHero() {
  return (
    <main className={styles.page}>
      <video
        className={styles.backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <header className={styles.navbar}>
        <a className={styles.logo} href="#nexora-hero" aria-label="Nexora home">
          <span aria-hidden="true">✦</span> Nexora
        </a>

        <div className={styles.navActions}>
          <nav className={styles.navLinks} aria-label="Primary navigation">
            {navItems.map((item) => (
              <a href="#nexora-hero" key={item}>
                {item}
              </a>
            ))}
          </nav>
          <Button className={styles.navCta}>Get started</Button>
        </div>
      </header>

      <section className={styles.hero} id="nexora-hero" aria-labelledby="nexora-heading">
        <div className={styles.heroContent}>
          <motion.div className={styles.badge} {...fadeUp(10, 0.5)}>
            Now with GPT-5 support ✨
          </motion.div>

          <motion.h1 id="nexora-heading" className={styles.headline} {...fadeUp(16, 0.6, 0.1)}>
            The Future of <em>Smarter</em> Automation
          </motion.h1>

          <motion.p className={styles.subheadline} {...fadeUp(16, 0.6, 0.2)}>
            Automate your busywork with intelligent agents that learn, adapt, and execute—so your
            team can focus on what matters most.
          </motion.p>

          <motion.div className={styles.heroActions} {...fadeUp(16, 0.6, 0.3)}>
            <Button className={styles.demoButton}>Book a demo</Button>
            <Button className={styles.playButton} variant="ghost" aria-label="Play product demo">
              <Play aria-hidden="true" />
            </Button>
          </motion.div>

          <DashboardPreview />
        </div>
      </section>
    </main>
  );
}
