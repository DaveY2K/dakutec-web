// src/components/RfqFab.tsx
"use client";

import RfqButton from "@/components/ui/RfqButton";
import type { Locale } from "@/i18n"; // nebo: type Locale = "cs" | "en" | "de";

export default function RfqFab({
  locale,
  label = "Request a Quote (RFQ)",
}: {
  locale: Locale;
  label?: string;
}) {
  return (
    <RfqButton
      href={`/${locale}/rfq`}
      label={label}
      size="lg"
      variant="primary"
      className="fixed bottom-5 right-5 z-40 sm:hidden shadow-lg"
    />
  );
}
