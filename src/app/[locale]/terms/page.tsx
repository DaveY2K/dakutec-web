import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Section from "@/components/sections/Section";
import { getDictionary, isLocale, type Locale } from "@/i18n";

type PageProps = {
  params: { locale: Locale };
};

const TERMS_SECTIONS: Record<
  Locale,
  Array<{ heading: string; body: string }>
> = {
  cs: [
    {
      heading: "Úvodní ustanovení",
      body:
        "Tento dokument představuje základní obchodní podmínky pro poskytování služeb DakuTec (DK CAM Studio), zejména v oblasti CNC obrábění, CAM programování a prototypové výroby. Text slouží jako pracovní návrh a nenahrazuje individuální smluvní ujednání.",
    },
    {
      heading: "Poptávka a nabídka",
      body:
        "Nezávaznou poptávku můžete zaslat prostřednictvím kontaktního formuláře nebo RFQ formuláře. Na základě vámi poskytnutých podkladů připravíme cenovou nabídku, která zpravidla obsahuje popis služby, orientační termín dodání a cenu. Zakázka je závazně potvrzena až akceptací nabídky oběma stranami.",
    },
    {
      heading: "Dodací podmínky",
      body:
        "Termín dodání je vždy stanoven individuálně podle rozsahu zakázky, dostupnosti materiálu a kapacity výroby. V případě neočekávaných okolností si vyhrazujeme právo termín po dohodě s klientem upravit.",
    },
    {
      heading: "Odpovědnost a záruka",
      body:
        "Zakázky zpracováváme s maximální odbornou péčí. Odpovídáme za shodu dodaných dílů s dohodnutou dokumentací a technickými specifikacemi. Za škody způsobené nesprávnými nebo neúplnými podklady poskytnutými klientem neneseme odpovědnost.",
    },
    {
      heading: "Závěrečná ustanovení",
      body:
        "Konkrétní smluvní podmínky mohou být upřesněny v individuální smlouvě nebo objednávce. Tento text je pracovním návrhem a nepředstavuje právní poradenství.",
    },
  ],
  en: [
    {
      heading: "Introductory provisions",
      body:
        "This document outlines the basic commercial terms for services provided by DakuTec (DK CAM Studio), in particular CNC machining, CAM programming, and prototype manufacturing. The text is a working draft and does not replace individual contractual agreements.",
    },
    {
      heading: "RFQs and quotations",
      body:
        "You can submit a non-binding RFQ via the contact form or RFQ form. Based on the information and documentation you provide, we prepare a quotation that typically includes a service description, indicative lead time, and price. An order becomes binding only once the quotation has been accepted by both parties.",
    },
    {
      heading: "Delivery terms",
      body:
        "Lead times are agreed individually, depending on the scope of work, material availability, and production capacity. In case of unforeseen circumstances, we reserve the right to adjust the delivery date in agreement with the client.",
    },
    {
      heading: "Liability and warranty",
      body:
        "We execute all orders with the utmost professional care. We are responsible for the conformity of delivered parts with the agreed technical documentation and specifications. We are not liable for damages resulting from incorrect or incomplete data provided by the client.",
    },
    {
      heading: "Final provisions",
      body:
        "Specific contractual terms can be further specified in an individual contract or purchase order. This text is a working draft and does not constitute legal advice.",
    },
  ],
  de: [
    {
      heading: "Einleitende Bestimmungen",
      body:
        "Dieses Dokument fasst die grundlegenden Geschäftsbedingungen für die Dienstleistungen von DakuTec (DK CAM Studio) zusammen, insbesondere im Bereich CNC-Bearbeitung, CAM-Programmierung und Prototypenfertigung. Der Text ist ein Arbeitsentwurf und ersetzt keine individuellen vertraglichen Vereinbarungen.",
    },
    {
      heading: "Anfragen und Angebote",
      body:
        "Unverbindliche Anfragen können Sie über das Kontaktformular oder das RFQ-Formular senden. Auf Basis Ihrer Unterlagen erstellen wir ein Angebot, das in der Regel eine Leistungsbeschreibung, einen unverbindlichen Liefertermin und den Preis enthält. Ein Auftrag wird erst mit der Annahme des Angebots durch beide Parteien verbindlich.",
    },
    {
      heading: "Lieferbedingungen",
      body:
        "Liefertermine werden individuell unter Berücksichtigung des Auftragsumfangs, der Materialverfügbarkeit und der Produktionskapazitäten vereinbart. Bei unvorhersehbaren Umständen behalten wir uns das Recht vor, den Liefertermin in Abstimmung mit dem Kunden anzupassen.",
    },
    {
      heading: "Haftung und Gewährleistung",
      body:
        "Wir bearbeiten Aufträge mit größtmöglicher Sorgfalt. Wir haften für die Übereinstimmung der gelieferten Teile mit der vereinbarten technischen Dokumentation und den Spezifikationen. Für Schäden, die aus falschen oder unvollständigen Unterlagen des Kunden entstehen, übernehmen wir keine Haftung.",
    },
    {
      heading: "Schlussbestimmungen",
      body:
        "Konkrete vertragliche Bedingungen können in einem individuellen Vertrag oder einer Bestellung näher geregelt werden. Dieser Text ist ein Arbeitsentwurf und stellt keine Rechtsberatung dar.",
    },
  ],
};

export async function generateMetadata(
  { params: { locale } }: PageProps,
): Promise<Metadata> {
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const title = t.legal?.terms ?? "Terms & Conditions";
  const description =
    t.meta?.description ??
    t.hero?.subtitle ??
    "Basic commercial terms for services provided by DakuTec.";
  return {
    title,
    description,
  };
}

export default async function TermsPage({ params: { locale } }: PageProps) {
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const sections = TERMS_SECTIONS[locale] ?? TERMS_SECTIONS.en;

  return (
    <main className="container-app py-12">
      <Section
        eyebrow={t.legal?.title ?? "Legal"}
        title={t.legal?.terms ?? "Terms & Conditions"}
        intro={
          locale === "cs"
            ? "Níže najdete pracovní znění základních obchodních podmínek pro poskytování našich služeb."
            : locale === "de"
            ? "Nachfolgend finden Sie einen Arbeitsentwurf der grundlegenden Geschäftsbedingungen für unsere Dienstleistungen."
            : "Below you can find a working draft of the basic commercial terms for our services."
        }
      >
        <div className="panel pattern-card space-y-6">
          {sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              <p className="muted leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </Section>
    </main>
  );
}
