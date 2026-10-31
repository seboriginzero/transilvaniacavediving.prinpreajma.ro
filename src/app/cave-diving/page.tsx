import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Waves,
  ShieldAlert,
  Award,
  Gauge,
  Compass,
  Wrench,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { getPageByPath, getCaveDivingArticles } from '@/lib/content';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SafetyWarningBanner } from '@/components/SafetyWarningBanner';

export const metadata: Metadata = {
  title: 'Cave Diving și Cursuri Tehnice IANTD — Peștera Isverna, Șura Mare și Mine Inundate',
  description:
    'Prezentare tehnică completă Cave Diving: destinații de scufundări în peșteri (Peștera Isverna, Șura Mare, Peștera cu Apă de la Moară), cursuri IANTD (Side Mount, Cavern, Intro to Cave), echipamente redundante și cerințe de eligibilitate.',
  alternates: {
    canonical: 'https://transilvaniacavediving.com/cave-diving',
  },
};

export default function CaveDivingTechnicalPage() {
  const isvernaPage = getPageByPath('/visit-isverna');
  const caveArticles = getCaveDivingArticles();

  const isvernaSumps = [
    { name: 'Sifonul Verde (Green Sump)', length: '50 m', depth: '-13 m', zone: 'Acces din galeria uscată de intrare' },
    { name: 'Sifonul Galben (Yellow Sump)', length: '20 m', depth: '-2 m', zone: 'Pasaj scurt între Sifonul Verde și Sifonul Negru' },
    { name: 'Sifonul Negru (Black Sump)', length: '660 m', depth: '-44 m', zone: 'Sifonul principal de mare adâncime și distanță' },
    { name: 'Sifonul cu Pietriș (Gravel Sump)', length: '195 m', depth: '-18,5 m', zone: 'Sector amonte după Sifonul Negru' },
    { name: 'Sifonul cu Nisip (Sand Sump)', length: '100 m', depth: '-39 m', zone: 'Profil adânc în sectorul intern' },
    { name: 'Sifonul Final (Final Sump)', length: '30 m', depth: '-5 m', zone: 'Sectorul terminal explorat' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-14">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Aventuri și experiențe', path: '/aventuri' },
            { name: 'Cave Diving și Cursuri IANTD', path: '/cave-diving' },
          ]}
        />
        <span className="text-xs font-bold uppercase tracking-wider text-karst-400">
          Scufundări Tehnice în Medii Overhead · România și Internațional
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-limestone-50 sm:text-5xl">
          Cave Diving: Destinații, Cursuri IANTD, Echipamente și Eligibilitate
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-limestone-200">
          Transilvania Cave Diving organizează scufundări ghidate și expediții de explorare în peșteri scufundate și galerii de mină inundate din România și străinătate, asigurând suport tehnic pentru configurații <strong className="text-limestone-50">Open Circuit (OC)</strong> și <strong className="text-limestone-50">Closed Circuit Rebreather (CCR)</strong>.
        </p>
      </div>

      {/* Mandatory Safety & Eligibility Warning */}
      <SafetyWarningBanner
        title="Restricții de Eligibilitate și Siguranță în Cave Diving"
        warnings={[
          'EXCLUSIV PENTRU SCAFANDRI BREVETAȚI: Turele și vizitele de scufundări în peșteri și galerii de mină scufundate sunt organizate exclusiv pentru scafandri care dețin certificare recunoscută (Cavern / Intro to Cave / Full Cave / Mine Diver), corespunzătoare zonei și profilului imersiunii.',
          'Mediile overhead (fără acces direct la suprafață), apa rece (~8 °C în peșterile din România), vizibilitatea variabilă, curenții carstici și adâncimile mari (-44 m în Sifonul Negru din Isverna) impun redundanță completă a gazului, iluminatului (minim 3 surse), fir ghid continuu și planificare strictă a consumului de gaz.',
          'În cavitățile protejate de Clasa A (precum Peștera cu Apă de la Moară sau Peștera Șura Mare), orice imersiune se desfășoară numai în baza autorizațiilor emise de Comisia Patrimoniului Speologic și ANMAP.',
        ]}
      />

      {/* 1. DESTINATIONS SEPARATION */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-cavern-700 pb-3">
          <Compass className="h-6 w-6 text-karst-400" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-limestone-50">
            1. Destinații de Cave Diving și Profilul Sifoanelor din Peștera Isverna
          </h2>
        </div>

        <div className="rounded-2xl border border-cavern-700 bg-cavern-800/80 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-karst-400">
                Munții Mehedinți · Județul Mehedinți · Dezvoltare &gt; 4 km · Apă ~8 °C
              </span>
              <h3 className="mt-1 text-2xl font-bold text-limestone-50">
                Peștera Isverna — Parametrii Tehnici ai Sifoanelor
              </h3>
            </div>
            <Link
              href="/visit-isverna"
              className="inline-flex items-center gap-2 rounded-xl bg-karst-600 px-4 py-2.5 text-xs font-bold text-cavern-950 transition hover:bg-karst-500"
            >
              Deschide Pagina Visit Isverna și Galeria Cristi Mitrofan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-limestone-200 border-collapse">
              <thead>
                <tr className="border-b border-cavern-600 bg-cavern-900/90 text-xs font-bold uppercase tracking-wider text-karst-400">
                  <th className="py-3 px-4">Denumire Sifon</th>
                  <th className="py-3 px-4 font-mono">Lungime</th>
                  <th className="py-3 px-4 font-mono">Adâncime Max.</th>
                  <th className="py-3 px-4">Caracteristici Sector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cavern-700/70">
                {isvernaSumps.map((sump) => (
                  <tr key={sump.name} className="hover:bg-cavern-900/50">
                    <td className="py-3 px-4 font-semibold text-limestone-50">{sump.name}</td>
                    <td className="py-3 px-4 font-mono text-karst-400">{sump.length}</td>
                    <td className="py-3 px-4 font-mono text-safety-400">{sump.depth}</td>
                    <td className="py-3 px-4 text-xs text-limestone-300">{sump.zone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. TRAINING COURSES SEPARATION (IANTD) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-cavern-700 pb-3">
          <Award className="h-6 w-6 text-karst-400" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-limestone-50">
            2. Programe de Instruire și Cursuri IANTD (Arhivă și Organizare la Cerere)
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-cavern-700 bg-cavern-800/80 p-6">
            <span className="rounded-md bg-karst-500/15 px-2.5 py-1 text-xs font-mono font-bold text-karst-400">
              Configurație Echipament
            </span>
            <h3 className="mt-3 text-xl font-bold text-limestone-50">
              Curs Side Mount Diver
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-limestone-300">
              Stăpânirea configurației cu butelii montate lateral (Sidemount), esențială pentru pasaje înguste (restricții), echilibru hidrodinamic (trim), managementul supapelor și accesul facil în peșteri cu transport terestru dificil.
            </p>
            <Link
              href="/2021/07/26/curs-ow-side-mount-diver-iantd"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-karst-400 hover:underline"
            >
              Citește fișa cursului din arhivă <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-cavern-700 bg-cavern-800/80 p-6">
            <span className="rounded-md bg-karst-500/15 px-2.5 py-1 text-xs font-mono font-bold text-karst-400">
              Nivelul 1 Overhead
            </span>
            <h3 className="mt-3 text-xl font-bold text-limestone-50">
              Curs Cavern Diver IANTD
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-limestone-300">
              Introducerea în mediul overhead în zona de lumină naturală: utilizarea mulinetei și a firului ghid, tehnici de propulsie anti-silting (frog kick, modified flutter, back kick), comunicare prin semnale luminoase și tactile.
            </p>
            <Link
              href="/2021/07/25/1045"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-karst-400 hover:underline"
            >
              Vezi programa IANTD Cavern <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-cavern-700 bg-cavern-800/80 p-6">
            <span className="rounded-md bg-safety-500/15 px-2.5 py-1 text-xs font-mono font-bold text-safety-400">
              Nivelul 2 Cave Diving
            </span>
            <h3 className="mt-3 text-xl font-bold text-limestone-50">
              Curs Intro to Cave Diver IANTD
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-limestone-300">
              Tranziția dincolo de zona de lumină pe firul ghid principal: regula treimilor în managementul gazelor, rezolvarea pierderii vizibilității (zero visibility drills), pierderea firului ghid și partajarea gazului în pasaje subterane.
            </p>
            <Link
              href="/2021/07/25/1045"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-safety-400 hover:underline"
            >
              Vezi programa Intro to Cave <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. EQUIPMENT REQUIREMENTS SEPARATION */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-cavern-700 pb-3">
          <Wrench className="h-6 w-6 text-karst-400" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-limestone-50">
            3. Cerințe de Echipament Tehnic pentru Peșterile din România
          </h2>
        </div>

        <div className="rounded-2xl border border-cavern-700 bg-cavern-800/80 p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ul className="space-y-3 text-sm text-limestone-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-karst-400" />
                <span>
                  <strong>Protecție termică pentru apă de 7–9 °C:</strong> Costum uscat (Drysuit trilaminat sau neopren comprimat, ex. Ursuit) cu subcostum termic Polartec® (Kwark) și sistem de mănuși uscate (Si Tech) sau încălzire electrică (Ammonite Accu Thermo).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-karst-400" />
                <span>
                  <strong>Redundanță alimentare cu gaz:</strong> Dublu (Backmount cu manifold izolator) sau configurație Sidemount (ex. TecLine Avenger), echipate cu două detentoare independente certificate pentru apă rece (TecLine R2 TEC2 / V2 ICE).
                </span>
              </li>
            </ul>
            <ul className="space-y-3 text-sm text-limestone-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-karst-400" />
                <span>
                  <strong>Iluminat subacvatic triplu:</strong> Lanternă primară umbilicală sau canistră (ex. Ammonite System) + minimum două lanterne de backup montate pe cască sau ham.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-karst-400" />
                <span>
                  <strong>Instrumentație și navigație:</strong> Două computere de scufundare / bottom timers (ex. Shearwater Perdix / Petrel), mulinetă primară, spool-uri de siguranță/jump, săgeți direcționale (line arrows) și cookies, plus două instrumente de tăiere.
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-6 border-t border-cavern-700 pt-4 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-limestone-300">
              Toate aceste echipamente sunt distribuite oficial prin magazinul Transilvania Cave Diving.
            </span>
            <Link
              href="/magazin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-karst-400 hover:underline"
            >
              Consultă Catalogul de Echipamente <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. EXPEDITION RECORDS & ARTICLES */}
      <section className="space-y-6">
        <div className="border-b border-cavern-700 pb-3">
          <h2 className="text-2xl font-bold text-limestone-50">
            4. Jurnale de Expediție, Explorări Subacvatice și Articole Cave Diving
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caveArticles.map((post) => (
            <Link
              key={post.path}
              href={post.path}
              className="group flex flex-col justify-between rounded-2xl border border-cavern-700 bg-cavern-800/80 p-5 transition hover:border-karst-500"
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
                Citește documentarul <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
