import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sellsniper.com"),
  title: "SellSniper — Find the humans who'd love this",
  description:
    "Paste any link — a product, essay, song, bug fix, demo. SellSniper finds the exact humans who'd love it, and drafts the message that gets their attention. Stop shouting into the void.",
  keywords: [
    "AI distribution agent",
    "where to post",
    "subreddit finder",
    "audience finder",
    "indie maker tools",
    "viral launch",
    "Reddit marketing",
    "GummySearch alternative",
    "product distribution",
  ],
  openGraph: {
    title: "SellSniper — Find the humans who'd love this",
    description:
      "Stop shouting into the void. Paste any link, find the exact humans who'd care.",
    url: "https://sellsniper.com",
    siteName: "SellSniper",
    type: "website",
    // og:image is auto-injected from app/opengraph-image.tsx (rasterized PNG, 1200x630).
  },
  twitter: {
    card: "summary_large_image",
    title: "SellSniper — Find the humans who'd love this",
    description:
      "Stop shouting into the void. Paste any link, find the exact humans who'd care.",
    // twitter:image is auto-injected from app/twitter-image.tsx (rasterized PNG, 1200x630).
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
      <body className="min-h-full flex flex-col">
        <PostHogProvider>{children}</PostHogProvider>
        <footer style={{padding: '1.5rem 1rem', textAlign: 'center', fontSize: '0.75rem', opacity: 0.6, marginTop: 'auto'}}>
          Built by <a href="https://adampang.com" style={{textDecoration: 'underline'}}>Adam Pangelinan</a>
          {' · '}<a href="https://anchormarianas.com" style={{textDecoration: 'underline'}}>Anchor Marianas LLC</a>
          {' · '}<a href="https://sellsniper.com" style={{textDecoration: 'underline'}}>More projects</a>
        </footer>
      </body>
    </html>
  );
}
