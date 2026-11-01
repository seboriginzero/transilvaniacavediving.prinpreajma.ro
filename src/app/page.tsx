import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock, MapPin, Phone, Ticket } from 'lucide-react';
import { getCompanyInfo } from '@/lib/content';
import { getDynamicSettings } from '@/lib/settings';
import { HeroCarousel } from '@/components/HeroCarousel';

export const dynamic = 'force-dynamic';

const DESTINATIONS = [
  {
    href: '/via-ferrata-cetate-dezna',
    img: '/media/via-ferrata/vlcsnap-2023-03-05-14h44m12s820-1.jpg',
    kicker: 'Dezna · Dealul Osoiu',
    title: 'Via Ferrata Cetatea Dezna',
    fact: '600 m · grad B · punte indiană de 25 m',
  },
  {
    href: '/belvedere-moneasa',
    img: '/media/belvedere/belvedere-moneasa-2.jpg',
    kicker: 'Moneasa · marcaj punct roșu',
    title: 'Belvedere și Cariera de Marmură',
    fact: '2,7 km · ~1,5 ore · dificultate mică – medie',
  },
  {
    href: '/pestera-liliecilor',
    img: '/media/pestera-liliecilor/img_20250703_192845_163.jpg',
    kicker: 'Moneasa · bandă albastră',
    title: 'Peștera Liliecilor',
    fact: '1,3 km de traseu · sit arheologic RAN 11487.01',
  },
  {
    href: '/pestera-uscata-de-la-moara',
    img: '/media/sistemul-carstic/whatsapp-image-2026-10-06-at-19.59.12-1-1.jpeg',
    kicker: 'Natura 2000 · ROSCI0042',
    title: 'Sistemul Carstic de la Moară',
    fact: 'Peștera cu Apă de la Moară · 1.750 m',
  },
];

const TIMELINE = [
  { year: '1597', text: 'Prima atestare documentară: donația principelui Sigismund Báthory către Kornis Gáspár.' },
  { year: '1746', text: 'Conscripția consemnează moara de apă care dă numele Dealului Morii.' },
  { year: '1891–1893', text: 'Sunt forate izvoarele mezotermale (24 – 32 °C) și amenajate traseele lui Czárán Gyula.' },
  { year: '1893', text: 'Se deschide calea ferată îngustă Sebiș – Moneasa (23,6 km), activă până în 1962.' },
  { year: '1896', text: '13 mai: Moneasa primește statutul oficial de stațiune balneară.' },
  { year: '1906', text: '19 august: este dezvelită placa comemorativă Czárán Gyula din Moneasa.' },
];

