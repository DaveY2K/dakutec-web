"use client";
import { motion, type Variants } from "framer-motion";
import { Upload, Cpu, Package } from "lucide-react";
import type { ProcessStep } from "@/i18n/types/site";
import RfqButton from "@/components/ui/RfqButton";
type Props = { title?: string; steps: ProcessStep[]; ctaHref: string; ctaLabel: string };

const gridV: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const cardV: Variants = { hidden: { y: 14, opacity: 0 }, visible: { y: 0, opacity: 1 } };

function Icon({ name }: { name: ProcessStep["icon"] }) {
  const cn = "size-5";
  switch (name) {
    case "upload": return <Upload className={cn} />;
    case "cpu": return <Cpu className={cn} />;
    case "package": return <Package className={cn} />;
    default: return <Cpu className={cn} />;
  }
}

export default function ProcessSteps({ title, steps, ctaHref, ctaLabel }: Props) {
  if (!steps.length) return null;
  return (
    <section className="py-10 sm:py-14">
      <div className="container-app">
        {title && <h2 className="mb-6 text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>}
        <motion.div variants={gridV} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div key={`${s.title}-${i}`} variants={cardV}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-zinc-900/70 ring-1 ring-white/10">
                  <Icon name={s.icon} />
                </span>
                <span className="text-xs uppercase tracking-wide">Step {i + 1}</span>
              </div>
              <div className="container-app">{s.title}</div>
              {s.text && <p className="mt-1 text-sm text-zinc-400">{s.text}</p>}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-5">
          <RfqButton href={ctaHref} label={ctaLabel} variant="secondary" />
        </div>
      </div>
    </section>
  );
}
