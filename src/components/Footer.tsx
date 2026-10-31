import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, ShieldAlert, Building2, ExternalLink, Share2 } from 'lucide-react';
import type { CompanyInfo } from '@/lib/content';

interface FooterProps {
  company: CompanyInfo;
}

const FEATURED_FACEBOOK_PAGES = [
  {
    name: 'Transilvania',
    subtitle: 'Transilvania Cave Diving',
    followers: '1,047 followers',
    href: 'https://www.facebook.com/cavedivingromania',
    shareHref: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.facebook.com%2Fcavedivingromania',
    avatar: '/media/logos/tcd-vampire-logo.svg',
  },
  {
    name: 'Peștera Grota Ursului - Moneasa',
    subtitle: 'Obiectiv Turistic și Speologic',
    followers: '2,382 followers',
    href: 'https://www.facebook.com/Pe%C8%99tera-Grota-Ursului-Moneasa-108508321317590',
    shareHref: 'https://www.facebook.com/share/1WHBh6Nj2z/',
    avatar: '/media/logos/logo-grota-ursului-2025.jpg',
  },
  {
    name: 'Belvedere Moneasa',
    subtitle: 'Punct Belvedere și Cariera de Marmură',
    followers: '1,120 followers',
    href: 'https://www.facebook.com/Belvedere-Moneasa-105856912164648',
    shareHref: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.facebook.com%2FBelvedere-Moneasa-105856912164648',
    avatar: '/media/belvedere/img-20230417-wa0002.jpg',
  },
];

const ADDITIONAL_FACEBOOK_LINKS = [
  {
    label: 'Via Ferrata Cetatea Dezna',
    href: 'https://www.facebook.com/profile.php?id=100083662944867',
  },
  {
    label: 'Czárán Gyula – Moneasa',
    href: 'https://www.facebook.com/profile.php?id=61575535798320',
  },
  {
    label: 'Visit Isverna Cave Diving',
    href: 'https://www.facebook.com/isvernacavediving',
  },
  {
    label: 'Grota Ursului (Share)',
    href: 'https://www.facebook.com/share/1WHBh6Nj2z/',
  },
  {
    label: 'Molnár János Cave',
    href: 'https://www.facebook.com/molnarjanoscave',
  },
  {
    label: 'Mine Diving Kőbánya',
    href: 'https://www.facebook.com/minediving',
  },
  {
    label: 'Makita România (Partener)',
    href: 'https://www.facebook.com/MakitaRomaniaSRL/',
  },
];

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

