// app/[locale]/contact/page.tsx
import type { Metadata } from "next";

import { getDictionary, type Locale, isLocale } from "@/i18n";
import { breadcrumbJsonLd } from "@/lib/seo";
import Section from "@/components/sections/Section";
import { notFound } from "next/navigation";
import RfqButton from "@/components/ui/RfqButton";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

/* ======================= SEO: generateMetadata ======================= */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw ?? "") ? (raw as Locale) : "en";

  const t = await getDictionary(locale);

  const pageTitle = t.contact?.title ?? "Contact";
  const description =
    t.contact?.note ??
    t.meta?.description ??
    "CNC • CAD/CAM • Prototyping • Toolpath Optimization";

  // pevně typovaný slovník URL -> žádný implicit 'any'
  const urls: Record<Locale, string> = {
    cs: `${SITE}/cs/contact`,
    en: `${SITE}/en/contact`,
    de: `${SITE}/de/contact`,
  };

  return {
    title: `${pageTitle} | DK CAM Studio`,
    description,
    alternates: {
      canonical: urls[locale],
      languages: urls,
    },
    openGraph: {
      title: `${pageTitle} | DK CAM Studio`,
      description,
      url: urls[locale],
      siteName: "DK CAM Studio",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | DK CAM Studio`,
      description,
    },
    robots: { index: true, follow: true },
  };
}
/* ==================================================================== */

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const t = await getDictionary(locale);
  // ...



  const crumbs = breadcrumbJsonLd([
    { name: t.nav?.home ?? "Home", url: `${SITE}/${locale}` },
    { name: t.contact?.title ?? "Contact", url: `${SITE}/${locale}/contact` },
  ]);
  const jsonLd = JSON.stringify(crumbs).replace(/</g, "\\u003c");

  const brand = t.meta?.title ?? "DK CAM Studio";

  return (
    <Section
      as="h1"
      eyebrow={t.hero?.eyebrow ?? "CNC • CAD/CAM"}
      title={t.contact?.title ?? "Contact"}
      subtitle={t.contact?.note ?? "We reply within 24 hours."}
    >
      {/* Breadcrumb JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-medium">{brand}</h2>
          <p className="muted mt-2">{t.contact?.address ?? "Address to be added"}</p>

          <ul className="mt-4 space-y-2">
            <li>
              <span className="muted">{t.contact?.email ?? "Email"}:</span>{" "}
              <a href="mailto:davidkuhejda@gmail.com">davidkuhejda@gmail.com</a>
            </li>
            <li>
              <span className="muted">{t.contact?.phone ?? "Phone"}:</span>{" "}
              <a href="tel:+420000000000">+420 000 000 000</a>
            </li>
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-medium">{t.ctaRfq.buttonLabel ?? "Request a Quote"}</h2>
          <p className="muted mt-2">
            {t.contact?.formNote ?? "Use our RFQ form to attach drawings/STEP."}
          </p>

         <div className="mt-4">
  <RfqButton
    href={`/${locale}/rfq`}
    label={t.ctaRfq?.buttonLabel ?? t.nav?.rfq ?? "Request a Quote (RFQ)"}
    size="sm"
    variant="primary"
  />
</div>
 </div>
      </div>
    </Section>
  );
}
