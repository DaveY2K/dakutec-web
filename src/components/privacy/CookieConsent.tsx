"use client";

import { useEffect, useState } from "react";
import { CONSENT_COOKIE, type Consent } from "@/lib/consent";

type Locale = "cs" | "en" | "de";

type BannerCopy = {
  title: string;
  text: string;
  necessary: string;
  necessaryDesc: string;
  analytics: string;
  analyticsDesc: string;
  marketing: string;
  marketingDesc: string;
  reject: string;
  save: string;
  acceptAll: string;
  note: string;
};

const copy = {
  cs: {
    title: "Nastavení souborů cookie",
    text: "Používáme nezbytné cookies pro chod webu. S Vaším souhlasem také analytické a marketingové cookies.",
    necessary: "Nezbytné",
    necessaryDesc: "Základní funkce webu (bez uložení osobních údajů). Vždy povoleno.",
    analytics: "Analytika",
    analyticsDesc: "Měření návštěvnosti a zlepšování webu.",
    marketing: "Marketing",
    marketingDesc: "Personalizace a remarketing.",
    reject: "Odmítnout",
    save: "Uložit výběr",
    acceptAll: "Přijmout vše",
    note: "Nastavení můžete kdykoli změnit v patičce webu.",
  },
  en: {
    title: "Cookie settings",
    text: "We use essential cookies to run the site. With your consent we also use analytics and marketing cookies.",
    necessary: "Essential",
    necessaryDesc: "Core site functionality (no personal data). Always enabled.",
    analytics: "Analytics",
    analyticsDesc: "Traffic measurement and UX improvements.",
    marketing: "Marketing",
    marketingDesc: "Personalisation and remarketing.",
    reject: "Reject",
    save: "Save selection",
    acceptAll: "Accept all",
    note: "You can change your choice anytime in the site footer.",
  },
  de: {
    title: "Cookie-Einstellungen",
    text: "Wir verwenden notwendige Cookies. Mit Ihrer Zustimmung auch Analyse- und Marketing-Cookies.",
    necessary: "Notwendig",
    necessaryDesc: "Grundfunktionen der Website. Immer aktiviert.",
    analytics: "Analyse",
    analyticsDesc: "Besucherstatistik und Verbesserung der Website.",
    marketing: "Marketing",
    marketingDesc: "Personalisierung und Remarketing.",
    reject: "Ablehnen",
    save: "Auswahl speichern",
    acceptAll: "Alle akzeptieren",
    note: "Sie können Ihre Auswahl jederzeit im Footer ändern.",
  },
} satisfies Record<Locale, BannerCopy>;

function writeConsentCookie(c: { analytics: boolean; marketing: boolean }) {
  const payload: Consent = {
    necessary: true,
    analytics: !!c.analytics,
    marketing: !!c.marketing,
    date: new Date().toISOString(),
  };
  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(payload))}; ` +
    `Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax`;
  window.dispatchEvent(new Event("consentchange"));
}

export default function CookieConsent({
  locale,
  initial,
}: {
  locale: Locale;
  initial?: Consent | null;
}) {
  const t: BannerCopy = copy[locale];

  const [open, setOpen] = useState(!initial);
  const [analytics, setAnalytics] = useState<boolean>(initial?.analytics ?? false);
  const [marketing, setMarketing] = useState<boolean>(initial?.marketing ?? false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-cookie-banner", onOpen);
    return () => window.removeEventListener("open-cookie-banner", onOpen);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[80]">
      <div className="card p-4 md:p-5 max-w-3xl mx-auto border border-[rgb(var(--line))] bg-[rgb(var(--bg))]/95 backdrop-blur shadow-lg">
        <h2 className="text-base font-semibold">{t.title}</h2>
        <p className="muted mt-1 text-sm">{t.text}</p>

        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <label className="flex items-start gap-2 rounded-lg p-2 hover:bg-white/5">
            <input type="checkbox" checked readOnly className="mt-1" />
            <div>
              <div className="font-medium text-sm">{t.necessary}</div>
              <div className="muted text-xs">{t.necessaryDesc}</div>
            </div>
          </label>

          <label className="flex items-start gap-2 rounded-lg p-2 hover:bg-white/5">
            <input
              type="checkbox"
              className="mt-1"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            <div>
              <div className="font-medium text-sm">{t.analytics}</div>
              <div className="muted text-xs">{t.analyticsDesc}</div>
            </div>
          </label>

          <label className="flex items-start gap-2 rounded-lg p-2 hover:bg-white/5">
            <input
              type="checkbox"
              className="mt-1"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
            <div>
              <div className="font-medium text-sm">{t.marketing}</div>
              <div className="muted text-xs">{t.marketingDesc}</div>
            </div>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <button
            className="btn"
            onClick={() => {
              writeConsentCookie({ analytics: false, marketing: false });
              setOpen(false);
            }}
          >
            {t.reject}
          </button>
          <button
            className="btn"
            onClick={() => {
              writeConsentCookie({ analytics, marketing });
              setOpen(false);
            }}
          >
            {t.save}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              writeConsentCookie({ analytics: true, marketing: true });
              setOpen(false);
            }}
          >
            {t.acceptAll}
          </button>
        </div>

        <p className="muted mt-2 text-xs">{t.note}</p>
      </div>
    </div>
  );
}
