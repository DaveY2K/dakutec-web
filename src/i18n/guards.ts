// src/i18n/guards.ts
import type { WorkDict, WorkItem } from "@/i18n/types/work";
import type { ProofItem, ProcessStep, CaseItem, ProofKind } from "@/i18n/types/site";




const isStr = (v: unknown): v is string => typeof v === "string";
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);
 

const toWorkItem = (x: unknown): WorkItem | null => {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  if (!isStr(o.title) || !isStr(o.image)) return null;
  const item: WorkItem = {
    title: o.title,
    image: o.image,
  };
  if (isStrArr(o.tags)) item.tags = o.tags;
  if (isStr(o.caption)) item.caption = o.caption;
  if (typeof o.placeholder === "boolean") item.placeholder = o.placeholder;
  return item;
};

export function normalizeWork(input: unknown): WorkDict {
  const fallback: WorkDict = {
    title: "Gallery",
    filterAll: "All",
    shuffle: "Shuffle",
    items: [],
  };
  if (!input || typeof input !== "object") return fallback;

  const o = input as Record<string, unknown>;
  const out: WorkDict = {
    title: isStr(o.title) ? o.title : fallback.title,
    subtitle: isStr(o.subtitle) ? o.subtitle : undefined,
    filterAll: isStr(o.filterAll) ? o.filterAll : fallback.filterAll,
    shuffle: isStr(o.shuffle) ? o.shuffle : fallback.shuffle,
    items: Array.isArray(o.items)
      ? o.items.map(toWorkItem).filter((v): v is WorkItem => v !== null)
      : [],
  };
  return out;
}




export function normalizeProof(items: unknown): ProofItem[] {
  const kinds: ReadonlyArray<ProofKind> = [
    "response","batch","tolerance","roughness","materials","metrology","eu","express"
  ];
  const out: ProofItem[] = [];
  if (!Array.isArray(items)) return out;
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const r = it as Record<string, unknown>;
    const kind = r.kind;
    const text = r.text;
    if (isStr(text) && isStr(kind) && (kinds as readonly string[]).includes(kind)) {
      out.push({ kind: kind as ProofKind, text });
    }
  }
  return out;
}

export function normalizeProcess(items: unknown): ProcessStep[] {
  const icons = new Set(["upload","cpu","package"]);
  const out: ProcessStep[] = [];
  if (!Array.isArray(items)) return out;
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const r = it as Record<string, unknown>;
    const title = r.title;
    if (!isStr(title)) continue;
    const step: ProcessStep = { title };
    if (isStr(r.text)) step.text = r.text;
    if (isStr(r.icon) && icons.has(r.icon)) step.icon = r.icon as ProcessStep["icon"];
    out.push(step);
  }
  return out;
}

export function normalizeCases(items: unknown): CaseItem[] {
  const out: CaseItem[] = [];
  if (!Array.isArray(items)) return out;
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const r = it as Record<string, unknown>;
    const slug = r.slug, title = r.title, image = r.image;
    if (!isStr(slug) || !isStr(title) || !isStr(image)) continue;
    const obj: CaseItem = {
      slug, title, image,
      summary: isStr(r.summary) ? r.summary : undefined,
      metrics: isStrArr(r.metrics) ? r.metrics : undefined,
      placeholder: typeof r.placeholder === "boolean" ? r.placeholder : undefined,
    };
    out.push(obj);
  }
  return out;
}
