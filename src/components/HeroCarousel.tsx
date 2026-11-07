'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DynamicSiteSettings } from '@/lib/settings';

interface HeroFact {
  label: string;
  value: string;
}

interface HeroSlide {
  src: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  location: string;
  description: string;
  linkHref: string;
  linkLabel: string;
  facts: HeroFact[];
  objectPosition?: string;
  /** Show the entire photo (no crop) anchored right on desktop — for tall subjects like the hanging bat. */
  fit?: 'contain-right';
}

/**
 * All facts below are taken verbatim (or condensed) from the technical specs
 * of the corresponding source pages in site-database.json.
 */
function buildSlides(settings: DynamicSiteSettings): HeroSlide[] {
  const g = settings.grotaUrsului;
  const v = settings.viaFerrata;
  return [
    {
      src: '/media/cave-diving/188098413_136636951838060_3227459871193502756_n.jpg',
      eyebrow: 'Obiectiv turistic principal',
      title: 'Peștera Grota Ursului',
      shortTitle: 'Grota Ursului',
      location: 'Moneasa · Munții Codru-Moma · Foto: Romeo Lazăr',
      description:
        'Traseu turistic amenajat și electrificat de cca. 200 m până în Sala Czárán Gyula, cu fosile de urs de cavernă (Ursus spelaeus) descoperite în 1989 și Expoziția Peștera Coliboaia.',
      linkHref: '/grota-ursului',
      linkLabel: 'Program și vizitare',
      facts: [
        { label: 'Program', value: `${g.days}, ${g.hours}` },
        { label: 'Bilet', value: `${g.adultPrice} lei adulți · ${g.childPrice} lei copii` },
        { label: 'Temperatură', value: g.temperature },
      ],
    },
    {
      src: '/media/via-ferrata/img_20230428_151738668_hdr.jpg',
      eyebrow: 'Traseu montan echipat',
      title: 'Via Ferrata Cetatea Dezna',
      shortTitle: 'Via Ferrata',
      location: 'Dealul Osoiu · Dezna, Județul Arad',
      description:
        'Traseu echipat cu cabluri, trepte metalice și o punte indiană de 25 m, care urcă până în incinta Cetății Medievale Dezna, atestată documentar în 1318.',
      linkHref: '/via-ferrata-cetate-dezna',
      linkLabel: 'Detalii traseu',
      facts: [
        { label: 'Lungime', value: v.length },
        { label: 'Dificultate', value: v.grade },
        { label: 'Durată', value: 'Urcare ~1 oră · coborâre ~25 min' },
      ],
    },
    {
      src: '/media/belvedere/belvedere-moneasa-2.jpg',
      eyebrow: 'Punct panoramic',
      title: 'Belvedere Moneasa',
      shortTitle: 'Belvedere',
      location: 'Moneasa · Cariera de Marmură Roșie și Neagră',
      description:
        'Traseul pornește de lângă Cuptorul de Topit Fier și urcă pe lângă cariera de marmură roșie și neagră exploatată în secolul al XIX-lea, până la platforma panoramică.',
      linkHref: '/belvedere-moneasa',
      linkLabel: 'Detalii traseu',
      facts: [
        { label: 'Traseu', value: '2,7 km · ~1,5 ore' },
        { label: 'Marcaj', value: 'Punct roșu' },
        { label: 'Dificultate', value: 'Mic – Mediu' },
      ],
    },
    {
      src: '/media/pestera-liliecilor/2012-02-12-moneasa-ar-sebi-013.jpg',
      eyebrow: 'Sit arheologic · RAN 11487.01',
      title: 'Peștera Liliecilor',
      shortTitle: 'Peștera Liliecilor',
      location: 'Moneasa · Hoanca Coului',
      description:
        'Cunoscută de Czárán Gyula drept „Citramontán Barlang”, peștera adăpostește liliacul mare cu potcoavă (Rhinolophus ferrumequinum) și urme de locuire din neolitic până în epoca fierului.',
      linkHref: '/pestera-liliecilor',
      linkLabel: 'Detalii peșteră',
      objectPosition: '56% 55%',
      fit: 'contain-right',
      facts: [
        { label: 'Acces', value: 'Bandă albastră · 1,3 km' },
        { label: 'Dezvoltare', value: '~150 m (Speowest, 2011)' },
        { label: 'Durată', value: '~1 oră' },
      ],
    },
    {
      src: '/media/sistemul-carstic/whatsapp-image-2026-10-06-at-19.59.12-1-1.jpeg',
      eyebrow: 'Natura 2000 · ROSCI0042',
      title: 'Sistemul Carstic de la Moară',
      shortTitle: 'Sistemul de la Moară',
      location: 'Moneasa · Situl Natura 2000 Codru-Moma',
      description:
        'Complex carstic format în calcare și dolomite triasice vechi de ~230 milioane de ani, cu Peștera cu Apă de la Moară, Ponorul de la Merezărie și Peștera Uscată de la Moară.',
      linkHref: '/pestera-uscata-de-la-moara',
      linkLabel: 'Descoperă sistemul',
      facts: [
        { label: 'Peștera cu Apă', value: '1.750 m · Clasa A' },
        { label: 'Merezărie', value: '538 m · −64 m' },
        { label: 'Atestare', value: 'Conscripția din 1746' },
      ],
    },
  ];
}

