// src/components/sections/CapabilitiesPlus.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import { Layers, Ruler, BadgeCheck, Gauge, Cpu, Timer } from "lucide-react";

type Item = { label?: string; value?: string };
type Props = { title?: string; intro?: string; items: Item[] };

// --- motion
const spring: Transition = { type: "spring", stiffness: 420, damping: 32, mass: 0.55 };
const gridV: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const cardV: Variants = {
  hidden: { y: 16, opacity: 0, scale: 0.98 },
  visible: { y: 0, opacity: 1, scale: 1, transition: spring },
};

// --- helpers
const mmToIn = (mm: number) => mm / 25.4;
const μmToμin = (μm: number) => μm * 39.37;

function iconFor(label: string | undefined) {
  if (!label) return <Layers className="size-4" />;
  const l = label.toLowerCase();
  if (l.includes("material")) return <Layers className="size-4" />;
  if (l.includes("max") || l.includes("size")) return <Ruler className="size-4" />;
   if (l.includes("tolerance")) return <BadgeCheck className="size-4" />;
  if (l.includes("roughness") || l.includes("ra")) return <Gauge className="size-4" />;
  if (l.includes("cam")) return <Cpu className="size-4" />;
  if (l.includes("lead")) return <Timer className="size-4" />;
  return <Layers className="size-4" />;
}

// heuristický převod některých textů (když se podaří naparsovat)
function altUnit(label?: string, value?: string, useImperial?: boolean): string | null {
  if (!value) return null;

  // Max. part size: "X 500 × Y 400 × Z 300 mm"
  const sizeMatch = value.match(/x\s*([\d.]+)\s*[×x]\s*y\s*([\d.]+)\s*[×x]\s*z\s*([\d.]+)\s*mm/i);
  if (sizeMatch) {
    const [ , x, y, z ] = sizeMatch;
    const xi = mmToIn(parseFloat(x));
    const yi = mmToIn(parseFloat(y));
    const zi = mmToIn(parseFloat(z));
    return useImperial
      ? `X ${xi.toFixed(1)}″ × Y ${yi.toFixed(1)}″ × Z ${zi.toFixed(1)}″`
      : `X ${x} × Y ${y} × Z ${z} mm`;
  }

  // Tolerance: "±0.01 mm"
  const tol = value.match(/±\s*([\d.]+)\s*mm/i);
  if (tol) {
    const mm = parseFloat(tol[1]);
    const inch = mmToIn(mm);
    return useImperial ? `±${inch.toFixed(4)}″` : `±${mm} mm`;
  }

  // Roughness: "Ra 1.6 μm"
  const ra = value.match(/ra\s*([\d.]+)\s*[μu]m/i);
  if (ra) {
    const μm = parseFloat(ra[1]);
    const μin = μmToμin(μm);
    return useImperial ? `Ra ${Math.round(μin)} µin` : `Ra ${μm} µm`;
  }

  return null;
}

export default function CapabilitiesPlus({ title, intro, items }: Props) {
  const [imperial, setImperial] = useState(false);

  const enriched = useMemo(() => {
    return items.map((it) => {
      const alt = altUnit(it.label, it.value, imperial);
      return { ...it, primary: alt ?? it.value, secondary: alt ? it.value : undefined };
    });
  }, [items, imperial]);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-end gap-3">
          <div className="grow">
            {title && <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>}
            {intro && <p className="mt-2 text-sm text-zinc-400">{intro}</p>}
          </div>

          {/* mm ⇄ inch toggle */}
          <div className="flex items-center gap-2">
            <span className={`text-xs ${imperial ? "text-zinc-500" : "text-zinc-200"}`}>mm</span>
            <button
              onClick={() => setImperial(v => !v)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-800/80 ring-1 ring-white/10"
              aria-label="Toggle units"
            >
              <span
                className={`inline-block h-4 w-4 translate-x-1 transform rounded-full bg-zinc-200 transition
                ${imperial ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            <span className={`text-xs ${imperial ? "text-zinc-200" : "text-zinc-500"}`}>inch</span>
          </div>
        </div>

        <motion.div
          variants={gridV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2"
        >
          {enriched.map((it, i) => (
            <motion.div
              key={`${it.label}-${i}`}
              variants={cardV}
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <div className="flex items-center gap-2 text-zinc-400">
                {iconFor(it.label)}
                <span className="text-xs uppercase tracking-wide">{it.label}</span>
              </div>
              <div className="mt-2 text-lg text-zinc-100 leading-snug">
                {it.primary ?? it.value}
              </div>
              {it.secondary && (
                <div className="text-xs text-zinc-500 mt-1">
                  {it.secondary}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* jemná poznámka */}
        <p className="mt-3 text-xs text-zinc-500">
          Values are indicative; achievable specs depend on geometry, setup and tooling.
        </p>
      </div>
    </section>
  );
}
