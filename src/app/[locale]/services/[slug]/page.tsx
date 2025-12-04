import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale, type Dictionary } from "@/i18n";
import Section from "@/components/sections/Section";
import { breadcrumbJsonLd } from "@/lib/seo";
import { SERVICE_SLUGS, isServiceSlug, type ServiceSlug } from "@/lib/services";
import RfqButton from "@/components/ui/RfqButton";

/* -------------------- helpers -------------------- */

// BASE URL bez trailing slashe
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");

// typově bezpečné kontroly
function isObj(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}
function str(o: Record<string, unknown>, key: string): string | undefined {
  const v = o[key];
  return typeof v === "string" ? v : undefined;
}
function strArr(o: Record<string, unknown>, key: string): string[] {
  const v = o[key];
  return Array.isArray(v) && v.every((x) => typeof x === "string") ? (v as string[]) : [];
}

// data pro detail služby
type ServiceDetail = {
  slug: ServiceSlug;
  title?: string;
  description?: string;
  bullets: string[]; // vždy pole
};

/**
 * Bezpečně vybere i-tou službu podle kanonického slugu (indexu).
 * Slug ze slovníku ignorujeme – může existovat jen pro informaci/SEO, ale není zdroj pravdy.
 */
function getServiceBySlug(dict: Dictionary, slug: ServiceSlug): ServiceDetail | undefined {
  const items = Array.isArray(dict.services?.items) ? (dict.services!.items as unknown[]) : [];
  const idx = SERVICE_SLUGS.indexOf(slug);
  const raw = isObj(items[idx]) ? (items[idx] as Record<string, unknown>) : undefined;
  if (!raw) return undefined;

  // Preferuj title2/description2, jinak title/description
  const title = str(raw, "title2") ?? str(raw, "title");
  const description = str(raw, "description2") ?? str(raw, "description");
  const bullets = strArr(raw, "bullets");
  return { slug, title, description, bullets };
}

/* ---------------------- SEO ---------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string; slug?: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug: rawSlug = "" } = await params;
  const locale: Locale = isLocale(raw ?? "") ? (raw as Locale) : "en";

  // invalidní slug → fallback na listing metadata (nevyhazujeme notFound v metadata fázi)
  if (!isServiceSlug(rawSlug)) {
    const t = await getDictionary(locale);
    const pageTitle = (t.services?.title ?? "Services") + " — DK CAM Studio";
    const description = t.meta?.description ?? "CNC • CAD/CAM • Prototyping • Toolpath Optimization";
    const hrefs = {
      cs: `${SITE}/cs/services`,
      en: `${SITE}/en/services`,
      de: `${SITE}/de/services`,
    } as const;
    return {
      title: pageTitle,
      description,
      alternates: { canonical: hrefs[locale], languages: hrefs },
      robots: { index: true, follow: true },
    };
  }

  const slug = rawSlug as ServiceSlug;
  const t = await getDictionary(locale);
  const svc = getServiceBySlug(t, slug);

  const pageTitle = (svc?.title ?? t.services?.title ?? "Services") + " — DK CAM Studio";
  const description =
    svc?.description ?? t.meta?.description ?? "CNC • CAD/CAM • Prototyping • Toolpath Optimization";

  const hrefs = {
    cs: `${SITE}/cs/services/${slug}`,
    en: `${SITE}/en/services/${slug}`,
    de: `${SITE}/de/services/${slug}`,
  } as const;

  return {
    title: pageTitle,
    description,
    alternates: { canonical: hrefs[locale], languages: hrefs },
    openGraph: { title: pageTitle, description, url: hrefs[locale], siteName: "DK CAM Studio", type: "article" },
    twitter: { card: "summary_large_image", title: pageTitle, description },
    robots: { index: true, follow: true },
  };
}

/* ---------------------- PAGE ---------------------- */

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale?: string; slug?: string }>;
}) {
  const { locale: raw, slug: rawSlug = "" } = await params;
  const locale: Locale = isLocale(raw ?? "") ? (raw as Locale) : "en";
  if (!isServiceSlug(rawSlug)) notFound();
  const slug = rawSlug as ServiceSlug;

  const t = await getDictionary(locale);
  const svc = getServiceBySlug(t, slug);
  if (!svc) notFound();

  const title = svc.title ?? t.services?.title ?? "Service";
  const subtitle = svc.description ?? t.services?.intro ?? "Detailed information about this service.";

  // Breadcrumb JSON-LD (bezpečně escapnuté)
  const crumbs = breadcrumbJsonLd([
    { name: t.nav?.home ?? "Home", url: `${SITE}/${locale}` },
    { name: t.services?.title ?? "Services", url: `${SITE}/${locale}/services` },
    { name: title, url: `${SITE}/${locale}/services/${slug}` },
  ]);
  const jsonLd = JSON.stringify(crumbs).replace(/</g, "\\u003c");

  return (
    <Section as="h1" eyebrow={t.hero?.eyebrow ?? "CNC • CAD/CAM"} title={title} subtitle={subtitle}>
      {/* Breadcrumb JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* Bullets (pokud jsou) */}
      {svc.bullets.length > 0 && (
        <ul className="mt-6 list-disc pl-6 space-y-1 text-slate-300">
          {svc.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      {/* CTA */}
   <div className="mt-8">
  <RfqButton
    href={`/${locale}/rfq`}
    label={t.ctaRfq?.buttonLabel ?? t.ctaRfq.buttonLabel ?? "Request a Quote (RFQ)"}
    variant="primary"
    size="md"
  />
</div>
    </Section>
  );
}

/* ------------------ statická generace ------------------ */
export function generateStaticParams() {
  const locales: readonly Locale[] = ["cs", "en", "de"];
  return locales.flatMap((locale) => SERVICE_SLUGS.map((slug) => ({ locale, slug })));
}
