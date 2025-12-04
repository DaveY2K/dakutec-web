// src/i18n/index.ts
// POZOR: v tsconfig musí být "resolveJsonModule": true

export const locales = ["cs", "en", "de"] as const;
export type Locale = (typeof locales)[number];

// Typ slovníku odvozený ze zdrojového en.json
export type Dictionary = typeof import("./dictionaries/en.json");

// Pomůcka: ověření locale z řetězce
export function isLocale(s: string): s is Locale {
  return (locales as readonly string[]).includes(s as Locale);
}

// --- DEV validace struktury slovníku (chytá chyby dřív) ---
function validateDictionary(dict: unknown, locale: Locale) {
  if (!dict || typeof dict !== "object") {
    throw new Error(`[i18n:${locale}] Dictionary must be an object`);
  }
  const d = dict as Dictionary;

  // services.items musí být pole (pokud existuje)
  if (d.services?.items && !Array.isArray(d.services.items)) {
    throw new Error(`[i18n:${locale}] services.items must be an array`);
  }

  // kontrola slugs a bullets (pokud jsou)
  if (Array.isArray(d.services?.items)) {
    type ServiceItem = NonNullable<Dictionary["services"]>["items"][number];
    d.services.items.forEach((it: ServiceItem, i: number) => {
      if (!it || typeof it !== "object") {
        throw new Error(`[i18n:${locale}] services.items[${i}] must be an object`);
      }
      if (typeof it.slug !== "string" || it.slug.trim() === "") {
        throw new Error(
          `[i18n:${locale}] services.items[${i}].slug is missing or not a non-empty string`
        );
      }
      if ("bullets" in it && !Array.isArray(it.bullets)) {
        throw new Error(
          `[i18n:${locale}] services.items[${i}].bullets must be an array of strings if present`
        );
      }
      if (Array.isArray(it.bullets) && !it.bullets.every((x: unknown) => typeof x === "string")) {
        throw new Error(
          `[i18n:${locale}] services.items[${i}].bullets must contain only strings`
        );
      }
    });
  }
}

// Hlavní loader
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  let dict: Dictionary;
  switch (locale) {
    case "cs":
      dict = (await import("./dictionaries/cs.json")).default as Dictionary;
      break;
    case "de":
      dict = (await import("./dictionaries/de.json")).default as Dictionary;
      break;
    case "en":
    default:
      dict = (await import("./dictionaries/en.json")).default as Dictionary;
      break;
  }

  // V DEV režimu hází chyby (rychle najde rozbité slovníky); v produkci je ticho.
  if (process.env.NODE_ENV !== "production") {
    validateDictionary(dict, locale);
  }

  return dict;
}
