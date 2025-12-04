// scripts/validate-content.ts
import fs from "node:fs";
import path from "node:path";

type Dict = typeof import("../src/i18n/dictionaries/en.json");







const LOCALES = ["cs", "en", "de"] as const;
const ROOT = path.join(process.cwd(), "public");

function isObj(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}
function pickStr(o: Record<string, unknown>, k: string) {
  const v = o[k];
  return typeof v === "string" ? v : undefined;
}

function validateSlugs(dict: Dict, loc: string) {
  const items: unknown[] = Array.isArray(dict.services?.items) ? (dict.services!.items as unknown[]) : [];
  const slugs = new Set<string>();
  for (const x of items) {
    if (!isObj(x)) continue;
    const s = pickStr(x, "slug");
    if (!s) continue;
    if (!/^[a-z0-9-]+$/.test(s)) {
      throw new Error(`[${loc}] services.items[].slug "${s}" není ASCII a-z0-9-`);
    }
    if (slugs.has(s)) {
      throw new Error(`[${loc}] duplicitní services.slug "${s}"`);
    }
    slugs.add(s);
  }
}

function validateWorkImages(dict: Dict, loc: string) {
  const items: unknown[] = Array.isArray(dict.work?.items) ? (dict.work!.items as unknown[]) : [];
  for (const x of items) {
    if (!isObj(x)) continue;
    const img = pickStr(x, "image");
    if (!img) continue;
    const p = img.startsWith("/") ? img.slice(1) : img;
    const abs = path.join(ROOT, p);
    if (!fs.existsSync(abs)) {
      throw new Error(`[${loc}] 404 image ${img} (hledám ${abs})`);
    }
  }
}

async function run() {
  for (const loc of LOCALES) {
    const dict = (await import(`../src/i18n/dictionaries/${loc}.json`)).default as Dict;
    validateSlugs(dict, loc);
    validateWorkImages(dict, loc);
  }
  console.log("✓ validate-content: OK");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
