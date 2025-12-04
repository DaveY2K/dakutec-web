// src/i18n/index.ts
export const locales = ["cs", "en", "de"] as const;
export type Locale = (typeof locales)[number];

import en from "./dictionaries/en.json";
export type Dictionary = typeof en;

export const isLocale = (s: unknown): s is Locale =>
  typeof s === 'string' && (locales as readonly Locale[]).includes(s as Locale);

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case "cs":
      return (await import("./dictionaries/cs.json")).default as Dictionary;
    case "de":
      return (await import("./dictionaries/de.json")).default as Dictionary;
    case "en":
    default:
      return en;
  }
}
