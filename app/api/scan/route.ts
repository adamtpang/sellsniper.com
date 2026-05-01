import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Sonnet 4.5 producing 10 ranked stages with full drafts can take 30-45s.
// Vercel Pro plan allows up to 60s for nodejs runtime; bump if needed.
export const maxDuration = 60;

// --- rate limiting (in-memory; resets on cold start) -----------------------
// 3 scans per IP per 24h for the free tier MVP.
type Bucket = { count: number; resetAt: number };
const RATE_LIMIT = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const buckets: Map<string, Bucket> = (globalThis as any).__sellsniperBuckets
  ?? ((globalThis as any).__sellsniperBuckets = new Map<string, Bucket>());

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

function checkRateLimit(ip: string): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.resetAt < now) {
    const fresh = { count: 1, resetAt: now + WINDOW_MS };
    buckets.set(ip, fresh);
    return { ok: true, remaining: RATE_LIMIT - 1, resetAt: fresh.resetAt };
  }
  if (b.count >= RATE_LIMIT) {
    return { ok: false, remaining: 0, resetAt: b.resetAt };
  }
  b.count += 1;
  return { ok: true, remaining: RATE_LIMIT - b.count, resetAt: b.resetAt };
}

// --- URL fetching + tiny HTML parsing --------------------------------------
type PageSnapshot = {
  url: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogSiteName: string;
  h1: string;
  bodyText: string;
};

function pickMeta(html: string, nameOrProp: string): string {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:name|property)=["']${nameOrProp}["'][^>]*content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${nameOrProp}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) return decodeEntities(m[1]).trim();
  }
  return "";
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchSnapshot(url: string): Promise<PageSnapshot> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  let html = "";
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; SellSniperBot/0.1; +https://sellsniper.com)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) throw new Error(`Fetch returned ${res.status}`);

    const ct = (res.headers.get("content-type") ?? "").toLowerCase();
    if (ct && !ct.includes("text/html") && !ct.includes("application/xhtml")) {
      throw new Error(
        "We can only scan web pages, not PDFs or images. Try the HTML landing page instead.",
      );
    }

    html = await res.text();
  } finally {
    clearTimeout(timer);
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleMatch ? decodeEntities(stripTags(titleMatch[1])).trim() : "";
  const h1 = h1Match ? decodeEntities(stripTags(h1Match[1])).trim() : "";

  const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i);
  const bodyText = stripTags(bodyMatch ? bodyMatch[0] : html).slice(0, 8000);

  if (bodyText.length < 200 && !title) {
    throw new Error(
      "We couldn't read this page — it may be JS-rendered or paywalled. Try a different URL.",
    );
  }

  return {
    url,
    title,
    description: pickMeta(html, "description"),
    ogTitle: pickMeta(html, "og:title"),
    ogDescription: pickMeta(html, "og:description"),
    ogSiteName: pickMeta(html, "og:site_name"),
    h1,
    bodyText,
  };
}

// --- Claude ------------------------------------------------------------------
const SYSTEM_PROMPT = `You are SellSniper, an expert distribution strategist for indie makers.
Given a URL and a snapshot of its content, identify exactly who would love it and the specific online stages where those humans hang out. For each stage, draft a genuine, non-spammy message tailored to that community's norms (no emojis unless the platform expects them; respect character limits; lead with value).

IMPORTANT — no hallucinations. The "specific_location" field MUST be a real place you are confident exists. If you are uncertain whether a particular subreddit, Discord server, Slack, forum, or social handle is real, choose a more generic but verifiable alternative (for example, r/SideProject instead of r/IndieAppsPro). Never invent Twitter/X handles, Discord servers, Slack communities, or forum URLs. When in doubt, prefer well-known, long-established communities over obscure ones.

Return STRICTLY valid JSON that matches the requested schema. No markdown fences. No commentary.`;

function buildUserPrompt(snap: PageSnapshot): string {
  return `URL: ${snap.url}

<page_snapshot>
title: ${snap.title || "(none)"}
h1: ${snap.h1 || "(none)"}
og:title: ${snap.ogTitle || "(none)"}
og:site_name: ${snap.ogSiteName || "(none)"}
description: ${snap.description || "(none)"}
og:description: ${snap.ogDescription || "(none)"}
body_excerpt: ${snap.bodyText || "(none)"}
</page_snapshot>

Output JSON with this exact shape:
{
  "product": "what this is in one line",
  "problem_solved": "what pain it relieves",
  "audience": "exact humans who need this (demographics + psychographics)",
  "stages": [
    {
      "platform": "reddit | twitter | hackernews | producthunt | indiehackers | discord | linkedin | youtube | tiktok | forum | slack | other",
      "specific_location": "e.g. r/SideProject, @username, specific forum URL, channel name",
      "why_this_fits": "one sentence",
      "draft_message": "the exact message to post there (Twitter posts must be <= 280 chars; Reddit/forum posts may be longer)",
      "best_time_to_post": "optional short timing hint, or empty string"
    }
  ]
}

Rank the 10 stages by likelihood of producing genuine engagement (best first). Each "specific_location" must be concrete — never a generic category.`;
}

type Stage = {
  platform: string;
  specific_location: string;
  why_this_fits: string;
  draft_message: string;
  best_time_to_post: string;
};
type ScanResult = {
  product: string;
  problem_solved: string;
  audience: string;
  stages: Stage[];
};

function extractJson(text: string): ScanResult {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model returned no JSON object");
  return JSON.parse(candidate.slice(start, end + 1)) as ScanResult;
}

// --- handler ----------------------------------------------------------------
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const url = (body as { url?: unknown })?.url;
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
    return Response.json(
      { error: "Provide a valid http(s) url in { url }" },
      { status: 400 },
    );
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return Response.json(
      {
        error: "Rate limit reached. Free tier allows 3 scans per day.",
        resetAt: new Date(rl.resetAt).toISOString(),
      },
      { status: 429 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Server missing ANTHROPIC_API_KEY" },
      { status: 500 },
    );
  }

  let snapshot: PageSnapshot;
  try {
    snapshot = await fetchSnapshot(url);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "fetch failed";
    return Response.json(
      { error: `Could not fetch URL: ${msg}` },
      { status: 422 },
    );
  }

  const anthropic = new Anthropic({ apiKey });
  let resultText = "";
  try {
    const msg = await anthropic.messages.create(
      {
        model: "claude-sonnet-4-5",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(snapshot) }],
      },
      // Give Claude up to 50s — generating 10 ranked stages with full drafts
      // is a heavy ask. Stays under our 60s maxDuration with headroom.
      { signal: AbortSignal.timeout(50_000) },
    );
    for (const block of msg.content) {
      if (block.type === "text") resultText += block.text;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "claude failed";
    return Response.json(
      { error: `Analysis failed: ${msg}` },
      { status: 502 },
    );
  }

  let parsed: ScanResult;
  try {
    parsed = extractJson(resultText);
  } catch {
    const payload: { error: string; raw?: string } = {
      error: "Model did not return valid JSON",
    };
    if (process.env.NODE_ENV !== "production") {
      payload.raw = resultText.slice(0, 500);
    }
    return Response.json(payload, { status: 502 });
  }

  return Response.json(
    {
      url,
      snapshot: {
        title: snapshot.title,
        description: snapshot.description || snapshot.ogDescription,
      },
      ...parsed,
      rate_limit: { remaining: rl.remaining, resetAt: new Date(rl.resetAt).toISOString() },
    },
    { status: 200 },
  );
}
