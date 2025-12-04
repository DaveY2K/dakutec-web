"use client";
import { motion, type Variants } from "framer-motion";
import { Clock, Package, BadgeCheck, Gauge, Layers, Microscope, Euro, Zap } from "lucide-react";
import type { ProofItem } from "@/i18n/types/site";

type Props = { items: ProofItem[] };

const gridV: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const chipV: Variants = { hidden: { y: 8, opacity: 0 }, visible: { y: 0, opacity: 1 } };

function Icon({ kind }: { kind: ProofItem["kind"] }) {
  const cn = "size-4";
  switch (kind) {
    case "response": return <Clock className={cn} />;
    case "batch": return <Package className={cn} />;
    case "tolerance": return <BadgeCheck className={cn} />;
    case "roughness": return <Gauge className={cn} />;
    case "materials": return <Layers className={cn} />;
    case "metrology": return <Microscope className={cn} />;
    case "eu": return <Euro className={cn} />;
    case "express": return <Zap className={cn} />;
    default: return <BadgeCheck className={cn} />;
  }
}

export default function ProofBar({ items }: Props) {
  if (!items.length) return null;
  return (
    <motion.div
      variants={gridV}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="mt-4 flex flex-wrap gap-2"
    >
      {items.map((p, i) => (
        <motion.span
          key={`${p.kind}-${i}`}
          variants={chipV}
          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-zinc-900/40 px-2.5 py-1 text-xs text-zinc-200"
        >
          <Icon kind={p.kind} />
          {p.text}
        </motion.span>
      ))}
    </motion.div>
  );
}
