import React from 'react';
import Link from 'next/link';
import { Sliders, Clock, Coins, Info } from 'lucide-react';
import type { TechnicalSpec } from '@/lib/content';

interface TechnicalSpecsCardProps {
  specs: TechnicalSpec[];
  scheduleSummary?: string | null;
  pricingSummary?: string | null;
  validationStatus?: string;
}

export function TechnicalSpecsCard({
  specs,
  scheduleSummary,
  pricingSummary,
  validationStatus,
}: TechnicalSpecsCardProps) {
  if ((!specs || specs.length === 0) && !scheduleSummary && !pricingSummary) {
    return null;
  }

  return (
    <section
      aria-label="Fișă tehnică și informații practice"
      className="my-8 rounded-2xl border border-cavern-700 bg-cavern-800/80 p-6 shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cavern-700 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <Sliders className="h-5 w-5 text-karst-400" aria-hidden="true" />
          <h2 className="text-lg font-bold text-limestone-100">
            Fișă Tehnică, Parametri Speologici și Informații de Acces
          </h2>
        </div>
        {validationStatus && (
          <span className="rounded-full border border-karst-500/40 bg-karst-500/10 px-3 py-1 text-xs font-mono font-medium text-karst-400">
            Date validate din sursa oficială
          </span>
        )}
      </div>

      {/* Schedule & Pricing Highlight Boxes */}
      {(scheduleSummary || pricingSummary) && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {scheduleSummary && (
            <div className="rounded-xl border border-cavern-600 bg-cavern-900/90 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-karst-400">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>Program de Vizitare / Acces</span>
              </div>
              <p className="mt-2 text-sm font-medium leading-relaxed text-limestone-100">
                {scheduleSummary}
              </p>
            </div>
          )}

          {pricingSummary && (
            <div className="rounded-xl border border-cavern-600 bg-cavern-900/90 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-safety-400">
                <Coins className="h-4 w-4" aria-hidden="true" />
                <span>Tarife și Condiții Financiare (Conform Sursă)</span>
              </div>
              <p className="mt-2 text-sm font-medium leading-relaxed text-limestone-100">
                {pricingSummary}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-limestone-300">
                <Info className="h-3.5 w-3.5 text-karst-400 shrink-0" aria-hidden="true" />
                <span>
                  Pentru grupuri organizate sau confirmarea tarifelor în sezonul curent,{' '}
                  <Link href="/contact" className="text-karst-400 underline hover:text-karst-300">
                    contactați administratorul
                  </Link>
                  .
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Technical Specs Grid */}
      {specs && specs.length > 0 && (
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map((spec, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-cavern-700/80 bg-cavern-900/60 p-3.5 transition hover:border-cavern-600"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-limestone-400">
                {spec.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-limestone-100 leading-snug">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

