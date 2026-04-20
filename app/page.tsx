"use client";

import { useState, useEffect } from "react";

type Stage = {
  platform: string;
  specific_location: string;
  why_this_fits: string;
  draft_message: string;
  best_time_to_post?: string;
};

type ScanResponse = {
  url: string;
  product: string;
  problem_solved: string;
  audience: string;
  stages: Stage[];
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (!loading) {
      setLoadingStage(0);
      return;
    }
    const t1 = setTimeout(() => setLoadingStage(1), 5000);
    const t2 = setTimeout(() => setLoadingStage(2), 10000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  const loadingMessages = [
    "Reading your link...",
    "Inferring your audience...",
    "Ranking stages by fit...",
  ];

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail }),
      });
      if (res.ok) {
        setWaitlistStatus("success");
        setWaitlistEmail("");
      } else {
        setWaitlistStatus("error");
      }
    } catch {
      setWaitlistStatus("error");
    }
  }

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? `Scan failed (${res.status})`);
      } else {
        setResult(data as ScanResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage(text: string, idx: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx((v) => (v === idx ? null : v)), 1500);
    } catch {
      /* clipboard blocked; ignore */
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tight">
          sell<span className="text-red-500">sniper</span>
        </div>
        <div className="flex gap-6 text-sm text-zinc-400">
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Stop shouting<br />into the void.
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-6 leading-relaxed">
          Paste any link — a product, essay, song, bug fix, demo.
          We find the exact humans who&apos;d love it, and draft the message that gets their attention.
        </p>
        <p className="text-sm text-zinc-500 italic max-w-xl mx-auto mb-10">
          Load your work. SellSniper finds the humans.
        </p>

        {/* Scan form */}
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-thing.com"
            className="flex-1 px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-zinc-600"
          />
          <button
            type="submit"
            disabled={loading || !url}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? "Scanning..." : "Find my stage"}
          </button>
        </form>
        <p className="text-xs text-zinc-600">
          Free — no signup. Scan any link in under 30 seconds.
        </p>

        {/* Results */}
        {error && (
          <div role="alert" aria-live="polite" className="mt-10 max-w-2xl mx-auto text-left border border-red-500/40 bg-red-500/5 rounded-lg p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading && !result && (
          <div className="mt-10 max-w-2xl mx-auto text-left text-zinc-500 text-sm animate-pulse" aria-live="polite">
            {loadingMessages[loadingStage]}
          </div>
        )}

        {result && (
          <div className="mt-12 max-w-3xl mx-auto text-left">
            <div className="border border-zinc-800 rounded-xl p-6 mb-8 bg-zinc-950">
              <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Target</div>
              <div className="text-lg font-semibold mb-3">{result.product}</div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Problem solved</div>
                  <div className="text-zinc-200">{result.problem_solved}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Audience</div>
                  <div className="text-zinc-200">{result.audience}</div>
                </div>
              </div>
            </div>

            <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
              {result.stages?.length ?? 0} stages · ranked by fit
            </div>
            <div className="space-y-4">
              {result.stages?.map((stage, idx) => (
                <div
                  key={idx}
                  className="border border-zinc-800 rounded-xl p-5 bg-zinc-950 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="text-xs text-red-400 uppercase tracking-wider mb-1">
                        {stage.platform}
                      </div>
                      <div className="font-semibold text-white">{stage.specific_location}</div>
                    </div>
                    <div className="text-xs text-zinc-600 font-mono">#{idx + 1}</div>
                  </div>
                  <div className="text-sm text-zinc-400 mb-3">{stage.why_this_fits}</div>
                  <div className="relative">
                    <pre className="whitespace-pre-wrap text-sm text-zinc-200 bg-black border border-zinc-800 rounded-lg p-4 font-sans">
{stage.draft_message}
                    </pre>
                    <button
                      onClick={() => copyMessage(stage.draft_message, idx)}
                      aria-label={`Copy drafted message for ${stage.specific_location}`}
                      className="absolute top-2 right-2 px-2 py-1 text-xs border border-zinc-800 rounded bg-zinc-900 hover:border-zinc-600"
                    >
                      <span aria-live="polite">{copiedIdx === idx ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  {stage.best_time_to_post && (
                    <div className="text-xs text-zinc-500 mt-2">
                      Best time: {stage.best_time_to_post}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Social proof / examples */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-900">
        <p className="text-center text-sm text-zinc-500 mb-8">SellSniper works on anything worth sharing:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { emoji: "•", label: "Products", sub: "find buyers" },
            { emoji: "•", label: "Essays", sub: "find readers" },
            { emoji: "•", label: "Songs", sub: "find listeners" },
            { emoji: "•", label: "Apps", sub: "find users" },
            { emoji: "•", label: "Bug fixes", sub: "find testers" },
            { emoji: "•", label: "Demos", sub: "find reactions" },
            { emoji: "•", label: "Launches", sub: "find upvotes" },
            { emoji: "•", label: "Creations", sub: "find fans" },
          ].map((item, i) => (
            <div key={i} className="border border-zinc-900 rounded-lg p-4 text-center hover:border-zinc-700 transition-colors">
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="text-xs text-zinc-500 mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900">
        <h2 className="text-4xl font-bold text-center mb-16">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Step
            num="01"
            title="Analyze"
            desc="Paste any URL. AI reverse-engineers what you made, what problem it solves, and exactly who would care about it."
          />
          <Step
            num="02"
            title="Snipe"
            desc="We scan Reddit, Twitter, Discord, forums, and niche communities to find the exact humans with the matching problem."
          />
          <Step
            num="03"
            title="Perform"
            desc="Get a ranked list of 10+ stages with drafted messages — tailored per audience. No spam. Just signal."
          />
        </div>
      </section>

      {/* The creator flywheel */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Every creation deserves its audience.</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            You spent weeks building it. Don&apos;t let distribution be the reason it dies.
            SellSniper is the sniper rifle for attention — find the right stage, hit the right humans, get real reactions.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900">
        <h2 className="text-4xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-zinc-400 text-center mb-16">Start free. Upgrade when you&apos;re ready to ship more.</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="border border-zinc-800 rounded-xl p-8">
            <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Free</div>
            <div className="text-4xl font-bold mb-2">$0</div>
            <div className="text-sm text-zinc-500 mb-6">forever</div>
            <ul className="space-y-3 text-sm text-zinc-300 mb-8">
              <li>3 scans per day</li>
              <li>Top 10 stages per scan</li>
              <li>Basic message drafts</li>
            </ul>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-full py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Start free
            </button>
          </div>
          <div className="border border-red-500 rounded-xl p-8 bg-red-500/5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-xs px-3 py-1 rounded-full">MOST POPULAR</div>
            <div className="text-xs uppercase tracking-wider text-red-400 mb-2">Pro</div>
            <div className="text-4xl font-bold mb-2">$29</div>
            <div className="text-sm text-zinc-500 mb-6">per month</div>
            <ul className="space-y-3 text-sm text-zinc-300 mb-8">
              <li>Unlimited scans</li>
              <li>Top 20 stages per scan</li>
              <li>Personalized message drafts</li>
              <li>Best time to post</li>
              <li>Auto-follow-up reminders</li>
            </ul>
            {waitlistStatus === "success" ? (
              <div className="w-full py-3 text-center text-sm text-green-400 border border-green-500/30 rounded-lg bg-green-500/5">
                You&apos;re in. We&apos;ll email when Pro opens.
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="space-y-2">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-zinc-600 text-sm"
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === "loading" || !waitlistEmail}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-lg transition-colors font-semibold"
                >
                  {waitlistStatus === "loading" ? "Joining..." : "Join Pro waitlist"}
                </button>
                {waitlistStatus === "error" && (
                  <p className="text-xs text-red-400">Something broke. Try again?</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
        <div>
          Built by <a href="https://adampang.com" className="hover:text-white">adam pang</a> · sellsniper.com
        </div>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-white">Privacy</a>
          <a href="/terms" className="hover:text-white">Terms</a>
          <a href="mailto:adam@anchormarianas.com" className="hover:text-white">Contact</a>
        </div>
      </footer>
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="text-left">
      <div className="text-red-500 text-sm font-mono mb-3">{num}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}
