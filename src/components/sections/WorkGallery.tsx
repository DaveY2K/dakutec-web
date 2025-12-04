// src/components/sections/WorkGallery.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import type { WorkItem } from "@/i18n/types/work";


// ⬆️ nahoře u importů přidej typy:
import {
  type Variants,
  type Transition,
} from "framer-motion";


type Props = {
  title: string;
  subtitle?: string;
  filterAllLabel: string;
  shuffleLabel: string;
  items: WorkItem[];
};

/* ===== Seeded shuffle (deterministic) ===== */
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle<T>(arr: readonly T[], seedStr: string): T[] {
  const seed = xmur3(seedStr)();
  const rnd = mulberry32(seed);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ===== Motion variants ===== */


/* ===== Přidej typed transition a Variants ===== */
const springTrans: Transition = {
  type: "spring",       // ← teď je to string literal, ne obecný string
  stiffness: 360,
  damping: 30,
  mass: 0.55,
};




const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const cardVariants: Variants = {
  hidden: { y: 22, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: springTrans, // ← používá typed Transition
  },
};
export default function WorkGallery({
  title, subtitle, filterAllLabel, shuffleLabel, items
}: Props) {
  const prefersReduced = useReducedMotion();
  const [selectedTag, setSelectedTag] = useState<string>("__all");
  const [clientSeed, setClientSeed] = useState<string>("seed");

  // Unikátní štítky z dat
  const tags = useMemo<string[]>(() => {
    const t = new Set<string>();
    for (const i of items) if (Array.isArray(i.tags)) for (const x of i.tags) t.add(x);
    return Array.from(t);
  }, [items]);

  // Filtrované + promíchané položky (layout animace pro přeskládání)
  const filtered = useMemo<WorkItem[]>(() => {
    const base = seededShuffle(items, clientSeed);
    return selectedTag === "__all" ? base : base.filter(i => i.tags?.includes(selectedTag));
  }, [items, selectedTag, clientSeed]);

  const reshuffle = useCallback(() => {
    setClientSeed(prev => `${prev}-${Math.random().toString(36).slice(2, 6)}`);
  }, []);

  // Lightbox
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => setActive(i => (i === null ? null : (i - 1 + filtered.length) % filtered.length)), [filtered.length]);
  const next = useCallback(() => setActive(i => (i === null ? null : (i + 1) % filtered.length)), [filtered.length]);
  const activeItem: WorkItem | undefined = active !== null ? filtered[active] : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, close]);

  return (
    <section className="py-12 sm:py-16">
      <div className="container-app">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
        </div>

        {/* Ovládání */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <motion.button
            whileTap={{ scale: prefersReduced ? 1 : 0.98 }}
            whileHover={{ y: prefersReduced ? 0 : -1 }}
            className={`px-3 py-1.5 rounded-full text-sm border 
              ${selectedTag === "__all" ? "bg-zinc-800 border-zinc-700" : "border-zinc-700 hover:bg-zinc-800/60"}`}
            onClick={() => setSelectedTag("__all")}
          >
            {filterAllLabel}
          </motion.button>

          {tags.map(tag => (
            <motion.button
              key={tag}
              whileTap={{ scale: prefersReduced ? 1 : 0.98 }}
              whileHover={{ y: prefersReduced ? 0 : -1 }}
              className={`px-3 py-1.5 rounded-full text-sm border 
                ${selectedTag === tag ? "bg-zinc-800 border-zinc-700" : "border-zinc-700 hover:bg-zinc-800/60"}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </motion.button>
          ))}

          <div className="grow" />
          <motion.button
            whileTap={{ scale: prefersReduced ? 1 : 0.98 }}
            whileHover={{ y: prefersReduced ? 0 : -1 }}
            onClick={reshuffle}
            className="px-3 py-1.5 rounded-md text-sm border border-zinc-700 hover:bg-zinc-800/60"
            aria-label={shuffleLabel}
            title={shuffleLabel}
          >
            {shuffleLabel}
          </motion.button>
        </div>

        {/* Grid se stagger animací + layout přeskupení */}
        <LayoutGroup id="gallery">
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence initial={false}>
              {filtered.map((item, idx) => (
                <motion.article
                  key={item.image}                // stabilní key kvůli layoutId
                  variants={cardVariants}
                  layout                              // animuje přeskládání
                  whileHover={{ y: prefersReduced ? 0 : -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 will-change-transform"
                >
                  <motion.div
                    layoutId={`img-${item.image}`}   // shared element do lightboxu
                    className="relative aspect-[4/3]"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                     
                      className="object-cover"
                      priority={false}
                    />
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: prefersReduced ? 0.7 : 0.9 }}
                    />
                    {item.placeholder && (
                      <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-zinc-200 border border-white/10">
                        sample
                      </span>
                    )}
                  </motion.div>

                  <div className="p-4">
                    <h3 className="font-medium">{item.title}</h3>
                    {item.caption && <p className="mt-1 text-sm text-zinc-400">{item.caption}</p>}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tags.map((t) => (
                          <span key={t} className="rounded-full bg-zinc-800/60 border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <motion.button
                      whileTap={{ scale: prefersReduced ? 1 : 0.98 }}
                      onClick={() => setActive(idx)}
                      className="mt-3 text-sm text-zinc-300 hover:text-white underline underline-offset-4"
                    >
                      Zvětšit
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* LIGHTBOX se sdíleným layoutId a fade/scale */}
          <AnimatePresence>
            {activeItem && (
              <motion.div
                key="overlay"
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                onClick={close}
              >
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <motion.div
                    layoutId={`img-${activeItem.image}`} // shared element
                    onClick={(e) => e.stopPropagation()}
                    initial={{ borderRadius: 16 }}
                    animate={{ borderRadius: 12 }}
                    exit={{ borderRadius: 16 }}
                   className="relative w-full max-w-[min(100vw-2rem,var(--container-w))]">
                    <Image
                      src={activeItem.image}
                      alt={activeItem.title}
                      width={1600}
                      height={1000}
                      className="w-full h-auto rounded-xl"
                      priority
                    />

                    {/* Ovládání */}
                    <motion.button
                      whileTap={{ scale: prefersReduced ? 1 : 0.95 }}
                      onClick={(e)=>{e.stopPropagation();prev();}}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 hover:bg-black/80"
                      aria-label="Previous"
                    >‹</motion.button>

                    <motion.button
                      whileTap={{ scale: prefersReduced ? 1 : 0.95 }}
                      onClick={(e)=>{e.stopPropagation();next();}}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 hover:bg-black/80"
                      aria-label="Next"
                    >›</motion.button>

                    <motion.button
                      whileTap={{ scale: prefersReduced ? 1 : 0.95 }}
                      onClick={(e)=>{e.stopPropagation();close();}}
                      className="absolute right-2 top-2 rounded-md bg-black/60 px-3 py-1.5 text-sm hover:bg-black/80"
                      aria-label="Close"
                    >
                      Close
                    </motion.button>

                    <div className="absolute left-3 bottom-3 text-sm text-zinc-200">
                      {activeItem.title}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
