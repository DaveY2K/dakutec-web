"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import type { CaseItem } from "@/i18n/types/site";

type Props = { title?: string; subtitle?: string; items: CaseItem[]; locale: string };

export default function CasesTeaser({ title, subtitle, items, locale }: Props) {
  if (!items.length) return null;
  return (
    <section className="py-10 sm:py-14">
      <div className="container-app">
        {title && <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>}
        {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(c => (
            <motion.article key={c.slug} whileHover={{ y: -3 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
              <a href={`/${locale}/cases/${c.slug}`} className="block">
                <div className="relative aspect-[4/3]">
                  <Image src={c.image} alt={c.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {c.placeholder && (
                    <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-zinc-200 border border-white/10">
                      sample
                    </span>
                  )}

                  
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-zinc-100">{c.title}</h3>
                  {c.summary && <p className="mt-1 text-sm text-zinc-400">{c.summary}</p>}
                  {c.metrics && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.metrics.map(m => (
                        <span key={m} className="rounded-full bg-zinc-800/60 border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300">{m}</span>
                      ))}
                    </div>
                  )}
                  <span className="mt-3 inline-block text-sm text-sky-300">Read more →</span>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
