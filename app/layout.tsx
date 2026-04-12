import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SellSniper — Find the humans who'd love this",
  description:
    "Paste any link — a product, essay, song, bug fix, demo. SellSniper finds the exact humans who'd love it, and drafts the message that gets their attention. Stop shouting into the void.",
  keywords: [
    "AI sales agent",
    "product distribution",
    "audience finder",
    "viral launch",
    "Reddit marketing",
    "indie hacker tools",
  ],
  openGraph: {
    title: "SellSniper — Find the humans who'd love this",
    description:
      "Stop shouting into the void. Paste any link, find the exact humans who'd care.",
    url: "https://sellsniper.com",
    siteName: "SellSniper",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SellSniper — Find the humans who'd love this",
    description:
      "Stop shouting into the void. Paste any link, find the exact humans who'd care.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
