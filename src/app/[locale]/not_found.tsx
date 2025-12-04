"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import RfqButton from "@/components/ui/RfqButton";

type Locale = "cs" | "en" | "de";

const copy: Record<Locale, {
  title: string;
  desc: string;
  home: string;
  rfq: string;
}> = {
  cs: {
    title: "Stránka nenalezena",
    desc: "Hledaná stránka neexistuje nebo byla přesunuta.",
    home: "Zpět na úvod",
    rfq: "Nezávazná poptávka (RFQ)",
  },
  en: {
    title: "Page not found",
    desc: "The page you’re looking for doesn’t exist or was moved.",
    home: "Go home",
    rfq: "Request a Quote (RFQ)",
  },
  de: {
    title: "Seite nicht gefunden",
    desc: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    home: "Zur Startseite",
    rfq: "Angebotsanfrage (RFQ)",
  },
};

function getLocaleFromPath(pathname?: string): Locale {
  const seg = pathname?.split("/")[1];
  return (seg === "cs" || seg === "en" || seg === "de") ? seg : "en";
}

export default function NotFound() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = copy[locale];

  return (
    <main className="container-app py-16">
      <h1 className="text-3xl font-semibold">{t.title}</h1>
      <p className="muted mt-2">{t.desc}</p>

      <div className="mt-6 flex gap-3">
        <Link className="btn btn-primary" href={`/${locale}`}>
          {t.home}
        </Link>
        <RfqButton
          href={`/${locale}/rfq`}
          label={t.rfq}
          size="sm"
          variant="primary"
        />
      </div>
    </main>
  );
}
