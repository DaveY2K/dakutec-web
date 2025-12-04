import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Section from "@/components/sections/Section";
import { getDictionary, isLocale, type Locale } from "@/i18n";

type PageProps = {
  params: { locale: Locale };
};

const PRIVACY_SECTIONS: Record<
  Locale,
  Array<{ heading: string; body: string }>
> = {
  cs: [
    {
      heading: "Správce osobních údajů",
      body:
        "Správcem osobních údajů je DakuTec (DK CAM Studio). Osobní údaje zpracováváme pouze v rozsahu nezbytném pro komunikaci se zákazníky, vyřízení poptávek a plnění smluv.",
    },
    {
      heading: "Jaké údaje zpracováváme",
      body:
        "Typicky zpracováváme identifikační a kontaktní údaje (jméno, e-mail, telefon, název společnosti) a informace související s Vaší poptávkou nebo projektem. Údaje získáváme zejména prostřednictvím kontaktního formuláře a RFQ formuláře.",
    },
    {
      heading: "Cookies a analytika",
      body:
        "Na webu používáme pouze technicky nezbytné cookies a případně anonymizované analytické nástroje. O používání cookies vás informujeme v cookie banneru, kde můžete nastavení kdykoli upravit.",
    },
    {
      heading: "Doba uchování údajů",
      body:
        "Osobní údaje uchováváme pouze po dobu nezbytnou pro vyřízení poptávky, trvání smluvního vztahu a plnění zákonných povinností. Poté jsou údaje bezpečně smazány nebo anonymizovány.",
    },
    {
      heading: "Vaše práva",
      body:
        "Máte právo na přístup k osobním údajům, jejich opravu či výmaz, omezení zpracování a námitku proti zpracování. V případě pochybností o zákonnosti zpracování máte právo obrátit se na dozorový úřad.",
    },
    {
      heading: "Kontakt pro otázky k ochraně osobních údajů",
      body:
        "Pro jakékoli dotazy nebo uplatnění vašich práv v oblasti ochrany osobních údajů nás můžete kontaktovat na e-mailu info@dakutec.com.",
    },
  ],
  en: [
    {
      heading: "Data controller",
      body:
        "The data controller is DakuTec (DK CAM Studio). We process personal data only to the extent necessary to communicate with clients, handle RFQs, and fulfil contractual obligations.",
    },
    {
      heading: "What data we process",
      body:
        "We typically process identification and contact details (name, e-mail, phone number, company name) and information related to your RFQ or project. We obtain this data mainly via the contact form and RFQ form.",
    },
    {
      heading: "Cookies and analytics",
      body:
        "Our website uses only technically necessary cookies and, optionally, anonymised analytics tools. You are informed about cookies in the cookie banner, where you can adjust your preferences at any time.",
    },
    {
      heading: "Data retention",
      body:
        "We retain personal data only for as long as necessary to handle your RFQ, maintain our contractual relationship, and comply with legal obligations. Afterwards, the data is securely deleted or anonymised.",
    },
    {
      heading: "Your rights",
      body:
        "You have the right to access your personal data, to have it rectified or erased, to restrict processing, and to object to processing. If you believe your data is being processed unlawfully, you may contact the relevant supervisory authority.",
    },
    {
      heading: "Contact",
      body:
        "For any questions regarding data protection or to exercise your rights, please contact us at info@dakutec.com.",
    },
  ],
  de: [
    {
      heading: "Verantwortlicher für die Datenverarbeitung",
      body:
        "Verantwortlich für die Verarbeitung personenbezogener Daten ist DakuTec (DK CAM Studio). Wir verarbeiten personenbezogene Daten nur in dem Umfang, der für die Kommunikation mit Kunden, die Bearbeitung von Anfragen und die Erfüllung vertraglicher Pflichten erforderlich ist.",
    },
    {
      heading: "Welche Daten wir verarbeiten",
      body:
        "Typischerweise verarbeiten wir Identifikations- und Kontaktdaten (Name, E-Mail-Adresse, Telefonnummer, Firmenname) sowie Informationen, die mit Ihrer Anfrage oder Ihrem Projekt zusammenhängen. Diese Daten erhalten wir insbesondere über das Kontaktformular und das RFQ-Formular.",
    },
    {
      heading: "Cookies und Analyse",
      body:
        "Auf der Website verwenden wir nur technisch notwendige Cookies und gegebenenfalls anonymisierte Analysewerkzeuge. Über die Verwendung von Cookies informieren wir Sie im Cookie-Banner, in dem Sie Ihre Einstellungen jederzeit anpassen können.",
    },
    {
      heading: "Speicherdauer",
      body:
        "Personenbezogene Daten speichern wir nur so lange, wie es für die Bearbeitung Ihrer Anfrage, die Dauer der Geschäftsbeziehung und die Erfüllung gesetzlicher Pflichten erforderlich ist. Anschließend werden die Daten sicher gelöscht oder anonymisiert.",
    },
    {
      heading: "Ihre Rechte",
      body:
        "Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer personenbezogenen Daten, auf Einschränkung der Verarbeitung sowie das Recht auf Widerspruch. Im Falle von Zweifeln an der Rechtmäßigkeit der Verarbeitung können Sie sich an die zuständige Aufsichtsbehörde wenden.",
    },
    {
      heading: "Kontakt",
      body:
        "Für Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte können Sie uns unter info@dakutec.com kontaktieren.",
    },
  ],
};

export async function generateMetadata(
  { params: { locale } }: PageProps,
): Promise<Metadata> {
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const title = t.legal?.privacy ?? "Privacy Policy";
  const description =
    t.meta?.description ??
    t.hero?.subtitle ??
    "Information about how DakuTec processes personal data.";
  return {
    title,
    description,
  };
}

export default async function PrivacyPage({ params: { locale } }: PageProps) {
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const sections = PRIVACY_SECTIONS[locale] ?? PRIVACY_SECTIONS.en;

  return (
    <main className="container-app py-12">
      <Section
        eyebrow={t.legal?.title ?? "Legal"}
        title={t.legal?.privacy ?? "Privacy Policy"}
        intro={
          locale === "cs"
            ? "Na této stránce najdete informace o tom, jak nakládáme s osobními údaji a cookies."
            : locale === "de"
            ? "Auf dieser Seite finden Sie Informationen darüber, wie wir mit personenbezogenen Daten und Cookies umgehen."
            : "On this page you will find information about how we handle personal data and cookies."
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
