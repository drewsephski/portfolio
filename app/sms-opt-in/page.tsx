import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMS Opt-In | Drew Sepeczi",
  description: "Verbal SMS opt-in / Call-to-Action workflow for Drew Sepeczi AI missed-call assistant.",
};

export default function SmsOptInPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 780, margin: "40px auto", padding: "0 16px", lineHeight: 1.55, color: "#111" }}>
      <h1>SMS Opt-In Workflow (Verbal)</h1>
      <p>
        <strong>Business:</strong> Drew Sepeczi (sole proprietor)
        <br />
        <strong>Service:</strong> Drew&apos;s AI missed-call assistant
        <br />
        <strong>Numbers:</strong> +1 (888) 417-8537 · +1 (224) 286-6565
        <br />
        <strong>Website:</strong> <a href="https://drewsepeczi.xyz">https://drewsepeczi.xyz</a>
      </p>
      <p>
        Opt-in type: <strong>VERBAL</strong> during a live phone conversation. There is no purchased marketing
        list and no pre-checked web form.
      </p>

      <h2>Step-by-step Call to Action</h2>
      <ol>
        <li>
          Caller reaches Drew&apos;s AI missed-call assistant by dialing the Twilio number (or is connected after
          a missed call to Drew).
        </li>
        <li>The assistant discloses it is an AI for Drew Sepeczi and is not Drew in person.</li>
        <li>
          Caller asks to be texted (summary, confirmation, public link, or pet-sitting note), <em>or</em> Drew
          (business owner) receives owner-only automated summaries as the named recipient of his own service.
        </li>
        <li>
          Before any SMS to a <strong>caller&apos;s</strong> phone, the assistant reads the destination number
          aloud and asks for explicit verbal confirmation, for example: &quot;I can text that to +1 … — is that
          okay?&quot;
        </li>
        <li>Only after the caller clearly says yes does the assistant send the SMS.</li>
        <li>
          Every consumer-facing message includes opt-out language. Reply <strong>STOP</strong> to unsubscribe;
          reply <strong>HELP</strong> for help.
        </li>
      </ol>

      <h2>Message types</h2>
      <ul>
        <li>Missed-call summaries to Drew</li>
        <li>Urgent mid-call alerts to Drew</li>
        <li>Pet-sitting intake notes to Drew</li>
        <li>Caller-requested follow-up texts (after verbal yes)</li>
      </ul>

      <h2>Frequency &amp; rates</h2>
      <p>
        Message frequency varies with call volume (typically a few messages per interaction; not a recurring
        marketing drip). <strong>Message and data rates may apply.</strong>
      </p>

      <h2>Policies</h2>
      <p>
        <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Service</a>
      </p>

      <h2>Sample message</h2>
      <p>
        <code>Drew — missed call from +1…. Summary: …. Reply STOP to opt out.</code>
      </p>
      <p>Contact: drewsepeczi@gmail.com</p>
    </main>
  );
}
