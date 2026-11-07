import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, ArrowRight, Globe, ShieldAlert } from 'lucide-react';
import { getAllPages } from '@/lib/content';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CardMediaThumb } from '@/components/CardMediaThumb';

export const metadata: Metadata = {
  title: 'Descoperă Obiectivele, Peșterile și Traseele din Moneasa & Dezna',
  description:
    'Ghid complet al obiectivelor carstice și montane: Peștera Grota Ursului, Via Ferrata Cetatea Dezna, Belvedere Moneasa & Cariera de Marmură Roșie, Peștera Liliecilor și Sistemul Carstic de la Moară (Natura 2000).',
  alternates: {
    canonical: 'https://transilvaniacavediving.com/descopera',
  },
};

export const dynamic = 'force-dynamic';

export default function DescoperaHubPage() {
  const allPages = getAllPages();
  const primaryPaths = [
    '/grota-ursului',
    '/via-ferrata-cetate-dezna',
    '/belvedere-moneasa',
    '/pestera-liliecilor',
    '/pestera-uscata-de-la-moara',
    '/moneasa-adventure',
  ];

  const destinations = primaryPaths
    .map((p) => allPages.find((page) => page.path === p))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div>
        <Breadcrumbs items={[{ name: 'Descoperă', path: '/descopera' }]} />
        <span className="text-xs font-bold uppercase tracking-wider text-karst-400">
          Patrimoniu Carstic Natural · Munții Codru-Moma · Moneasa & Dezna
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-limestone-50 sm:text-5xl">
          Descoperă Obiectivele, Peșterile și Traseele Montane
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-limestone-200">
          Explorează documentația, hărțile speologice, traseele marcate și condițiile de vizitare pentru obiectivele turistice din zona Stațiunii Moneasa și Dezna (Județul Arad).
        </p>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {destinations.map((dest) => {
          if (!dest) return null;
          return (
            <article
              key={dest.path}
              className="group flex flex-col overflow-hidden rounded-none skeuo-glass transition hover:border-karst-500"
            >
              <Link href={dest.path} className="relative block w-full">
                <CardMediaThumb src={dest.heroImage} alt={dest.cleanTitle} />
                <span className="absolute left-3 top-3 z-20 rounded-none border border-white/20 bg-black/80 px-2.5 py-1 text-[11px] font-bold text-white">
                  {dest.categoryLabel}
                </span>
              </Link>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-limestone-400">
                    <MapPin className="h-3.5 w-3.5 text-karst-400 shrink-0" />
                    <span>{dest.region}</span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-limestone-50 group-hover:text-karst-400">
                    <Link href={dest.path}>{dest.cleanTitle}</Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-limestone-300">
                    {dest.metaDescription}
                  </p>

                  {dest.technicalSpecs && dest.technicalSpecs.length > 0 && (
                    <dl className="mt-4 space-y-1.5 border-t border-cavern-700/80 pt-3 text-xs">
                      {dest.technicalSpecs.slice(0, 3).map((s, idx) => (
                        <div key={idx} className="flex justify-between gap-2">
                          <dt className="text-limestone-400">{s.label}:</dt>
                          <dd className="font-medium text-limestone-100 text-right line-clamp-1">
                            {s.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-cavern-700/80 pt-4">
                  <span className="text-xs font-mono text-limestone-400">
                    {dest.images.length} fotografii · {dest.sections.length} secțiuni
                  </span>
                  <Link
                    href={dest.path}
                    className="inline-flex items-center gap-1 text-xs font-bold text-karst-400"
                  >
                    Deschide pagina <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Multilingual QR Trail Pages Section */}
      <section className="rounded-none skeuo-glass p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-6 w-6 shrink-0 text-karst-400" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold text-limestone-50">
              Panouri Informative cu Cod QR pe Traseele din Moneasa (RO / EN / HU)
            </h2>
            <p className="mt-1 text-sm text-limestone-300">
              Pentru turiștii internaționali care scanează codurile QR amplasate pe panourile tematice de la Peștera Liliecilor și Sistemul Carstic de la Moară, documentația completă este disponibilă și în limbile engleză și maghiară:
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-none border border-cavern-700 bg-cavern-950 p-4">
                <h3 className="text-sm font-bold text-karst-400">
                  Peștera Liliecilor / Citramontán Barlang (Cod RAN 11487.01)
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/pestera-liliecilor"
                    className="rounded-none skeuo-button-secondary px-3 py-1.5 text-xs font-semibold text-limestone-100 hover:text-karst-400"
                  >
                    Română (/pestera-liliecilor)
                  </Link>
                  <Link
                    href="/bat-cave"
                    className="rounded-none skeuo-button-secondary px-3 py-1.5 text-xs font-semibold text-limestone-100 hover:text-karst-400"
                  >
                    English (/bat-cave)
                  </Link>
                  <Link
                    href="/denever-barlang"
                    className="rounded-none skeuo-button-secondary px-3 py-1.5 text-xs font-semibold text-limestone-100 hover:text-karst-400"
                  >
                    Magyar (/denever-barlang)
                  </Link>
                </div>
              </div>

              <div className="rounded-none border border-cavern-700 bg-cavern-950 p-4">
                <h3 className="text-sm font-bold text-karst-400">
                  Sistemul Carstic de la Moară (Natura 2000 ROSCI0042)
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/pestera-uscata-de-la-moara"
                    className="rounded-none skeuo-button-secondary px-3 py-1.5 text-xs font-semibold text-limestone-100 hover:text-karst-400"
                  >
                    Română (/pestera-uscata-de-la-moara)
                  </Link>
                  <Link
                    href="/the-mill-karst-system"
                    className="rounded-none skeuo-button-secondary px-3 py-1.5 text-xs font-semibold text-limestone-100 hover:text-karst-400"
                  >
                    English (/the-mill-karst-system)
                  </Link>
                  <Link
                    href="/a-malom-karsztrendszere"
                    className="rounded-none skeuo-button-secondary px-3 py-1.5 text-xs font-semibold text-limestone-100 hover:text-karst-400"
                  >
                    Magyar (/a-malom-karsztrendszere)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

