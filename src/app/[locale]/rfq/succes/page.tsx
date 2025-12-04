import Section from "@/components/sections/Section";
import { getDictionary, isLocale, type Locale } from "@/i18n";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function RfqSuccess({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = await getDictionary(locale);

  return (
    <Section as="h1" eyebrow={t.hero?.eyebrow ?? "CNC • CAD/CAM"}
      title={t.rfq?.thanksTitle ?? "Thank you!"}
      subtitle={t.rfq?.thanksSubtitle ?? "We’ll get back to you within 24 hours."}>
      <a href={`/${locale}`} className="btn btn-secondary mt-6">← {t.nav?.home ?? "Home"}</a>
    </Section>
  );
}
