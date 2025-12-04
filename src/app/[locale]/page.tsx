// app/[locale]/page.tsx
import { getDictionary, isLocale, type Locale } from "@/i18n";
import Hero from "@/components/ui/Hero";
import Services from "@/components/ui/Services";
//import Capabilities from "@/components/sections/Capabilities";
import CtaRfq from "@/components/sections/CtaRfq";
import WorkGallery from "@/components/sections/WorkGallery";
import type { WorkItem as GalleryItem } from "@/i18n/types/work";
import CapabilitiesUltra from "@/components/sections/CapabilitiesUltra";

import {  normalizeProcess, normalizeCases } from "@/i18n/guards";

// ...
import ProcessSteps from "@/components/sections/ProcessSteps";
import CasesTeaser from "@/components/sections/CasesTeaser";

import Industries from "@/components/sections/Industries";
//import CapabilitiesPlus from "@/components/sections/CapabilitiesPlus";
/* ===================== Konstanty ===================== */
export const SERVICE_SLUGS = [
  "milling",
  "turning",
  "cam",
  "prototyping",
  "toolpath",
  "quality",
] as const;
export type ServiceSlug = typeof SERVICE_SLUGS[number];

/* ===================== Lokální typy ===================== */
type ServiceItem = { title?: string; description?: string; slug: ServiceSlug };
type CapabilityItem = { label?: string; value?: string };
type IndustryItem = { title: string; desc?: string; icon?: string };

type IndustriesDict = {
  title?: string;
  subtitle?: string;
  items?: unknown;
};

type WorkDict = {
  items?: unknown;
  industries?: IndustriesDict;
};



/* ===================== Helpery ===================== */
const toStr = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

const toStrArr = (v: unknown): string[] | undefined =>
  Array.isArray(v) && v.every((x) => typeof x === "string") ? (v as string[]) : undefined;

/* ===================== Mapování slovníků ===================== */
// Služby v pevném pořadí a se stabilními slugs
const mapServices = (items: unknown): ServiceItem[] => {
  const arr: Array<Record<string, unknown>> = Array.isArray(items)
    ? (items.filter((it): it is Record<string, unknown> => !!it && typeof it === "object"))
    : [];

  return SERVICE_SLUGS.map((slug, i) => {
    const r = arr[i] ?? {};
    return {
      title: toStr(r.title),
      description: toStr(r.description),
      slug,
    };
  });
};

const mapCapabilities = (items: unknown): CapabilityItem[] =>
  Array.isArray(items)
    ? items
        .map((it) => (it ?? {}) as Record<string, unknown>)
        .map((r) => ({ label: toStr(r.label), value: toStr(r.value) }))
    : [];

// Normalizace pro WorkGallery (neutrální galerie dílů)
const mapWorkGallery = (items: unknown): GalleryItem[] =>
  Array.isArray(items)
    ? items.flatMap((it) => {
        if (!it || typeof it !== "object") return [];
        const r = it as Record<string, unknown>;
        const title = toStr(r.title); 
        const image = toStr(r.image);
        if (!title || !image) return [];
        return [{
          title,
          image,
          tags: toStrArr(r.tags),
          caption: toStr(r.caption),
          placeholder: typeof r.placeholder === "boolean" ? r.placeholder : undefined,
        } satisfies GalleryItem];
      })
    : [];



const mapIndustries = (items: unknown): IndustryItem[] =>
  Array.isArray(items)
    ? items.flatMap((it) => {
        if (!it || typeof it !== "object") return [];
        const r = it as Record<string, unknown>;
        const title = toStr(r.title);
        const desc = toStr(r.desc);
        const icon = toStr(r.icon);
        if (!title) return [];
        return [{ title, desc, icon }];
      })
    : [];




/* ===================== Stránka ===================== */
export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  // (RSC) v novějších verzích Nextu je params Promise – proto await tady v server komponentě.
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw ?? "") ? (raw as Locale) : "en";
const t = await getDictionary(locale);

// mezivrstva kvůli TS – rozšířený typ pro work/industries, bez any
const workDict: WorkDict = (t as { work?: WorkDict }).work ?? {};
const industriesDict: IndustriesDict = workDict.industries ?? {};

const serviceItems = mapServices(t.services?.items);
const capabilityItems = mapCapabilities(t.capabilities?.items);
const workGalleryItems = mapWorkGallery(workDict.items);
const industryItems = mapIndustries(industriesDict.items);
const processSteps = normalizeProcess(t.process?.items);
const caseItems = normalizeCases(t.cases?.items);


  //const proofItems   = normalizeProof(t.proof?.items);
  return (
  <>
    {(t.hero?.title || t.hero?.subtitle || t.hero?.eyebrow) && (
      <Hero
        eyebrow={t.hero?.eyebrow}
        title={t.hero?.title}
        subtitle={t.hero?.subtitle}
        ctaPrimary={
          t.hero?.ctaPrimary
            ? { label: t.hero.ctaPrimary, href: `/${locale}/rfq` }
            : undefined
        }
        ctaSecondary={
          t.hero?.ctaSecondary
            ? { label: t.hero.ctaSecondary, href: `/${locale}/services` }
            : undefined
        }
      />
    )}

    <Services
  title={t.services?.title}
  intro={t.services?.intro}
  items={serviceItems}
  locale={locale}
  moreLabel={t.services?.more}
/>


<Industries
  title={
    industriesDict.title ??
    t.work?.industriesTitle ??
    "Industries & use-cases"
  }
  intro={industriesDict.subtitle}
  items={
    industryItems.length
      ? industryItems
      : [
          { title: "Robotics & automation",  desc: "Fixtures, brackets, housings.", icon: "wrench" },
          { title: "Aerospace prototypes",   desc: "Precision, thin walls, Al 7075.", icon: "rocket" },
          { title: "Motorsport",             desc: "Small batches, fast lead times.", icon: "gauge" },
          { title: "Defense",                desc: "Traceability, QC reports.", icon: "shield" },
        ]
  }
/>



  {/* ✅ 1) Schopnosti / Capabilities */}
    <CapabilitiesUltra
      title={t.capabilities?.title}
      intro={t.capabilities?.intro}
      items={capabilityItems}
    />

 


<WorkGallery
  title={t.work?.title ?? "Parts gallery"}
  subtitle={t.work?.subtitle}
  filterAllLabel={t.work?.filterAll ?? "All"}
  shuffleLabel={t.work?.shuffle ?? "Shuffle"}
  items={workGalleryItems}
/>

      {processSteps.length > 0 && (
        <ProcessSteps
          title={t.process?.title}
          steps={processSteps}
          ctaHref={`/${locale}/rfq`}
          ctaLabel={t.ctaRfq?.buttonLabel ?? "Poptat výrobu"}
        />
      )}

      {caseItems.length > 0 && (
        <CasesTeaser
          title={t.cases?.title}
          subtitle={t.cases?.subtitle}
          items={caseItems}
          locale={locale}
        />
      )}







      <CtaRfq
        locale={locale}
        title={t.ctaRfq?.title}
        subtitle={t.ctaRfq?.subtitle}
        buttonLabel={t.ctaRfq?.buttonLabel}
      />
    </>
  );
}

/* (volitelné – prebuild lokálních variant) */
export function generateStaticParams(): Array<{ locale: Locale }> {
  return [{ locale: "cs" }, { locale: "en" }, { locale: "de" }];
}
