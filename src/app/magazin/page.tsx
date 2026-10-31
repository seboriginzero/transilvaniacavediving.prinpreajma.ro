import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShoppingBag,
  Truck,
  RotateCcw,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { getPageByPath } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { MarkdownContent } from '@/components/MarkdownContent';
import { EquipmentShowcase } from '@/components/EquipmentShowcase';

export const metadata = (() => {
  const page = getPageByPath('/magazin');
  return page
    ? buildPageMetadata(page, '/magazin')
    : { title: 'Magazin Echipamente Scufundări și Speologie' };
})();

/**
 * Extracts only the commercial, ordering, delivery, and OUG 34/2014 return policy blocks
 * from /magazin bodyMarkdown so the 9 brand logos and 38 product photos already shown
 * in <EquipmentShowcase /> are never rendered a second time on the page.
 */
function extractCommercialTermsMarkdown(bodyMarkdown: string): string {
  const blocks = bodyMarkdown
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const kept: string[] = [];
  let inBrandGalleries = false;

  for (const block of blocks) {
    // Skip the intro brand links line since all 9 brands are in EquipmentShowcase
    if (block.startsWith('### Transilvania Cave Diving distribuie echipamente')) {
      continue;
    }
    // Start of brand logos/galleries inside bodyMarkdown
    if (block.includes('/media/logos/fenix_logo-e.jpg')) {
      inBrandGalleries = true;
      continue;
    }
    // Resume at "### Livrare și plată"
    if (/^###\s+Livrare/i.test(block)) {
      inBrandGalleries = false;
    }
    if (!inBrandGalleries && !block.startsWith('![')) {
      kept.push(block);
    }
  }

  return kept.join('\n\n');
}

export default function MagazinPage() {
  const page = getPageByPath('/magazin');
  if (!page) notFound();

  const termsMarkdown = extractCommercialTermsMarkdown(page.bodyMarkdown);

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

      {/* Complete Original Terms & Conditions from /magazin/ (without repeating brand galleries) */}
      <section className="rounded-2xl border border-cavern-700 bg-cavern-800/60 p-6 sm:p-8 shadow-xl">
        <h2 className="mb-6 border-b border-cavern-700 pb-3 font-serif text-2xl font-bold text-limestone-50">
          Condiții Complete de Comandă, Livrare și Returnare
        </h2>
        <MarkdownContent markdown={termsMarkdown} />
      </section>
    </div>
  );
}
