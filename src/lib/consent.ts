// src/lib/consent.ts
export const CONSENT_COOKIE = "site-consent-v1";

export type Consent = {
  necessary: true;         // vždy true
  analytics: boolean;
  marketing: boolean;
  date: string;            // ISO
};

// --- helpers ---
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return m ? decodeURIComponent(m[1]) : null;
}

export function readConsent(): Consent | null {
  try {
    const v = getCookie(CONSENT_COOKIE);
    return v ? (JSON.parse(v) as Consent) : null;
  } catch {
    return null;
  }
}

export function writeConsent(c: Consent, days = 180) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * days;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(c))}; ` +
    `Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function updateConsent(partial: Partial<Omit<Consent, "necessary" | "date">>) {
  const prev = readConsent() ?? { necessary: true, analytics: false, marketing: false, date: "" };
  writeConsent({
    necessary: true,
    analytics: partial.analytics ?? prev.analytics,
    marketing: partial.marketing ?? prev.marketing,
    date: new Date().toISOString(),
  });
}

export function hasConsent(kind: "analytics" | "marketing"): boolean {
  const c = readConsent();
  return !!c?.[kind];
}
