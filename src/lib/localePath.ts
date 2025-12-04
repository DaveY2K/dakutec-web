// src/lib/localePath.ts
import type { Locale } from "@/i18n";
export const lp = (locale: Locale, path = "") => `/${locale}${path}`;
