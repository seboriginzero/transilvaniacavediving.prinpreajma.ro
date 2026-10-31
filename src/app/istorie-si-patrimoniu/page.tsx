import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BookOpen, History, Landmark, ArrowRight } from 'lucide-react';
import { getPageByPath, getAllPosts } from '@/lib/content';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CardMediaThumb } from '@/components/CardMediaThumb';

export const metadata: Metadata = {
  title: 'Istorie și Patrimoniu — Stațiunea Moneasa, Czárán Gyula și Istoria Speologiei',
  description:
    'Monografia istorică a Stațiunii Balneoclimaterice Moneasa (1597–prezent), biografia lui Czárán Gyula (1847–1906), istoria Cetății Dezna și cronologia explorărilor speologice în Munții Codru-Moma.',
  alternates: {
    canonical: 'https://transilvaniacavediving.com/istorie-si-patrimoniu',
  },
};

export default function IstorieSiPatrimoniuHubPage() {
  const moneasa = getPageByPath('/statiunea-moneasa');
  const czaran = getPageByPath('/czaran-gyula');
  const dezna = getPageByPath('/via-ferrata-cetate-dezna');
  const moara = getPageByPath('/pestera-uscata-de-la-moara');
  const liliecilor = getPageByPath('/pestera-liliecilor');

  const historyPosts = getAllPosts().filter((p) => p.categoryLabel === 'Istorie & Patrimoniu');

  const mainMonographs = [moneasa, czaran, dezna, moara, liliecilor].filter(Boolean);

  const timelineEvents = [
    {
      year: '1318',
      title: 'Atestarea documentară a Cetății Medievale Dezna',
      text: 'Fortificație strategică pe Dealul Osoiu (390 m), parte din sistemul defensiv al vestului Transilvaniei alături de Șiria, Șoimoș și Ineu.',
    },
    {
      year: '15 aprilie 1597',
      title: 'Prima atestare documentară a localității Moneasa',
      text: 'Menționată într-un act de donație al principelui Transilvaniei, Sigismund Báthory, către Kornis Gáspár.',
    },
    {
      year: '1746',
      title: 'Conscripția Morii de Apă din Moneasa',
      text: 'Atestarea morii de apă cu două roți care a dat numele Dealului Morii, Tăului Morii și Sistemului Carstic de la Moară.',
    },
    {
      year: '1891 – 1896',
      title: 'Modernizarea Stațiunii Moneasa & Amenajările lui Czárán Gyula',
      text: 'Forarea izvoarelor mezotermale (ing. Zsigmondy Béla), inaugurarea căii ferate Sebiș–Moneasa (1893), traseele turistice create de Czárán Gyula și obținerea statutului oficial de stațiune balneară la 13 mai 1896.',
    },
    {
      year: '6 ianuarie 1906',
      title: 'Trecerea în eternitate a lui Czárán Gyula la Moneasa',
      text: 'Pionierul turismului în Munții Apuseni este înmormântat în cimitirul romano-catolic din Moneasa; la 19 august 1906 îi este dezvelită placa comemorativă.',
    },
    {
      year: '1974 – 2012',
      title: 'Explorările Speologice Moderne în Munții Codru-Moma',
      text: 'Cartările și explorările realizate de C.S.A. Liliacul Arad (Gábor Halasi), G.E.S. Aragonit și A.S. Speowest Arad în Grota Ursului (>2.500 m), Peștera cu Apă de la Moară (1.750 m) și Peștera Liliecilor.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      <div>
        <Breadcrumbs items={[{ name: 'Istorie și patrimoniu', path: '/istorie-si-patrimoniu' }]} />
        <span className="text-xs font-bold uppercase tracking-wider text-karst-400">
          Arhivă Monografică, Cartografie Istorică &amp; Cercetare Speologică
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-limestone-50 sm:text-5xl">
          Istorie, Personalități și Patrimoniu Cultural-Științific
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-limestone-200">
          Păstrăm și documentăm integral istoria Stațiunii Balneoclimaterice Moneasa („Perla Munților Apuseni”), viața și opera lui Czárán Gyula, istoria Cetății Dezna și cronologia explorărilor speologice și arheologice din Munții Codru-Moma.
        </p>
      </div>

      {/* Monographs Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {mainMonographs.map((item) => {
          if (!item) return null;
          return (
            <article
              key={item.path}
              className="group flex flex-col overflow-hidden rounded-2xl border border-cavern-700 bg-cavern-800/80 shadow-xl transition hover:border-karst-500"
            >
              <Link href={item.path} className="block w-full">
                <CardMediaThumb src={item.heroImage} alt={item.cleanTitle} />
              </Link>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-karst-400">
                    {item.categoryLabel}
                  </span>
                  <h2 className="mt-2 text-2xl font-bold text-limestone-50 group-hover:text-karst-400">
                    <Link href={item.path}>{item.cleanTitle}</Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-limestone-300">
                    {item.metaDescription}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-cavern-700 pt-4 text-xs">
                  <span className="font-mono text-limestone-400">
                    {item.images.length} ilustrații și fotografii de epocă
                  </span>
                  <Link
                    href={item.path}
                    className="inline-flex items-center gap-1 font-bold text-karst-400"
                  >
                    Citește monografia completă <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Historical Timeline */}
      <section className="rounded-3xl border border-cavern-700 bg-cavern-800/60 p-6 sm:p-10">
        <div className="flex items-center gap-2.5 border-b border-cavern-700 pb-4 mb-8">
          <History className="h-6 w-6 text-karst-400" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-limestone-50">
            Repere Cronologice Majore (1318 – Prezent)
          </h2>
        </div>

        <div className="relative border-l-2 border-karst-500/40 pl-6 space-y-8 ml-2">
          {timelineEvents.map((ev) => (
            <div key={ev.year} className="relative">
              <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-karst-400 bg-cavern-950" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-karst-400">
                {ev.year}
              </span>
              <h3 className="mt-1 text-lg font-bold text-limestone-50">{ev.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-limestone-300">{ev.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Historical Articles from Blog */}
      {historyPosts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-limestone-50">
            Articole Istorice din Arhiva Jurnalului
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {historyPosts.map((post) => (
              <Link
                key={post.path}
                href={post.path}
                className="group rounded-2xl border border-cavern-700 bg-cavern-800/80 p-5 transition hover:border-karst-500"
              >
                <span className="text-xs font-mono text-karst-400">
                  {post.publicationDate?.slice(0, 10)}
                </span>
                <h3 className="mt-1.5 text-base font-bold text-limestone-100 group-hover:text-karst-400">
                  {post.cleanTitle}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs text-limestone-300">
                  {post.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

