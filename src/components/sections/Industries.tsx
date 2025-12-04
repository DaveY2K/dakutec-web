// src/components/sections/Industries.tsx
import Section from "@/components/sections/Section";

type IndustryItem = {
  title: string;
  desc?: string;
  icon?: string; // např. "wrench" | "rocket" | ...
};

type IndustriesProps = {
  title?: string;
  intro?: string;
  items: IndustryItem[];
};

const ICON_MAP: Record<string, string> = {
  wrench: "🔧",
  rocket: "🚀",
  gauge: "🏁",
  shield: "🛡️",
};

export default function Industries({ title, intro, items }: IndustriesProps) {
  const heading = title ?? "Industries & use-cases";
  const subtitle = intro ?? "Where your parts typically end up.";

  return (
    <Section title={heading} intro={subtitle}>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {items.map((item) => {
          const iconChar = item.icon ? ICON_MAP[item.icon] : undefined;

          return (
            <div
              key={item.title}
              className="panel pattern-card h-full rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {iconChar && (
                  <div className="text-xl" aria-hidden="true">
                    {iconChar}
                  </div>
                )}

                <h3 className="text-base sm:text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>

                {item.desc && (
                  <p className="muted text-sm sm:text-[0.95rem] leading-relaxed">
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
