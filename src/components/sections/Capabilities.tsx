// schopnosti/spec list – čistě server komponenta
type Item = { label?: string; value?: string };

export default function Capabilities({
  title,
  intro,
  items = [],
}: {
  title?: string;
  intro?: string;
  items?: Item[];
}) {
  if (!title && !intro && (!items || items.length === 0)) return null;

  return (
    <section className="container-app py-12">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      {intro && <p className="muted mt-2">{intro}</p>}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items
          .filter((i) => i?.label || i?.value)
          .map((i, idx) => (
            <div key={idx} className="card p-4">
              {i.label && <div className="text-sm muted">{i.label}</div>}
              {i.value && <div className="mt-0.5">{i.value}</div>}
            </div>
          ))}
      </div>
    </section>
  );
}
