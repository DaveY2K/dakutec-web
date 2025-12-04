// src/components/nav/MobileMenu.tsx
"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import RfqButton from "@/components/ui/RfqButton";
import type { Locale } from "@/i18n";

type Labels = { home: string; services: string; rfq: string; contact: string };

export default function MobileMenu({
  locale,
  labels,
  langSwitch,
}: {
  locale: Locale;                 // ✅ zpřesněný typ
  labels: Labels;
  langSwitch: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Burger – jen mobile */}
      <button
        type="button"
        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--line))] bg-white/5 hover:bg-white/10"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 md:hidden z-[60] bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          className="fixed md:hidden z-[70] top-14 inset-x-4
                     rounded-2xl border border-[rgb(var(--line))]
                     bg-[rgb(var(--bg))]/95 backdrop-blur p-4 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm muted">Menu</span>
            <button
              ref={closeBtnRef}
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <nav className="mt-3 space-y-1">
            <Link
              href={`/${locale}`}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-white/10"
            >
              {labels.home}
            </Link>
            <Link
              href={`/${locale}/services`}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-white/10"
            >
              {labels.services}
            </Link>
            <Link
              href={`/${locale}/contact`}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-white/10"
            >
              {labels.contact}
            </Link>

            {/* ✅ Sjednocená primární CTA přes RfqButton */}
            <RfqButton
              href={`/${locale}/rfq`}
              label={labels.rfq}
              size="lg"
              variant="primary"
              className="mt-2 w-full text-center"
            />

            <div className="mt-3 px-1">{langSwitch}</div>
          </nav>
        </div>
      )}
    </>
  );
}
