export type ProofKind =
  | "response" | "batch" | "tolerance" | "roughness" | "materials" | "metrology" | "eu" | "express";

export type ProofItem = { kind: ProofKind; text: string };

export type ProcessStep = { title: string; text?: string; icon?: "upload" | "cpu" | "package" };

export type CaseItem = {
  slug: string;
  title: string;
  summary?: string;
  image: string;        // /public/work/...
  metrics?: string[];   // např. ["Al 7075", "±0,01 mm", "4 dny"]
  placeholder?: boolean;
};
