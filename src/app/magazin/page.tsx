import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShoppingBag,
  Truck,
  RotateCcw,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  getPageByPath,
  getEquipmentArticles,
} from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { MarkdownContent } from '@/components/MarkdownContent';
import { EquipmentShowcase } from '@/components/EquipmentShowcase';
import { CardMediaThumb } from '@/components/CardMediaThumb';

export const metadata = (() => {
  const page = getPageByPath('/magazin');
  return page
    ? buildPageMetadata(page, '/magazin')
    : { title: 'Magazin Echipamente Scufundări și Speologie' };
})();

export default function MagazinPage() {
  const page = getPageByPath('/magazin');
  if (!page) notFound();

  const productArticles = getEquipmentArticles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="rounded-2xl border border-cavern-700 bg-cavern-800/90 p-6 sm:p-10 shadow-xl">
        <Breadcrumbs items={[{ name: 'Magazin', path: '/magazin' }]} />
        <div className="mt-2 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-karst-400">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Distribuție Oficială Echipamente Scufundări, Speologie &amp; Salvare
            </span>
            <h1 className="mt-2 font-serif text-3xl font-bold text-limestone-50 sm:text-5xl">
              Magazin Echipamente Tehnice și Accesorii
            </h1>
            <p className="mt-4 text-base leading-relaxed text-limestone-200">
              Comercializăm și configurăm o gamă completă de echipamente pentru scufundări recreaționale, tehnice, cave diving, speologie și lucrări subacvatice sau de salvare de la producători consacrați: <strong className="text-limestone-50">Fenix, TecLine, Ammonite System, Kwark, UR-Flex, Bauer Kompressoren, Ursuit, Si Tech și Shearwater Research</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row shrink-0">
            <a
              href="tel:+40770846001"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-karst-600 px-5 py-3 text-sm font-semibold text-limestone-50 shadow-md transition hover:bg-karst-500"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>Comenzi &amp; Consultanță: +40 770 846 001</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cavern-600 bg-cavern-900 px-5 py-3 text-sm font-medium text-limestone-100 transition hover:border-karst-400"
            >
              Solicită Ofertă Personalizată
            </Link>
          </div>
        </div>

        {/* Key Commercial Highlights (Shipping, Payment, OUG 34/2014 Return Policy) */}
        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-cavern-700 pt-8 md:grid-cols-3">
          <div className="rounded-xl border border-cavern-700 bg-cavern-900/80 p-5">
            <div className="flex items-center gap-2.5 text-karst-400">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-serif text-base font-bold text-limestone-50">
                Comandă Telefonică, WhatsApp sau Email
              </h2>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-limestone-200">
              Comenzile se preiau la <strong className="font-mono text-karst-400">+40 770 846 001</strong>, pe WhatsApp sau prin formularul de contact. Plata se efectuează <strong className="text-limestone-50">ramburs la curier</strong> sau prin <strong className="text-limestone-50">ordin de plată bancar</strong>.
            </p>
          </div>

          <div className="rounded-xl border border-cavern-700 bg-cavern-900/80 p-5">
            <div className="flex items-center gap-2.5 text-karst-400">
              <Truck className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-serif text-base font-bold text-limestone-50">
                Transport Gratuit Peste 300 Lei
              </h2>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-limestone-200">
              Pentru comenzile cu valoare de peste <strong className="text-limestone-50">300 lei</strong>, transportul este <strong className="text-karst-400">gratuit</strong> în localitățile aflate în aria standard de acoperire a firmei de curierat.
            </p>
          </div>

          <div className="rounded-xl border border-cavern-700 bg-cavern-900/80 p-5">
            <div className="flex items-center gap-2.5 text-safety-400">
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-serif text-base font-bold text-limestone-50">
                Retur în 14 Zile (O.U.G. 34/2014)
              </h2>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-limestone-200">
              Conform <strong className="text-limestone-50">O.U.G. nr. 34/2014</strong>, produsele pot fi returnate în termen de <strong className="text-limestone-50">14 zile calendaristice</strong> de la primire, în ambalajul original, fără urme de uzură.
            </p>
          </div>
        </div>
      </div>

      {/* Professional Showcase of All 9 Brands, Models, Technical Specs & Tiled Product Galleries */}
      <EquipmentShowcase />

      {/* Detailed Product Technical Sheets from Archive */}
      {productArticles.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-cavern-700 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-karst-400">
                Specificații detaliate, autonomie și teste de teren
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-limestone-50 sm:text-3xl">
                Fișe Tehnice de Produse și Prezentări Echipamente ({productArticles.length} Articole)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productArticles.map((art) => (
              <Link
                key={art.path}
                href={art.path}
                className="group flex flex-col overflow-hidden rounded-2xl border border-cavern-700 bg-cavern-800/90 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-karst-500"
              >
                <CardMediaThumb src={art.heroImage} alt={art.cleanTitle} />
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="font-mono text-xs text-karst-400">
                      {art.publicationDate?.slice(0, 10)}
                    </span>
                    <h3 className="mt-1 font-serif text-lg font-bold text-limestone-100 group-hover:text-karst-400">
                      {art.cleanTitle}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-limestone-300">
                      {art.metaDescription}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-karst-400">
                    Vezi specificațiile tehnice <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Complete Original Terms & Conditions from /magazin/ */}
      <section className="rounded-2xl border border-cavern-700 bg-cavern-800/60 p-6 sm:p-8 shadow-xl">
        <h2 className="mb-6 border-b border-cavern-700 pb-3 font-serif text-2xl font-bold text-limestone-50">
          Condiții Complete de Comandă, Livrare și Returnare (Text Oficial Integral)
        </h2>
        <MarkdownContent markdown={page.bodyMarkdown} />
      </section>
    </div>
  );
}
