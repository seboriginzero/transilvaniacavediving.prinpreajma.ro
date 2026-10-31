import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, ShieldAlert, Building2, ExternalLink } from 'lucide-react';
import type { CompanyInfo } from '@/lib/content';

interface FooterProps {
  company: CompanyInfo;
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

