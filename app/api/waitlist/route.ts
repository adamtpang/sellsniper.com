import type { NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

// Very small email sanity check. We deliberately keep this permissive —
// RFC-compliant regexes are overkill for a waitlist capture.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistEntry = {
  email: string;
  ts: string;
  ip: string;
};

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawEmail = (body as { email?: unknown })?.email;
  if (typeof rawEmail !== "string") {
    return Response.json({ error: "Provide an email in { email }" }, { status: 400 });
  }
  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return Response.json({ error: "That doesn't look like a valid email." }, { status: 400 });
  }

  const entry: WaitlistEntry = {
    email,
    ts: new Date().toISOString(),
    ip: getClientIp(req),
  };

  // Persist best-effort. On Vercel the filesystem is read-only outside /tmp,
  // so we try the repo-local file first, fall back to /tmp, and always log
  // the entry to stdout so it shows up in Vercel logs regardless.
  const line = JSON.stringify(entry) + "\n";
  console.log(`[waitlist] ${line.trim()}`);

  const candidates = [
    path.join(process.cwd(), "data", "waitlist.jsonl"),
    path.join("/tmp", "sellsniper-waitlist.jsonl"),
  ];
  for (const file of candidates) {
    try {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.appendFile(file, line, "utf8");
      break;
    } catch {
      // try next candidate
    }
  }

  return Response.json({ ok: true }, { status: 200 });
}
