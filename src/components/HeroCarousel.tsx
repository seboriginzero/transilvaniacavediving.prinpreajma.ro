'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export interface HeroSlide {
  src: string;
  title: string;
  location: string;
  credit?: string;
  linkHref: string;
  linkLabel: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/media/isverna/visit-isverna-cm5-resize.jpg',
    title: 'Scufundări în Peștera Isverna',
    location: 'Munții Mehedinți · Foto: Cristi Mitrofan',
    linkHref: '/visit-isverna',
    linkLabel: 'Descoperă Peștera Isverna',
  },
  {
    src: '/media/cave-diving/mihai-besesek-gate-of-styx-1.jpg',
    title: 'Explorare Subacvatică în Galerii Carstice',
    location: 'Scufundări Tehnice și Speologie Subacvatică',
    linkHref: '/cave-diving',
    linkLabel: 'Despre Cave Diving',
  },
  {
    src: '/media/cave-diving/188098413_136636951838060_3227459871193502756_n.jpg',
    title: 'Peștera Grota Ursului din Moneasa',
    location: 'Munții Codru-Moma · Foto: Romeo Lazăr',
    linkHref: '/grota-ursului',
    linkLabel: 'Vizitează Grota Ursului',
  },
  {
    src: '/media/cave-diving/335522871_190078843742195_6510426867527800716_n.jpg',
    title: 'Via Ferrata – Cetatea Medievală Dezna',
    location: 'Dealul Osoiu, Dezna, Județul Arad',
    linkHref: '/via-ferrata-cetate-dezna',
    linkLabel: 'Vezi traseul Via Ferrata',
  },
  {
    src: '/media/isverna/visit-isverna-cm1-rezize.jpg',
    title: 'Sifonul de Intrare din Peștera Isverna',
    location: 'Munții Mehedinți · Foto: Cristi Mitrofan',
    linkHref: '/visit-isverna',
    linkLabel: 'Ghidul tehnic Isverna',
  },
  {
    src: '/media/cave-diving/1aad0880-ab73-43ec-86ed-cad42bd95771.jpg',
    title: 'Belvedere Moneasa și Munții Codru-Moma',
    location: 'Stațiunea Balneoclimaterică Moneasa',
    linkHref: '/belvedere-moneasa',
    linkLabel: 'Traseul Belvedere',
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const activeSlide = HERO_SLIDES[currentIndex];

  return (
    <section
      aria-label="Galerie foto principală Transilvania Cave Diving"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="theme-hero-dark relative flex min-h-[68vh] flex-col justify-end overflow-hidden bg-cavern-950 sm:min-h-[76vh] lg:min-h-[84vh]"
    >
      {/* Full-bleed natural photography slides with subtle editorial zoom */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, idx) => {
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={slide.src}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.src}
                alt={slide.title}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className={`h-full w-full object-cover object-center ${
                  isCurrent ? 'animate-hero-zoom' : ''
                }`}
              />
            </div>
          );
        })}

        {/* Natural, transparent vignette only at the bottom and left so photography stays vivid */}
        <div
          className="absolute inset-0 z-20 bg-gradient-to-t from-cavern-950/92 via-cavern-950/20 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-20 bg-gradient-to-r from-cavern-950/50 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Organic, Uncluttered Editorial Foreground Content */}
      <div className="relative z-30 mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8 lg:pb-14">
        <div className="max-w-2xl space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-limestone-100/20 bg-cavern-950/45 px-3.5 py-1.5 text-xs font-medium tracking-wide text-limestone-100 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-karst-400 shrink-0" aria-hidden="true" />
            <span>Speoturism · Cave Diving · Munții Codru-Moma și Carpații Românești</span>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-limestone-50 drop-shadow-[0_3px_14px_rgba(0,0,0,0.85)] sm:text-5xl lg:text-6xl">
            Transilvania Cave Diving
          </h1>

          <p className="text-sm leading-relaxed text-limestone-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-base lg:text-lg">
            Un proiect dedicat explorării și protejării lumii subterane: de la galeriile cu cristale din <strong>Peștera Grota Ursului (Moneasa)</strong> și traseul de <strong>Via Ferrata Cetatea Dezna</strong>, până la scufundările în sifoanele adânci din <strong>Peștera Isverna</strong>.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/grota-ursului"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-karst-600 px-6 py-3.5 text-sm font-semibold text-limestone-50 shadow-lg transition hover:bg-karst-500 sm:w-auto"
            >
              <span>Vizitează Peștera Grota Ursului</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/descopera"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-limestone-200/35 bg-cavern-950/45 px-5 py-3.5 text-sm font-medium text-limestone-50 backdrop-blur-md transition hover:border-limestone-100 hover:bg-cavern-900/75 sm:w-auto"
            >
              <span>Descoperă Peșterile și Traseele</span>
            </Link>
          </div>
        </div>

        {/* Minimal, Natural Photo Caption & Slide Controls Bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-limestone-200/20 pt-4 sm:mt-10 sm:flex-row sm:items-center sm:pt-5">
          <div className="min-w-0">
            <Link
              href={activeSlide.linkHref}
              className="group inline-flex items-center gap-2 font-serif text-base font-medium text-limestone-50 hover:text-karst-300 sm:text-lg"
            >
              <span className="truncate">{activeSlide.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-karst-400 transition group-hover:translate-x-1" />
            </Link>
            <p className="text-xs text-limestone-300">{activeSlide.location}</p>
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            {/* Slide counter + organic dots */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-limestone-300">
                0{currentIndex + 1} / 0{HERO_SLIDES.length}
              </span>
              <div className="flex items-center gap-2" role="tablist" aria-label="Imagini carusel">
                {HERO_SLIDES.map((s, idx) => {
                  const active = idx === currentIndex;
                  return (
                    <button
                      key={s.src}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={`Imaginea ${idx + 1}: ${s.title}`}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        active
                          ? 'w-8 bg-limestone-100'
                          : 'w-2.5 bg-limestone-200/40 hover:bg-limestone-200/75'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Imaginea anterioară"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-limestone-200/30 bg-cavern-950/45 text-limestone-100 backdrop-blur-sm transition hover:border-limestone-100 hover:bg-cavern-900/75"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Imaginea următoare"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-limestone-200/30 bg-cavern-950/45 text-limestone-100 backdrop-blur-sm transition hover:border-limestone-100 hover:bg-cavern-900/75"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
