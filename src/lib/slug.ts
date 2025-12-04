// src/lib/slug.ts

/** Stabilní slugs pro stránky služeb */
export const SERVICE_SLUGS = [
  "milling",
  "turning",
  "cam",
  "prototyping",
  "toolpath",
  "quality",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/** Převod libovolného textu na ASCII kebab-case slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Kontrola a sjednocení slugů (viz předchozí verze). */
export function ensureUniqueAsciiSlugs(
  slugs: string[],
  where = "services"
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const strict = process.env.NODE_ENV === "production";

  for (const raw of slugs) {
    if (typeof raw !== "string" || !raw.trim()) {
      const msg = `[${where}] Neplatný/empty slug "${String(raw)}".`;
      if (strict) throw new Error(msg);
      console.warn(msg);
      continue;
    }
    let s = raw.trim();
    if (!/^[a-z0-9-]+$/.test(s)) {
      const sug = slugify(s);
      const msg = `[${where}] Non-ASCII slug "${s}" → použij "${sug}".`;
      if (strict) throw new Error(msg);
      console.warn(msg);
      s = sug;
    }
    if (seen.has(s)) {
      const msg = `[${where}] Duplicitní slug "${s}".`;
      if (strict) throw new Error(msg);
      console.warn(msg);
      continue;
    }
    seen.add(s);
    out.push(s);
  }
  return out;
}
