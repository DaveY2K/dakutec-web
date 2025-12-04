type ContactT = {
  title: string;
  reply: string;
  studioName: string;
  addressPlaceholder: string;
  email: string;
  phone: string;
  rfqTitle: string;
  rfqDesc: string;
  rfqBtn: string;
};

export default function ContactSection({ t }: { t: ContactT }) {
  return (
    <section className="container-app py-12">
      <h2 className="text-3xl font-semibold">{t.title}</h2>
      <p className="mt-1 opacity-80">{t.reply}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold">{t.studioName}</h3>
          <p className="mt-2 opacity-80">{t.addressPlaceholder}</p>
          <p className="mt-4">
            {t.email}:{" "}
            <a className="underline" href="mailto:davidkuhejda@gmail.com">
              davidkuhejda@gmail.com
            </a>
          </p>
          <p className="mt-1">{t.phone}: +420 000 000 000</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold">{t.rfqTitle}</h3>
          <p className="mt-2 opacity-80">{t.rfqDesc}</p>
          <link href="/rfq" className="mt-4 inline-block rounded-xl border px-4 py-2">
            {t.rfqBtn}
          </link>
        </div>
      </div>
    </section>
  );
}
