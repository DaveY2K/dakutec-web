// src/components/sections/CtaRfq.tsx
import clsx from "clsx";
import RfqButton from "@/components/ui/RfqButton";

type Locale = "cs" | "en" | "de";

type Props = {
  locale: Locale;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  /** Volitelné přepsání defaultních benefitů */
  benefits?: string[];
  /** Volitelný className obalu pro jemné ladění */
  className?: string;
};

export default function CtaRfq({
  locale,
  title,
  subtitle,
  buttonLabel,
  benefits,
  className,
}: Props) {
  // fallbacky podle jazyka (když nepřijde ze slovníku)
  const defaultButton: Record<Locale, string> = {
    cs: "Poptat výrobu (RFQ)",
    en: "Request a Quote (RFQ)",
    de: "Angebot anfragen (RFQ)",
  };

  const defaultBenefits: Record<Locale, string[]> = {
    cs: ["Odpověď do 24 hodin", "NDA na vyžádání", "Kontrola vyrobitelnosti zdarma"],
    en: ["Reply within 24 hours", "NDA on request", "Free manufacturability check"],
    de: ["Antwort innerhalb von 24 Stunden", "NDA auf Anfrage", "Kostenlose Herstellbarkeitsprüfung"],
  };

  const list = benefits ?? defaultBenefits[locale];
  const cta = buttonLabel ?? defaultButton[locale];

  // Když by nebylo úplně nic k zobrazení, nevykresluj
  if (!title && !subtitle && !cta) return null;

  const listId = "rfq-benefits";

  return (
    <section className={clsx("container-app py-12", className)}>
      <div
        className={clsx(
          "card relative overflow-hidden p-6 md:p-7",
          "supports-[backdrop-filter]:bg-white/5 bg-white/7",
          "flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        )}
      >
        <div className="min-w-0">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="muted mt-1">{subtitle}</p>}
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
          {cta && (
            <RfqButton
              href={`/${locale}/rfq`}
              label={cta}
              size="lg"
              variant="primary"
              // pokud chceš a11y napojit na seznam výhod, můžeme RfqButton rozšířit o describedBy prop
            />
          )}

          {list.length > 0 && (
            <ul
              id={listId}
              className="text-sm text-slate-400 list-disc pl-5 sm:pl-6 leading-6"
            >
              {list.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
