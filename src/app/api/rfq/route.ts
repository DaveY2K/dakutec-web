// app/api/rfq/route.ts
import { NextResponse } from "next/server";

const ALLOWED_EXT = new Set(["pdf", "step", "stp", "igs", "iges", "dxf", "dwg", "zip"]);
const MAX_FILE = 15 * 1024 * 1024; // 15 MB
const MAX_FILES = 5;

// jednoduchý in-memory rate-limit (pro malý traffic OK)
const bucket = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hodina
const MAX_PER_WINDOW = 5;

function getClientIp(req: Request): string {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  return real ?? "0.0.0.0";
}

function rateLimit(ip: string) {
  const now = Date.now();
  const rec = bucket.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    bucket.set(ip, { count: 1, ts: now });
    return false;
  }
  if (rec.count >= MAX_PER_WINDOW) return true;
  rec.count++;
  return false;
}

const locales = new Set(["cs", "en", "de"]);
function normalizeLocale(x: unknown): "cs" | "en" | "de" {
  const s = String(x ?? "en");
  return (locales.has(s) ? s : "en") as "cs" | "en" | "de";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  // honeypot (podporuj obě názvy polí pro jistotu)
  const hp1 = (form.get("company") ?? "").toString().trim();
  const hp2 = (form.get("hpEmail") ?? "").toString().trim();
  if (hp1 || hp2) return NextResponse.json({ ok: true }, { status: 204 });

  // soubory
  const files = form.getAll("files").filter((v): v is File => v instanceof File);
  if (files.length > MAX_FILES) {
    return respond(req, form, { ok: false, error: "Too many files" }, 400);
  }
  for (const f of files) {
    if (f.size > MAX_FILE) {
      return respond(req, form, { ok: false, error: "File too large" }, 400);
    }
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return respond(req, form, { ok: false, error: "Unsupported file type" }, 400);
    }
  }

  // TODO: uložení / emaily…

  return respond(req, form, { ok: true }, 200);
}

function respond(req: Request, form: FormData, json: Record<string, unknown>, status = 200) {
  const wantsJSON =
    req.headers.get("accept")?.includes("application/json") ||
    req.headers.get("x-requested-with") === "XMLHttpRequest";

  if (wantsJSON) {
    return NextResponse.json(json, { status });
  }

  const locale = normalizeLocale(form.get("locale"));
  const base = new URL(req.url);
  const target =
    status >= 400
      ? new URL(`/${locale}/rfq/error`, base)
      : new URL(`/${locale}/rfq/success`, base);

  if (status >= 400 && typeof json.error === "string") {
    target.searchParams.set("error", json.error);
  }

  // 303 kvůli POST->GET redirectu
  return NextResponse.redirect(target, { status: 303 });
}
