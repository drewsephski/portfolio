import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/privacy") },
  title: "Privacy Policy | Drew Sepeczi",
  description:
    "Privacy policy for Drew Sepeczi AI missed-call assistant SMS program (A2P 10DLC).",
};

export default function PrivacyPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "40px auto", padding: "0 16px", lineHeight: 1.55, color: "#111" }}>
      <h1>Privacy Policy</h1>
      <p>
        <strong>Effective:</strong> September 19, 2026
      </p>
      <p>
        This policy covers SMS sent by Drew Sepeczi (sole proprietor) through Drew&apos;s AI missed-call
        assistant (&quot;the Service&quot;) using Twilio phone numbers +1 (888) 417-8537 and +1 (224) 286-6565.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Phone numbers of callers who interact with the Service</li>
        <li>Call metadata and message content needed to deliver summaries, alerts, and consented texts</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>Send call summaries and urgent alerts to Drew Sepeczi (business owner)</li>
        <li>Send pet-sitting intake notes to Drew</li>
        <li>Text callers only after explicit verbal consent on the phone call</li>
      </ul>

      <h2>Mobile information &amp; sharing</h2>
      <p>
        <strong>
          Mobile information and messaging consent will not be shared with third parties or affiliates for
          marketing or promotional purposes.
        </strong>{" "}
        We use Twilio solely as the SMS delivery provider. We do not sell personal information.
      </p>

      <h2>Message frequency &amp; rates</h2>
      <p>
        Message frequency varies based on call volume and consented requests (typically a few messages per
        call interaction; not a recurring marketing drip). <strong>Message and data rates may apply.</strong>
      </p>

      <h2>Opt out</h2>
      <p>
        Reply <strong>STOP</strong> to opt out of SMS. Reply <strong>HELP</strong> for help. You may also email{" "}
        drewsepeczi@gmail.com.
      </p>

      <h2>Contact</h2>
      <p>
        Drew Sepeczi — <a href="https://drewsepeczi.xyz">drewsepeczi.xyz</a> — drewsepeczi@gmail.com
      </p>
      <p>
        Related: <a href="/terms">Terms of Service</a> · <a href="/sms-opt-in">SMS Opt-In</a>
      </p>
    </main>
  );
}
