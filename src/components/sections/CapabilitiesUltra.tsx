// src/components/sections/CapabilitiesUltra.tsx
import Section from "@/components/sections/Section";

type Item = {
  label?: string;
  value?: string;
};

type Props = {
  title?: string;
  intro?: string;
  items: Item[];
};

export default function CapabilitiesUltra({ title, intro, items }: Props) {
  const heading = title ?? "Capabilities & technology";
  const subtitle =
    intro ?? "What we routinely make and the tools we use.";

  return (
    <Section title={heading} intro={subtitle}>
      <div className="mt-6 grid gap-4 md:gap-6 md:grid-cols-2">
        {items.map((it, idx) => (
          <div
            key={it.label ?? idx}
            className="panel pattern-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
          >
            {it.label && (
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(160,160,160)]">
                {it.label}
              </p>
            )}

            {it.value && (
              <p className="mt-2 text-base sm:text-lg leading-relaxed">
                {it.value}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        Values are indicative; achievable specs depend on geometry, setup and tooling.
      </p>
    </Section>
  );
}