export function Footer({ company }: FooterProps) {
  return (
    <footer className="border-t border-cavern-700 bg-cavern-950 text-limestone-300">
      {/* Safety & Emergency Strip */}
      <div className="border-b border-cavern-800 bg-cavern-900/80 px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-safety-400" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-limestone-200">
              <strong className="text-safety-400">Avertisment de Siguranță Subterană și Montană:</strong> Explorarea peșterilor neamenajate, scufundările în peșteri (cave diving) și parcurgerea traseelor de via ferrata implică riscuri specifice și necesită echipament omologat, pregătire tehnică sau ghidaj autorizat.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-xs font-mono">
            <span className="rounded-md border border-safety-500/40 bg-safety-500/10 px-2.5 py-1 text-safety-400 font-semibold">
              Urgențe: 112
            </span>
            <span className="rounded-md border border-cavern-700 bg-cavern-800 px-2.5 py-1 text-limestone-200">
              0-SALVAMONT (0725 826 668)
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Company Identity */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/media/logos/tcd-logo.svg"
                alt="Transilvania Cave Diving"
                className="logo-dark-mode h-11 w-auto"
                width={176}
                height={44}
              />
              <img
                src="/media/logos/tcd-logo-light.svg"
                alt="Transilvania Cave Diving"
                className="logo-light-mode h-11 w-auto"
                width={176}
                height={44}
              />
            </Link>
            <p className="text-sm leading-relaxed text-limestone-300">
              Explorare speologică, scufundări tehnice în peșteri (cave diving), amenajare obiective carstice (Peștera Grota Ursului – Moneasa), distribuție echipamente și lucrări subacvatice profesionale.
            </p>
            <div className="rounded-xl border border-cavern-800 bg-cavern-900/70 p-3.5 text-xs space-y-1.5 font-mono text-limestone-200">
              <div className="flex items-center gap-2 font-sans font-semibold text-karst-400">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                <span>{company.legalName}</span>
              </div>
              <div>CIF: {company.cif}</div>
              <div>Reg. com.: {company.regCom}</div>
              <div className="flex items-center gap-1.5 pt-1 text-limestone-300 font-sans">
                <MapPin className="h-3.5 w-3.5 text-karst-400 shrink-0" aria-hidden="true" />
                <span>{company.headquarters} · Bază: {company.operationalBase}</span>
              </div>
              <div className="flex items-center gap-1.5 text-limestone-100 font-semibold">
                <Phone className="h-3.5 w-3.5 text-karst-400 shrink-0" aria-hidden="true" />
                <a href={`tel:${company.phonePrimary.replace(/\s+/g, '')}`} className="hover:text-karst-400">
                  {company.phonePrimary}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2:Obiective Carstice & Trasee */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-limestone-100">
              Peșteri și Obiective Turistice
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/grota-ursului" className="hover:text-karst-400 transition">
                  Peștera Grota Ursului – Moneasa
                </Link>
              </li>
              <li>
                <Link href="/pestera-liliecilor" className="hover:text-karst-400 transition">
                  Peștera Liliecilor – Moneasa (RO)
                </Link>
              </li>
              <li>
                <Link href="/pestera-uscata-de-la-moara" className="hover:text-karst-400 transition">
                  Sistemul Carstic de la Moară (Natura 2000)
                </Link>
              </li>
              <li>
                <Link href="/via-ferrata-cetate-dezna" className="hover:text-karst-400 transition">
                  Via Ferrata – Cetatea Medievală Dezna
                </Link>
              </li>
              <li>
                <Link href="/belvedere-moneasa" className="hover:text-karst-400 transition">
                  Belvedere Moneasa și Cariera de Marmură
                </Link>
              </li>
              <li>
                <Link href="/visit-isverna" className="hover:text-karst-400 transition">
                  Peștera Isverna – Ghid Tehnic Cave Diving
                </Link>
              </li>
              <li className="pt-2 border-t border-cavern-800 text-xs text-limestone-400">
                Ghiduri Trasee QR (EN / HU):
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <Link href="/bat-cave" className="rounded bg-cavern-900 px-2 py-1 text-limestone-200 hover:text-karst-400">
                    Bat Cave (EN)
                  </Link>
                  <Link href="/denever-barlang" className="rounded bg-cavern-900 px-2 py-1 text-limestone-200 hover:text-karst-400">
                    Denevér-barlang (HU)
                  </Link>
                  <Link href="/the-mill-karst-system" className="rounded bg-cavern-900 px-2 py-1 text-limestone-200 hover:text-karst-400">
                    Mill Karst (EN)
                  </Link>
                  <Link href="/a-malom-karsztrendszere" className="rounded bg-cavern-900 px-2 py-1 text-limestone-200 hover:text-karst-400">
                    Malom-karszt (HU)
                  </Link>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Aventuri, Servicii & Patrimoniu */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-limestone-100">
              Experiențe, Servicii și Istorie
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/cave-diving" className="hover:text-karst-400 transition">
                  Cave Diving și Cursuri Scufundări IANTD
                </Link>
              </li>
              <li>
                <Link href="/aventuri" className="hover:text-karst-400 transition">
                  Speoturism, Canyoning și Aventură Subterană
                </Link>
              </li>
              <li>
                <Link href="/moneasa-adventure" className="hover:text-karst-400 transition">
                  Moneasa Adventure (Școala Altfel și Săptămâna Verde)
                </Link>
              </li>
              <li>
                <Link href="/servicii" className="hover:text-karst-400 transition">
                  Servicii Lucrări Subacvatice și la Înălțime
                </Link>
              </li>
              <li>
                <Link href="/statiunea-moneasa" className="hover:text-karst-400 transition">
                  Monografia Stațiunii Moneasa (1597–prezent)
                </Link>
              </li>
              <li>
                <Link href="/czaran-gyula" className="hover:text-karst-400 transition">
                  Czárán Gyula (1847–1906) – Biografie
                </Link>
              </li>
              <li>
                <Link href="/jurnal" className="hover:text-karst-400 transition">
                  Jurnal de Explorare și Arhivă (36 Articole)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Magazin & Contact */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-limestone-100">
              Magazin Echipamente și Contact
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/magazin" className="font-semibold text-karst-400 hover:underline">
                  Catalog Echipamente și Condiții Comandă
                </Link>
              </li>
              <li className="text-xs leading-relaxed text-limestone-400">
                Distribuitor pentru: <strong className="text-limestone-200">Fenix, TecLine, Ammonite System, Shearwater, Ursuit, Bauer Kompressoren, Kwark, UR-Flex, Si Tech</strong>.
              </li>
              <li className="text-xs text-limestone-300">
                • Transport gratuit la comenzi de peste 300 lei
                <br />• Drept de retur 14 zile conform O.U.G. 34/2014
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-karst-600 px-4 py-2.5 text-sm font-semibold text-cavern-950 transition hover:bg-karst-500"
                >
                  Trimite o Solicitare / Rezervare
                </Link>
              </li>
              <li className="pt-2 flex items-center gap-3 text-xs">
                <a
                  href={company.mapsGrotaUrsului}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-limestone-300 hover:text-karst-400"
                >
                  Google Maps Grota Ursului <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Official Facebook Pages Section (matching original footer Facebook cards) */}
        <div className="mt-10 border-t border-cavern-800 pt-8" data-testid="footer-facebook-section">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1877F2]/15 text-[#1877F2]">
                <FacebookIcon className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-limestone-100">
                  Pagini Oficiale Facebook și Comunități
                </h2>
                <p className="text-xs text-limestone-400">
                  Urmărește activitatea Transilvania Cave Diving, Peștera Grota Ursului și proiectele din Munții Codru-Moma
                </p>
              </div>
            </div>
          </div>

          {/* 3 Primary Facebook Page Cards (Transilvania, Peștera Grota Ursului - Moneasa, Belvedere Moneasa) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {FEATURED_FACEBOOK_PAGES.map((fb) => (
              <div
                key={fb.href}
                className="flex flex-col justify-between overflow-hidden rounded-xl border border-cavern-700 bg-cavern-900/90 shadow-md transition hover:border-karst-500/60"
              >
                <div className="flex items-center gap-3.5 p-4">
                  <a
                    href={fb.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-cavern-700 bg-cavern-950"
                  >
                    <img
                      src={fb.avatar}
                      alt={fb.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </a>
                  <div className="min-w-0 flex-1">
                    <a
                      href={fb.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-serif text-base font-bold text-limestone-50 hover:text-karst-400 hover:underline"
                    >
                      {fb.name}
                    </a>
                    <p className="truncate text-xs text-limestone-300">{fb.subtitle}</p>
                    <p className="mt-0.5 font-mono text-xs font-semibold text-karst-400">
                      {fb.followers}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-cavern-800 bg-cavern-950/60 px-4 py-2.5">
                  <a
                    href={fb.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-cavern-700 bg-cavern-800 px-3 py-1.5 text-xs font-semibold text-limestone-100 transition hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                  >
                    <FacebookIcon className="h-3.5 w-3.5 text-[#1877F2] group-hover:text-white" />
                    <span>Follow Page</span>
                  </a>
                  <a
                    href={fb.shareHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-cavern-700 bg-cavern-800 px-3 py-1.5 text-xs font-semibold text-limestone-200 transition hover:border-karst-400 hover:text-limestone-50"
                  >
                    <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Share</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* All Additional Facebook Pages discovered across site pages and articles */}
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-cavern-800 bg-cavern-900/50 px-4 py-3 text-xs">
            <span className="font-semibold text-limestone-300">
              Alte pagini Facebook din proiectele noastre:
            </span>
            {ADDITIONAL_FACEBOOK_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-cavern-700 bg-cavern-800/90 px-2.5 py-1 font-medium text-limestone-200 transition hover:border-[#1877F2] hover:text-karst-400"
              >
                <FacebookIcon className="h-3 w-3 text-[#1877F2]" />
                <span>{item.label}</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-70" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Copyright & Attribution */}
        <div className="mt-10 border-t border-cavern-800 pt-6 flex flex-col items-center justify-between gap-4 text-xs text-limestone-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.legalName} Toate drepturile rezervate. Creditele fotografice și științifice aparțin autorilor menționați pe fiecare pagină (A.S. Speowest Arad, Cristi Mitrofan, Romeo Lazăr, Robert Valeriu Sarkozi, Claudiu Szabo, Mihai Besesek).
          </p>
          <div className="flex items-center gap-4">
            <Link href="/servicii" className="hover:text-limestone-200">
              Servicii
            </Link>
            <Link href="/magazin" className="hover:text-limestone-200">
              Magazin
            </Link>
            <Link href="/contact" className="hover:text-limestone-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

