// app/[locale]/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, type Locale } from "@/i18n";
import Section from "@/components/sections/Section";
import Card from "@/components/ui/Card";

import { slugify, ensureUniqueAsciiSlugs } from "@/lib/slug";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");

// Stabilní fallback klíče (podle pořadí karet)
const slugs = ["milling", "turning", "cam", "prototyping", "toolpath", "quality"] as const;
type Slug = (typeof slugs)[number];

/* --------- malí pomocníci bez `any` --------- */
const isObj = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object";

const pickStr = (o: Record<string, unknown>, key: string): string | undefined => {
  const v = o[key];
  return typeof v === "string" ? v : undefined;
};

/* ===================== SEO: generateMetadata ===================== */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw ?? "") ? (raw as Locale) : "en";
  const t = await getDictionary(locale);

  const brandName = "DK CAM Studio";
  const pageLabel = t.services?.title ?? "Services";
  const title = `${pageLabel} — ${brandName}`;
  const description =
    t.meta?.description ?? "CNC • CAD/CAM • Prototyping • Toolpath Optimization";

  const urls: Record<Locale, string> = {
    cs: `${SITE}/cs/services`,
    en: `${SITE}/en/services`,
    de: `${SITE}/de/services`,
  };

  return {
    title,
    description,
    alternates: {
      canonical: urls[locale],
      languages: urls,
    },
    openGraph: {
      title,
      description,
      url: urls[locale],
      siteName: brandName,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}
/* ================================================================= */

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const t = await getDictionary(locale);

  // Slovník – bezpečně vytáhni pole položek nebo prázdné
  const dictItems: unknown[] = Array.isArray(t.services?.items)
    ? (t.services!.items as unknown[])
    : [];

  // Varování na duplicitní/invalidní slugy z JSONu (dev helper)
  const dictSlugs = dictItems
    .map((x) => (isObj(x) ? pickStr(x, "slug") : undefined))
    .filter((s): s is string => typeof s === "string");
  ensureUniqueAsciiSlugs(dictSlugs, "services");

  // Fallback pro případ, že ve slovníku nejsou items
  const fallbackItems: Array<Record<string, string>> = [
    { title: "CNC frézování", description: "3osé/4osé kusy i série." },
    { title: "CNC soustružení", description: "Přesné rotační díly, závity." },
    { title: "CAM programování", description: "Fusion 360 / SolidCAM." },
    { title: "Prototyping", description: "Rychlé prototypy a přípravky." },
    { title: "Optimalizace drah", description: "Kratší časy, delší životnost." },
    { title: "Měření a kvalita", description: "Kontrola, protokoly na přání." },
  ];

  const source: unknown[] = dictItems.length ? dictItems : (fallbackItems as unknown[]);
  const count = Math.min(source.length, slugs.length);

  // --- mapování do UI modelu (bez `any`) ---
  const items = source.slice(0, count).map((x, i) => {
    const rec = isObj(x) ? x : {};

    const title = pickStr(rec, "title");
    const description = pickStr(rec, "description");
    const dictSlug = pickStr(rec, "slug");

    // slug z JSONu, jinak slugify(title), jinak fallback podle pořadí
    const slug = (dictSlug ?? (title ? slugify(title) : slugs[i])) as Slug;

    return {
      title,
      description,
      slug,
      href: `/${locale}/services/${slug}`,
    };
  });

  // Lokalizovaný štítek pro odkaz
  const moreLabel =
    t.services?.more ??
    (locale === "de"
      ? "Leistungsdetails →"
      : locale === "en"
      ? "Service details →"
      : "Detail služby →");

  return (
    <Section
      as="h1"
      eyebrow={t.hero?.eyebrow ?? "CNC • CAD/CAM"}
      title={
        t.services?.title ??
        (locale === "de" ? "Leistungen" : locale === "en" ? "Services" : "Služby")
      }
      subtitle={t.services?.intro}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <Link key={i} href={it.href} className="group block focus:outline-none">
            <Card className="p-5 h-full transition border-white/10 hover:border-[rgb(var(--brand))]">
              <h3 className="font-medium text-[rgb(var(--fg))]">{it.title}</h3>
              {it.description && <p className="mt-1 muted">{it.description}</p>}
              <span className="mt-3 inline-flex items-center text-sm text-slate-400 group-hover:text-slate-200">
                {moreLabel}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
