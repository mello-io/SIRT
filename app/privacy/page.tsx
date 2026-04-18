import type { Metadata } from "next";
import { AppShell } from "@/components/sirt/AppShell";

export const metadata: Metadata = {
  title: "Privacy Policy — S.I.R.T.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-xs text-muted-ash uppercase tracking-widest border-b border-grid-line pb-1">
        {title}
      </p>
      <div className="text-sm text-muted-ash leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <AppShell>
      <div className="flex-1 px-6 py-10 w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] font-mono text-muted-ash uppercase tracking-widest mb-2">
            S.I.R.T.
          </p>
          <h1 className="font-mono font-bold text-2xl text-off-white mb-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-ash font-mono">Last updated: April 2026</p>
        </div>

        <div className="space-y-8">
          <Section title="What We Collect">
            <p>
              S.I.R.T. does not collect or store personal information.
            </p>
            <p>
              We use Vercel Analytics for anonymous, cookie-free usage statistics. Vercel Analytics
              records page views and anonymous interaction events (e.g. checklist generated, file
              downloaded). No personally identifiable information is captured. No cookies are set
              by S.I.R.T.
            </p>
          </Section>

          <Section title="Data We Do Not Collect">
            <ul className="space-y-1 font-mono text-xs">
              {[
                "No account registration or login",
                "No name, email, or contact information",
                "No incident data, security stack configurations, or generated checklist content",
                "No LLM API keys - keys are session-only and never logged or stored on our servers",
                "No payment information",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-signal-green shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Your API Key">
            <p>
              If you use the API-powered checklist generator, you provide your own LLM API key.
              That key is:
            </p>
            <ul className="space-y-1 font-mono text-xs">
              {[
                "Stored in your browser's sessionStorage only",
                "Cleared automatically when you close your tab",
                "Used solely to authenticate a single LLM API call on your behalf",
                "Never logged, stored, or transmitted to any service other than your chosen LLM provider",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-signal-green shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Your Files">
            <p>
              Files you upload to S.I.R.T. (org-sec-stack.md, incident-type.md) are processed
              entirely in your browser. A structured prompt derived from that data is sent to your
              LLM provider. Your original files are not stored by S.I.R.T. at any point and are
              never transmitted to any server.
            </p>
          </Section>

          <Section title="Third-Party Services">
            <p>S.I.R.T. interacts with the following third-party services:</p>
            <ul className="space-y-1 font-mono text-xs">
              {[
                ["Vercel", "vercel.com — hosting and serverless functions"],
                ["Anthropic", "anthropic.com — optional LLM provider"],
                ["OpenAI", "openai.com — optional LLM provider"],
                ["Google", "google.com — optional LLM provider (Gemini)"],
                ["Mistral", "mistral.ai — optional LLM provider"],
                ["Vercel Analytics", "anonymous usage statistics"],
              ].map(([name, desc]) => (
                <li key={name} className="flex gap-2">
                  <span className="text-signal-green shrink-0">·</span>
                  <span>
                    <span className="text-off-white">{name}</span> — {desc}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              Only the LLM provider you select receives any request data. Each service has its own
              privacy policy.
            </p>
          </Section>

          <Section title="Session Storage">
            <p>
              S.I.R.T. uses browser sessionStorage to hold your API key, provider selection, and
              generated output during your session. All sessionStorage data is cleared automatically
              when you close your browser tab. It is never transmitted to S.I.R.T.&apos;s servers.
            </p>
          </Section>

          <Section title="Cookies">
            <p>S.I.R.T. does not set cookies.</p>
          </Section>

          <Section title="Contact">
            <p>
              For privacy-related questions, open an issue at{" "}
              <a
                href="https://github.com/mello-io/SIRT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-green hover:underline"
              >
                github.com/mello-io/SIRT
              </a>
              .
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              This policy may be updated as the product evolves. The &quot;Last updated&quot; date
              above reflects the most recent revision.
            </p>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
