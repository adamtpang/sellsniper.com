import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — SellSniper",
  description: "How SellSniper collects and uses data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-zinc-500 hover:text-white">
          ← back
        </Link>
        <h1 className="text-4xl font-bold mt-6 mb-2">Privacy</h1>
        <p className="text-xs text-zinc-500 mb-10">Last updated: 19 April 2026</p>

        <div className="space-y-8 text-zinc-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">What we collect</h2>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>URLs you submit to the scanner.</li>
              <li>Your IP address (for rate limiting — 3 scans per day on the free tier).</li>
              <li>Standard server logs (timestamps, status codes, user-agent).</li>
            </ul>
            <p className="mt-3 text-zinc-400">
              We do not ask for accounts, names, or payment information. We do not set
              tracking cookies or run third-party analytics.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">How we use it</h2>
            <p className="text-zinc-400">
              Submitted URLs are fetched server-side and the public page content is sent
              to Anthropic&apos;s Claude API so it can generate the audience analysis you
              see on screen. We do not store the URL or the model output beyond the
              lifetime of the request. IPs are held only in memory long enough to enforce
              the daily rate limit (24 hours).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Third parties</h2>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>
                <span className="text-zinc-200">Anthropic</span> — processes the page
                snapshot to generate results.
              </li>
              <li>
                <span className="text-zinc-200">Vercel</span> — hosts the site and serves
                requests; standard access logs apply.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Your rights (GDPR / CCPA)</h2>
            <p className="text-zinc-400">
              Because we do not retain personal data beyond transient rate-limit IPs and
              server logs, there is very little to request. You may still email{" "}
              <a href="mailto:adam@anchormarianas.com" className="text-red-400 hover:text-red-300">
                adam@anchormarianas.com
              </a>{" "}
              to ask what we hold, request deletion, or opt out of any processing. We
              respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
            <p className="text-zinc-400">
              SellSniper is operated by Anchor Marianas LLC. Questions go to{" "}
              <a href="mailto:adam@anchormarianas.com" className="text-red-400 hover:text-red-300">
                adam@anchormarianas.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
