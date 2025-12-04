import Image from "next/image";
import Link from "next/link";

type WorkItem = {
  title?: string;
  summary?: string;         // 1–2 věty
  meta?: string;            // např. "Al 7075 • 25 ks • ±0,02 mm"
  image?: string;           // cesta pod /public (např. "/work/bracket.jpg")
  href?: string;            // volitelný odkaz (detail, PDF, video…)
  tags?: string[];          // krátké štítky
};

export default function SelectedWork({
  title,
  intro,
  items = [],
}: {
  title?: string;
  intro?: string;
  items?: WorkItem[];
}) {
  const list = (items || []).filter(i => i && (i.title || i.image || i.summary));
  if (!title && !intro && list.length === 0) return null;

  return (
    <section className="container-app py-12">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      {intro && <p className="muted mt-2">{intro}</p>}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((it, idx) => {
          const card = (
            <article className="card overflow-hidden">
              {/* obrázek (volitelný) */}
              {it.image ? (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={it.image}
                    alt={it.title ?? ""}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                    priority={idx < 2}
                  />
                </div>
              ) : null}

              <div className="p-5">
                {it.tags && it.tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {it.tags.slice(0, 4).map((t, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-full border border-[rgb(var(--line))]">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {it.title && <h3 className="font-medium">{it.title}</h3>}
                {it.summary && <p className="muted mt-1">{it.summary}</p>}
                {it.meta && <p className="muted text-xs mt-2">{it.meta}</p>}
              </div>
            </article>
          );

          return it.href ? (
            <Link key={idx} href={it.href} className="block hover:opacity-95 transition-opacity">
              {card}
            </Link>
          ) : (
            <div key={idx}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
