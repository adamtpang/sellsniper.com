import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — SellSniper",
  description: "SellSniper privacy policy.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-zinc-500 hover:text-white">
          ← back
        </Link>
        <h1 className="text-4xl font-bold mt-6 mb-6">Privacy</h1>
        <p className="text-zinc-300 leading-relaxed">
          Privacy policy coming soon. Email{" "}
          <a
            href="mailto:adam@anchormarianas.com"
            className="text-red-400 hover:text-red-300"
          >
            adam@anchormarianas.com
          </a>{" "}
          for questions.
        </p>
      </div>
    </main>
  );
}
