import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Compass, Waves, Mountain, GraduationCap, ArrowRight, ShieldAlert } from 'lucide-react';
import { getAllPosts } from '@/lib/content';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Aventuri și Experiențe — Speoturism, Cave Diving, Via Ferrata și Excursii Școlare',
  description:
    'Experiențe autentice organizate de Transilvania Cave Diving: ture de speoturism în Grota Ursului, explorări speologice, Via Ferrata Cetatea Dezna și pachete Moneasa Adventure (Școala Altfel / Săptămâna Verde).',
  alternates: {
    canonical: 'https://transilvaniacavediving.com/aventuri',
  },
};

export default function AventuriHubPage() {
  const adventurePosts = getAllPosts().filter(
    (p) =>
      p.categoryLabel === 'Speoturism și Aventură' ||
      p.categoryLabel === 'Cave Diving și Cursuri'
  );

  const mainExperiences = [
    {
      title: 'Speoturism în Peștera Grota Ursului (250 m – 1.500 m)',
      badge: 'Echipament Complet Asigurat · 1 – 6 ore',
      href: '/grota-ursului',
      icon: Compass,
      description:
        'Dincolo de sectorul turistic amenajat de 200 m, organizăm ture ghidate de speoturism pe trasee cu lungimi între 250 m și 1.500 m în galeriile superioare și active ale peșterii. Asigurăm cască, sistem de iluminat, costum de protecție, cizme și mănuși.',
    },
    {
      title: 'Cave Diving și Cursuri Tehnice IANTD (România și Internațional)',
      badge: 'Exclusiv Scafandri Brevetați',
      href: '/cave-diving',
      icon: Waves,
      description:
        'Scufundări speologice și explorări în sifoane carstice, galerii de mină inundate, suport logistic OC/CCR și programe de instruire IANTD (Side Mount, Cavern Diver, Intro to Cave).',
    },
    {
      title: 'Via Ferrata – Cetatea Medievală Dezna',
      badge: 'Dificultate B · 600 m · +120 m denivelare',
      href: '/via-ferrata-cetate-dezna',
      icon: Mountain,
      description:
        'Traseu spectaculos pe Dealul Osoiu (390 m) până la ruinele Cetății Dezna (sec. XIII–XIV), cu două sectoare echipate cu cablu și trepte metalice și o punte indiană de 25 m. Acces gratuit cu echipament propriu omologat sau ghidaj și închiriere echipament la cerere.',
    },
    {
      title: 'Moneasa Adventure — Școala Altfel și Săptămâna Verde',
      badge: 'Grădinițe, Primar, Gimnaziu și Liceu',
      href: '/moneasa-adventure',
      icon: GraduationCap,
      description:
        'Excursii educative de o zi în Stațiunea Moneasa adaptate pe grupe de vârstă: vizitarea Peșterii Grota Ursului, ateliere interactive despre carst și lilieci, drumeții pe traseele lui Czárán Gyula, tiroliană și speoturism pentru liceeni.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-14">
      <div>
        <Breadcrumbs items={[{ name: 'Aventuri și experiențe', path: '/aventuri' }]} />
        <span className="text-xs font-bold uppercase tracking-wider text-karst-400">
          Ghidaj Autorizat · Echipamente Omologate · Siguranță Subterană
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-limestone-50 sm:text-5xl">
          Aventuri și Experiențe în Subteran și pe Stâncă
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-limestone-200">
          Indiferent dacă îți dorești prima incursiune într-o peșteră neamenajată alături de un ghid speolog, o ascensiune pe via ferrata, o excursie educativă pentru elevi sau o expediție tehnică de cave diving, fiecare program este construit în jurul siguranței și respectului față de mediul carstic.
        </p>
      </div>

      {/* 4 Main Experiences Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {mainExperiences.map((exp) => {
          const IconComponent = exp.icon;
          return (
            <div
              key={exp.href}
              className="flex flex-col justify-between rounded-2xl border border-cavern-700 bg-cavern-800/80 p-6 sm:p-8 shadow-xl transition hover:border-karst-500"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="rounded-xl bg-karst-500/15 p-3 text-karst-400">
                    <IconComponent className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-cavern-600 bg-cavern-900 px-3 py-1 text-xs font-mono font-semibold text-karst-400">
                    {exp.badge}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-bold text-limestone-50">{exp.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-limestone-200">
                  {exp.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-cavern-700/80 flex items-center justify-between">
                <Link
                  href={exp.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-karst-400 hover:underline"
                >
                  Vezi detalii complete și condiții <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg bg-cavern-900 border border-cavern-600 px-3 py-1.5 text-xs font-semibold text-limestone-100 hover:border-karst-400"
                >
                  Solicită programare
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Programs & Archive Posts */}
      <section className="space-y-6">
        <div className="border-b border-cavern-700 pb-4">
          <h2 className="text-2xl font-bold text-limestone-50">
            Programe de Speoturism, Canyoning și Expediții din Arhivă (2019–2025)
          </h2>
          <p className="mt-1 text-xs text-limestone-300">
            Articolele de mai jos păstrează integral descrierile turelor de speoturism, canyoning la Moneasa, tabere și cursuri desfășurate de-a lungul timpului.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adventurePosts.map((post) => (
            <Link
              key={post.path}
              href={post.path}
              className="group flex flex-col justify-between rounded-2xl border border-cavern-700 bg-cavern-800/70 p-5 transition hover:border-karst-500"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-limestone-400">
                  <span className="font-bold text-karst-400">{post.categoryLabel}</span>
                  {post.publicationDate && (
                    <span className="font-mono">{post.publicationDate.slice(0, 10)}</span>
                  )}
                </div>
                <h3 className="mt-2 text-base font-bold text-limestone-100 group-hover:text-karst-400">
                  {post.cleanTitle}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs text-limestone-300">
                  {post.metaDescription}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-karst-400">
                Citește în arhivă <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

