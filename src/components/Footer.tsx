import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, ShieldAlert, Building2, ExternalLink } from 'lucide-react';
import type { CompanyInfo } from '@/lib/content';

interface FooterProps {
  company: CompanyInfo;
}

const FEATURED_FACEBOOK_PAGES = [
  {
    name: 'Transilvania',
    subtitle: 'Transilvania Moneasa',
    followers: '1,047 urmăritori',
    href: 'https://www.facebook.com/cavedivingromania',
    avatar: '/media/logos/tcd-vampire-logo.svg',
  },
  {
    name: 'Peștera Grota Ursului - Moneasa',
    subtitle: 'Obiectiv Turistic și Speologic',
    followers: '2,382 urmăritori',
    href: 'https://www.facebook.com/Pe%C8%99tera-Grota-Ursului-Moneasa-108508321317590',
    avatar: '/media/logos/logo-grota-ursului-2025.jpg',
  },
  {
    name: 'Belvedere Moneasa',
    subtitle: 'Punct Belvedere și Cariera de Marmură',
    followers: '1,120 urmăritori',
    href: 'https://www.facebook.com/Belvedere-Moneasa-105856912164648',
    avatar: '/media/belvedere/belvedere-moneasa-2.jpg',
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
    label: 'Grota Ursului (Share)',
    href: 'https://www.facebook.com/share/1WHBh6Nj2z/',
  },
  {
    label: 'Makita România (Partener)',
    href: 'https://www.facebook.com/MakitaRomaniaSRL/',
  },
];

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

export function Footer({ company }: FooterProps) {
  return (
    <footer className="border-t border-cavern-700 bg-cavern-950 text-limestone-300">
      {/* Safety & Emergency Strip */}
      <div className="border-b border-cavern-700 bg-cavern-900/80 px-4 py-4">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-safety-400" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-limestone-200">
              <strong className="text-safety-400">Avertisment de Siguranță Montană:</strong> Parcurgerea traseelor de via ferrata și explorarea peșterilor implică atenție și necesită echipament adecvat de protecție sau ghidaj autorizat.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-xs">
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
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
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
              Administrare și ghidaj autorizat în Peștera Grota Ursului (Moneasa), întreținere Via Ferrata Cetatea Dezna și promovarea patrimoniului istoric lăsat de Czárán Gyula.
            </p>
            <div className="rounded-xl border border-cavern-700 bg-cavern-900/70 p-3.5 text-xs space-y-1.5 text-limestone-200">
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

          {/* Column 2: Obiective Carstice Moneasa și Dezna */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-limestone-100">
              Obiective Turistice Moneasa
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/grota-ursului" className="hover:text-karst-400 transition">
                  Peștera Grota Ursului – Moneasa
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
                <Link href="/moneasa-adventure" className="hover:text-karst-400 transition">
                  Moneasa Adventure (Școala Altfel și Săptămâna Verde)
                </Link>
              </li>
              <li className="pt-2 border-t border-cavern-700 text-xs text-limestone-400">
                Ghiduri Trasee QR (EN / HU):
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <Link href="/bear-cave" className="rounded bg-cavern-900 px-2 py-1 text-limestone-200 hover:text-karst-400">
                    Bear's Cave (EN)
                  </Link>
                  <Link href="/medve-barlang" className="rounded bg-cavern-900 px-2 py-1 text-limestone-200 hover:text-karst-400">
                    Medve-barlang (HU)
                  </Link>
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

          {/* Column 3: Contact și Administrare */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-limestone-100">
              Informații Vizitare și Contact
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
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
              <li className="text-xs leading-relaxed text-limestone-300 pt-2">
                Pentru rezervări de grup la Peștera Grota Ursului, tururi ghidate sau informații Via Ferrata:
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-karst-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-karst-500"
                >
                  Trimite o Solicitare sau Rezervare
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
              <li className="pt-3 border-t border-cavern-700">
                <Link
                  href="/administrator"
                  className="inline-flex items-center gap-1.5 text-xs text-limestone-400 hover:text-karst-400 transition"
                >
                  <span>Panou Administrare Orare și Prețuri</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Facebook Section */}
        <div className="mt-10 border-t border-cavern-700 pt-8">
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
                  Urmărește noutățile din Stațiunea Moneasa și Peștera Grota Ursului
                </p>
              </div>
            </div>
          </div>

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
                      width={56}
                      height={56}
                    />
                  </a>
                  <div className="min-w-0 flex-1">
                    <a
                      href={fb.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-display text-base font-semibold text-limestone-50 hover:text-karst-400 hover:underline"
                    >
                      {fb.name}
                    </a>
                    <p className="truncate text-xs text-limestone-400">{fb.subtitle}</p>
                    <p className="font-mono text-xs font-semibold text-karst-400 mt-0.5">
                      {fb.followers}
                    </p>
                  </div>
                </div>

                <div className="border-t border-cavern-700 bg-cavern-950/70 px-4 py-2.5 flex items-center justify-between">
                  <a
                    href={fb.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-karst-400 hover:text-karst-300 transition"
                  >
                    <FacebookIcon className="h-3.5 w-3.5" />
                    <span>Urmărește</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-cavern-700/80 text-xs">
            <span className="font-mono text-limestone-400">Link-uri comunitate:</span>
            {ADDITIONAL_FACEBOOK_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-cavern-700 bg-cavern-900/60 px-2.5 py-1 text-limestone-300 hover:border-cavern-600 hover:text-limestone-50 transition"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-cavern-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-limestone-400">
          <div>
            © {new Date().getFullYear()} {company.brandName}. Toate drepturile rezervate.
          </div>
          <div>Stațiunea Balneoclimaterică Moneasa · Munții Codru-Moma</div>
        </div>
      </div>
    </footer>
  );
}
