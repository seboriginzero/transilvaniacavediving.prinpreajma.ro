'use client';

import React from 'react';
import { Camera } from 'lucide-react';
import type { MediaImage } from '@/lib/content';
import { TiledMosaicGallery } from '@/components/TiledMosaicGallery';

interface MediaGalleryProps {
  images: MediaImage[];
  title?: string;
}

export function MediaGallery({
  images,
  title = 'Galerie Foto Documentară și Arhivă Vizuală',
}: MediaGalleryProps) {
  const validImages = (images || []).filter(
    (img) => img.localPath && !img.localPath.includes('placeholder-cavern.svg')
  );

  if (validImages.length === 0) return null;

  const mosaicItems = validImages.map((img) => ({
    src: img.localPath,
    alt: img.alt,
    caption: img.caption,
    credit: img.credit,
    width: img.width,
    height: img.height,
  }));

  return (
    <section aria-label={title} className="my-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-cavern-700 pb-3">
        <div className="flex items-center gap-2.5">
          <Camera className="h-5 w-5 text-karst-400" aria-hidden="true" />
          <h2 className="font-serif text-2xl font-bold text-limestone-100">{title}</h2>
        </div>
        <span className="rounded-none border border-cavern-700 bg-cavern-900 px-3 py-1 font-mono text-xs text-limestone-300">
          {validImages.length} {validImages.length === 1 ? 'fotografie' : 'fotografii'} în galerie (click pentru mărire)
        </span>
      </div>

      <TiledMosaicGallery images={mosaicItems} />
    </section>
  );
}
