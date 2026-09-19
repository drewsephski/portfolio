import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Drew Sepeczi",
  description:
    "Terms of service for Drew Sepeczi AI missed-call assistant SMS program (A2P 10DLC).",
};

export default function TermsPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "40px auto", padding: "0 16px", lineHeight: 1.55, color: "#111" }}>
      <h1>Terms of Service</h1>
      <p>
        <strong>Effective:</strong> September 19, 2026
      </p>
      <p>These terms cover SMS from Drew Sepeczi&apos;s AI missed-call assistant (&quot;the Service&quot;).</p>

      <h2>Service</h2>
      <p>
        The Service may send SMS related to missed calls, urgent alerts, pet-sitting intake, and
        caller-requested messages after verbal consent on a live phone call with Drew&apos;s AI assistant.
      </p>

      <h2>Consent (not bundled)</h2>
      <p>
        SMS consent is obtained <strong>directly and separately</strong> via verbal opt-in during the phone
        call — it is not buried in general website terms and is not bundled with unrelated agreements. Before
        texting a caller, the assistant confirms the destination number out loud and waits for an explicit yes.
      </p>

      <h2>Program details</h2>
      <ul>
        <li>Message frequency varies with call volume</li>
        <li>Message and data rates may apply</li>
        <li>
          Reply <strong>STOP</strong> anytime to cancel
        </li>
        <li>
          Reply <strong>HELP</strong> for help
        </li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        No unlawful, spam, or harassing use. The Service is not for emergency services (call 911 for
        emergencies).
      </p>

      <h2>Contact</h2>
      <p>
        Drew Sepeczi — <a href="https://drewsepeczi.xyz">drewsepeczi.xyz</a> — drewsepeczi@gmail.com
      </p>
      <p>
        Related: <a href="/privacy">Privacy Policy</a> · <a href="/sms-opt-in">SMS Opt-In</a>
      </p>
    </main>
  );
}
