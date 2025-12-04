// app/[[locale]]/rfq/page.tsx
import type { Metadata } from "next";
import { getDictionary, type Locale, isLocale } from "@/i18n";
import RFQForm from "@/components/sections/RFQForm";
import Section from "@/components/sections/Section";
import { breadcrumbJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

// ⚙️ normalize base URL (bez trailing slash)
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");

// === SEO =====================================================================
export async function generateMetadata({
  params,
}: { params: Promise<{ locale?: Locale }> }): Promise<Metadata> {
  const { locale = "en" } = await params;
  const t = await getDictionary(locale);

  const pageTitle = t.rfq?.title ?? t.ctaRfq?.buttonLabel ?? "Request a Quote (RFQ)";
  const description = t.meta?.description ?? "CNC • CAD/CAM • Prototyping • Toolpath Optimization";

  const urls: Record<Locale, string> = {
    cs: `${SITE}/cs/rfq`,
    en: `${SITE}/en/rfq`,
    de: `${SITE}/de/rfq`,
  };

  return {
    title: `${pageTitle} | DK CAM Studio`,
    description,
    alternates: { canonical: urls[locale], languages: urls },
    openGraph: {
      title: `${pageTitle} | DK CAM Studio`,
      description,
      url: urls[locale],
      siteName: "DK CAM Studio",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${pageTitle} | DK CAM Studio`, description },
    robots: { index: true, follow: true },
  };
}

// ============================================================================
export default async function RfqPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const t = await getDictionary(locale);

  const crumbs = breadcrumbJsonLd([
    { name: t.nav?.home ?? "Home", url: `${SITE}/${locale}` },
    { name: t.rfq?.title ?? "RFQ", url: `${SITE}/${locale}/rfq` },
  ]);
  const jsonLd = JSON.stringify(crumbs).replace(/</g, "\\u003c");

  return (
    <Section
      as="h1"
      eyebrow={t.hero?.eyebrow ?? "CNC • CAD/CAM"}
      title={t.rfq?.title ?? t.ctaRfq?.buttonLabel ?? "Request a Quote (RFQ)"}
      subtitle={t.rfq?.note ?? "Upload a drawing/STEP and specify material, quantity, and tolerance."}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      {/* Submit tlačítko je uvnitř RFQForm a MÁ být sjednocené přes <RfqButton type="submit" /> */}
      <RFQForm locale={locale} t={t.rfq} />
    </Section>
  );
}