export default function HomePage() {
  const settings = getDynamicSettings();
  const company = getCompanyInfo();
  const g = settings.grotaUrsului;

  return (
    <>
      <HeroCarousel settings={settings} />

      {/* ───────────── Planifică vizita ───────────── */}
      <section aria-labelledby="visit-title" className="border-b border-cavern-700">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <h2 id="visit-title" className="sr-only">
            Informații de vizitare Grota Ursului
          </h2>
          <div className="grid grid-cols-1 divide-y divide-cavern-700 md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
            <div className="py-8 lg:pr-8">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-limestone-400">
                <Clock className="h-3.5 w-3.5 text-karst-400" /> Program Grota Ursului
              </p>
              <p className="mt-3 font-display text-2xl font-semibold text-limestone-50">{g.hours}</p>
              <p className="mt-1 text-sm text-limestone-300">{g.days}</p>
            </div>
            <div className="py-8 lg:px-8">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-limestone-400">
                <Ticket className="h-3.5 w-3.5 text-karst-400" /> Bilete
              </p>
              <p className="mt-3 font-display text-2xl font-semibold text-limestone-50">
                {g.adultPrice} lei <span className="text-base font-normal text-limestone-300">adulți</span>
              </p>
              <p className="mt-1 text-sm text-limestone-300">
                {g.childPrice} lei copii până la 14 ani · sub 5 ani gratuit
              </p>
            </div>
            <div className="py-8 lg:px-8">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-limestone-400">
                <Phone className="h-3.5 w-3.5 text-karst-400" /> Grupuri și programări
              </p>
              <a
                href={`tel:${g.phoneContact.replace(/\s+/g, '')}`}
                className="mt-3 block font-display text-2xl font-semibold text-limestone-50 hover:text-karst-400"
              >
                {g.phoneContact}
              </a>
              <p className="mt-1 text-sm text-limestone-300">Grupuri organizate și în afara programului, pe bază de programare</p>
            </div>
            <div className="py-8 lg:pl-8">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-limestone-400">
                <MapPin className="h-3.5 w-3.5 text-karst-400" /> Locație
              </p>
              <p className="mt-3 font-display text-2xl font-semibold text-limestone-50">Moneasa, Arad</p>
              <a
                href={company.mapsGrotaUrsului}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-karst-400 hover:underline"
              >
                Deschide în Google Maps <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Grota Ursului feature ───────────── */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl lg:col-span-7">
            <img
              src="/media/logos/logo-grota-ursului-2025.jpg"
              alt="Grota Ursului Moneasa"
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
            />
          </div>

          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-karst-400">
              Peștera de la Băi · Grota Ursului
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-limestone-50 sm:text-5xl">
              Un sistem carstic pe două niveluri: fosil și activ.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-limestone-200">
              Denumirea vine de la vechiul Pârâu al Ursului, azi Pârâul Băilor. În 1989, speologii arădeni au
              descoperit în etajul superior fosile ale ursului de cavernă. Traseul turistic amenajat duce până în
              Sala Czárán Gyula, iar traseele de speoturism continuă mult dincolo de el.
            </p>

            <dl className="mt-8 divide-y divide-cavern-700 border-y border-cavern-700">
              {[
                ['Traseu turistic', 'cca. 200 m, electrificat și ghidat'],
                ['Lungime explorată', 'peste 2.500 m'],
                ['Speoturism', '250 m – 1.500 m · 1 – 6 ore'],
                ['Temperatură', g.temperature],
                ['Mineralogie', 'aragonit, calcit, domuri, gururi'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 py-3.5">
                  <dt className="text-sm text-limestone-400">{k}</dt>
                  <dd className="text-right text-sm font-medium text-limestone-50">{v}</dd>
                </div>
              ))}
            </dl>

            <Link
              href="/grota-ursului"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-limestone-50"
            >
              <span className="border-b border-limestone-50/40 pb-0.5 group-hover:border-limestone-50">
                Ghidul complet al peșterii
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── Destinații ───────────── */}
      <section className="border-t border-cavern-700 bg-cavern-900">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-karst-400">
                Munții Codru-Moma
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-limestone-50 sm:text-5xl">
                Trasee și obiective în jurul Moneasei
              </h2>
            </div>
            <Link
              href="/descopera"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-limestone-50"
            >
              <span className="border-b border-limestone-50/40 pb-0.5 group-hover:border-limestone-50">
                Toate obiectivele
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((d) => (
              <Link key={d.href} href={d.href} className="group block">
                <div className="overflow-hidden rounded-2xl bg-black">
                  <img
                    src={d.img}
                    alt={d.title}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-limestone-400">
                  {d.kicker}
                </p>
                <h3 className="mt-2 flex items-start justify-between gap-3 font-display text-xl font-semibold leading-snug text-limestone-50">
                  {d.title}
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-limestone-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-limestone-50" />
                </h3>
                <p className="mt-2 text-sm text-limestone-300">{d.fact}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Istorie ───────────── */}
      <section className="border-t border-cavern-700">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-karst-400">
                Istorie și patrimoniu
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-limestone-50 sm:text-5xl">
                Moneasa și Czárán Gyula
              </h2>
              <p className="mt-6 text-base leading-relaxed text-limestone-200">
                Originar din Șepreuș, Czárán Gyula (1847–1906) este considerat părintele turismului montan în Munții
                Apuseni. A investit resurse proprii în marcarea primelor trasee din regiune, iar la Moneasa a amenajat
                traseele turistice între 1891 și 1893.
              </p>

              <figure className="mt-10 grid grid-cols-2 gap-4">
                <img
                  src="/media/pestera-liliecilor/p1040534.jpg"
                  alt="Portretul lui Czárán Gyula"
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
                <img
                  src="/media/cave-diving/menyhaza1904.webp"
                  alt="Lacul cu pești din Moneasa, carte poștală din 1904"
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
                <figcaption className="col-span-2 text-xs text-limestone-400">
                  Czárán Gyula · „Halastó” (Lacul cu pești), Menyháza, carte poștală din 1904.
                </figcaption>
              </figure>
            </div>

            <div className="lg:col-span-7">
              <ol className="relative border-l border-cavern-700">
                {TIMELINE.map((t) => (
                  <li key={t.year} className="relative pb-10 pl-8 last:pb-0">
                    <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-karst-400" />
                    <p className="font-display text-3xl font-semibold tabular-nums text-limestone-50">{t.year}</p>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-limestone-300">{t.text}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-12 flex flex-wrap gap-3 pl-8">
                <Link
                  href="/statiunea-moneasa"
                  className="inline-flex items-center gap-2 rounded-full bg-limestone-50 px-6 py-3 text-sm font-semibold text-cavern-950 transition hover:opacity-90"
                >
                  Monografia stațiunii <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/czaran-gyula"
                  className="inline-flex items-center gap-2 rounded-full border border-cavern-600 px-6 py-3 text-sm font-semibold text-limestone-50 transition hover:bg-cavern-800"
                >
                  Biografia Czárán Gyula
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Școala Altfel ───────────── */}
      <section className="theme-hero-dark bg-[#0f2a1c] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
              Moneasa Adventure
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Școala Altfel și Săptămâna Verde
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Programe pentru grădinițe, ciclul primar, gimnaziu și liceu: vizită ghidată în Grota Ursului, atelier de
              speologie, drumeție tematică și tiroliană.
            </p>
          </div>
          <Link
            href="/moneasa-adventure"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white/90 lg:self-auto"
          >
            Vezi programele <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
