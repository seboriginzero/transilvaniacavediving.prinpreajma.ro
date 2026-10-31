import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-24 text-center">
      <div className="rounded-2xl border border-karst-500/30 bg-cavern-800 p-4 text-karst-400">
        <Compass className="h-12 w-12" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-limestone-50 sm:text-5xl">
        404 — Galerie Subterană Neexplorată
      </h1>
      <p className="mt-4 max-w-xl text-base text-limestone-300">
        Pagina pe care o căutați nu există la această adresă sau a fost reorganizată în noua arhitectură informațională Transilvania Cave Diving.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-karst-600 px-5 py-3 text-sm font-bold text-cavern-950 transition hover:bg-karst-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi la Pagina Principală
        </Link>
        <Link
          href="/descopera"
          className="rounded-xl border border-cavern-600 bg-cavern-800 px-5 py-3 text-sm font-semibold text-limestone-100 transition hover:border-karst-400 hover:text-karst-400"
        >
          Descoperă Peșterile
        </Link>
        <Link
          href="/jurnal"
          className="rounded-xl border border-cavern-600 bg-cavern-800 px-5 py-3 text-sm font-semibold text-limestone-100 transition hover:border-karst-400 hover:text-karst-400"
        >
          Arhiva Jurnal
        </Link>
      </div>
    </div>
  );
}

