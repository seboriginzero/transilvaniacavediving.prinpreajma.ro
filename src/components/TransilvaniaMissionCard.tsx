'use client';

import React, { useState } from 'react';
import { Maximize2, Sparkles } from 'lucide-react';
import { FullScreenImageModal } from './FullScreenImageModal';

export function TransilvaniaMissionCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="rounded-none skeuo-glass p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="group relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-none border border-cavern-700 bg-black p-2.5 shadow-lg transition hover:border-karst-400 hover:shadow-karst-500/20 focus:outline-none focus:ring-2 focus:ring-karst-400 active:scale-95"
            title="Apasă pentru vizualizare pe tot ecranul"
            aria-label="Apasă pentru vizualizare completă siglă Transilvania"
          >
            <img
              src="/media/logos/transilvania-logo-full.jpg"
              alt="Logo oficial Transilvania"
              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
              width={828}
              height={934}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition duration-200 group-hover:opacity-100">
              <Maximize2 className="h-6 w-6 text-white" />
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-limestone-200">
                Ecran complet
              </span>
            </div>
          </button>

          <div className="flex-1 text-center sm:text-left space-y-2.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-karst-400">
                Misiune și Patrimoniu
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-limestone-50">
              Proiectul „Transilvania”
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-limestone-200 max-w-3xl font-medium">
              „Transilvania” este un proiect dedicat promovării activităților de turism speologic, a scufundărilor, precum și pentru amenajarea și promovarea altor destinații turistice.
            </p>
          </div>
        </div>
      </div>

      <FullScreenImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        src="/media/logos/transilvania-logo-full.jpg"
        alt="Logo oficial Transilvania — vizualizare ecran complet"
        caption="Emblema oficială Transilvania · Munții Codru-Moma"
      />
    </>
  );
}

