import Section from "@/components/sections/Section";
import { getDictionary, type Locale, isLocale } from "@/i18n";

export default async function ThankYou({ params }: { params: { locale?: string } }) {
  const locale = (isLocale(params?.locale ?? "") ? params!.locale : "en") as Locale;
  const t = await getDictionary(locale);

  return (
    <Section
      as="h1"
      eyebrow={t.hero?.eyebrow ?? "CNC • CAD/CAM"}
      title={t.rfq?.thanksTitle ?? "Thanks! We received your RFQ"}
      subtitle={t.rfq?.thanksSubtitle ?? "We’ll get back to you within 24 hours."}
    />
  );
}
