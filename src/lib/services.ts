export const SERVICE_SLUGS = [
  "milling",
  "turning",
  "cam",
  "prototyping",
  "toolpath",
  "quality",
] as const;

export type ServiceSlug = typeof SERVICE_SLUGS[number];

export const isServiceSlug = (s: unknown): s is ServiceSlug =>
  typeof s === "string" && (SERVICE_SLUGS as readonly string[]).includes(s);