interface HeroCarouselProps {
  settings: DynamicSiteSettings;
}

export function HeroCarousel({ settings }: HeroCarouselProps) {
  const slides = buildSlides(settings);
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const slide = slides[index];

  return (
    <section
      aria-label="Obiective turistice Moneasa"
      aria-roledescription="carusel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="theme-hero-dark relative isolate h-[calc(100svh-4rem)] min-h-[620px] max-h-[1000px] w-full overflow-hidden bg-black text-white"
    >
      {/* Screen-reader announcement for active slide */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Diapozitivul ${index + 1} din ${slides.length}: ${slide.title} — ${slide.eyebrow}`}
      </div>

      {/* Photography — full bleed, untouched colours */}
      {slides.map((s, i) => (
        <div
          key={s.src}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={s.src}
            alt={s.title}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={{ objectPosition: s.objectPosition || 'center' }}
            className={`w-full object-cover ${
              s.fit
                ? 'absolute inset-x-0 top-0 h-[34%] [mask-image:linear-gradient(to_top,transparent_0%,#000_25%)] sm:hidden'
                : 'h-full'
            } ${i === index && !s.fit ? 'animate-hero-zoom' : ''}`}
          />
          {s.fit === 'contain-right' && (
            <img
              src={s.src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, #000 28%), linear-gradient(to top, transparent 0%, #000 10%)',
                maskImage:
                  'linear-gradient(to right, transparent 0%, #000 28%), linear-gradient(to top, transparent 0%, #000 10%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
              }}
              className="absolute right-0 top-0 hidden h-[84%] w-auto max-w-none sm:block"
            />
          )}
        </div>
      ))}

      {/* Legibility scrims — literal black only, never theme colours.
          On desktop the uncropped (contain-right) slide sits on pure black already, so its scrims are dropped. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.65)_50%,rgba(0,0,0,0.15)_85%)] transition-opacity duration-700 sm:hidden ${
          slide.fit ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.5)_32%,rgba(0,0,0,0)_62%)] transition-opacity duration-700 sm:block ${
          slide.fit ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0)_70%)] transition-opacity duration-700 ${
          slide.fit ? 'sm:opacity-0' : ''
        }`}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-end px-5 pb-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
        <div key={index} className="max-w-3xl animate-hero-fade-up">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
            <span className="tabular-nums text-white">{String(index + 1).padStart(2, '0')}</span>
            <span className="mx-2 text-white/40">—</span>
            {slide.eyebrow}
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.6rem,6.2vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-white">
            {slide.title}
          </h1>

          <dl className="mt-6 flex max-w-3xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-10">
            {slide.facts.map((f) => (
              <div key={f.label} className="border-l border-white/25 pl-3">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {f.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-white sm:whitespace-nowrap">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={slide.linkHref}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white/90 active:scale-[0.97]"
            >
              {slide.linkLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10 active:scale-[0.97]"
            >
              Programează o vizită
            </Link>
          </div>
        </div>

        {/* Slide navigation with progress */}
        <div className="mt-10 flex items-end gap-6 lg:mt-14">
          <ol className="grid flex-1 grid-cols-5 gap-3 sm:gap-5">
            {slides.map((s, i) => {
              const active = i === index;
              return (
                <li key={s.src}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Diapozitiv ${i + 1}: ${s.shortTitle}`}
                    aria-current={active}
                    className="group block w-full text-left"
                  >
                    <span className="relative block h-[2px] w-full overflow-hidden bg-white/25">
                      {active && (
                        <span
                          key={`p-${index}`}
                          onAnimationEnd={next}
                          style={{ animationPlayState: paused ? 'paused' : 'running' }}
                          className="animate-hero-progress absolute inset-0 bg-white"
                        />
                      )}
                      {i < index && <span className="absolute inset-0 bg-white/60" />}
                    </span>
                    <span
                      className={`mt-3 hidden text-xs font-medium transition sm:block ${
                        active ? 'text-white' : 'text-white/55 group-hover:text-white/85'
                      }`}
                    >
                      <span className="mr-2 tabular-nums text-white/45">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.shortTitle}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button
              type="button"
              onClick={prev}
              aria-label="Diapozitiv anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Diapozitiv următor"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10 active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
