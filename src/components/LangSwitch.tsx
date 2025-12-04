"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const LOCALES = ["cs", "en", "de"] as const;
type Locale = (typeof LOCALES)[number];

export default function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();

  const change = useCallback(
    (next: Locale) => {
      if (!pathname) return;
      const parts = pathname.split("/");
      if (LOCALES.includes(parts[1] as Locale)) parts[1] = next;
      else parts.splice(1, 0, next);
      const newPath = parts.join("/") || `/${next}`;
      const qs = search?.toString();
      router.replace(qs ? `${newPath}?${qs}` : newPath);
    },
    [pathname, router, search]
  );

  return (
    <div className="segmented">
      {LOCALES.map((l) => (
        <button
          key={l}
          data-active={l === locale}
          onClick={() => change(l)}
          aria-current={l === locale ? "page" : undefined}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
