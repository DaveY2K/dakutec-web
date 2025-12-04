// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getDictionary, locales, type Locale } from "@/i18n";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(
  /\/$/,
  ""
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const add = (locale: Locale, path: string, priority: number, change: MetadataRoute.Sitemap[number]["changeFrequency"]) => {
    entries.push({
      url: `${SITE}/${locale}${path}`,
      lastModified: now,
      changeFrequency: change,
      priority,
    });
  };

  for (const locale of locales) {
    const t = await getDictionary(locale);

    // homepage
    add(locale, "", 1, "weekly");

    // top-level pages
    add(locale, "/services", 0.8, "monthly");
    add(locale, "/rfq", 0.7, "monthly");
    add(locale, "/contact", 0.6, "monthly");

    // legal pages
    add(locale, "/privacy", 0.4, "yearly");
    add(locale, "/terms", 0.4, "yearly");

    // service detail pages from dictionary slugs
    const items = Array.isArray(t.services?.items)
      ? (t.services!.items as unknown[])
      : [];

    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      const slug = (item as Record<string, unknown>).slug;
      if (typeof slug !== "string" || !slug.trim()) continue;

      add(locale, `/services/${slug}`, 0.7, "monthly");
    }
  }

  return entries;
}
