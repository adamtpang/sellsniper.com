"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    // TODO: wire to /api/scan once built
    setTimeout(() => setLoading(false), 1500);
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
          <a href="#demo" className="hover:text-white">Demo</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-3 py-1 mb-6 text-xs text-red-400 border border-red-500/30 rounded-full bg-red-500/5">
          AI sales agent · in beta
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Stop shouting<br />into the void.
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste any link — a product, essay, song, bug fix, demo.
          We find the exact humans who&apos;d love it, and draft the message that gets their attention.
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
              <li>3 scans per month</li>
              <li>Top 5 stages per scan</li>
              <li>Basic message drafts</li>
            </ul>
            <button className="w-full py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors">
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
            <button className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-semibold">
              Upgrade to Pro
            </button>
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
