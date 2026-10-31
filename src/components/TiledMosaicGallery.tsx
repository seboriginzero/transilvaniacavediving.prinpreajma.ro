'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Camera } from 'lucide-react';
import {
  getImageDimensions,
  normalizeFilename,
  isSmallLogoImage,
  getAllJetpackGalleries,
  type ImageDimensions,
} from '@/lib/visual-layout';

export interface MosaicImageItem {
  src: string;
  alt?: string;
  caption?: string;
  credit?: string;
  width?: number;
  height?: number;
}

interface EnrichedMosaicItem {
  img: MosaicImageItem;
  index: number;
  filename: string;
  dims: ImageDimensions;
  isSmallLogo: boolean;
}

interface ProportionalCol {
  flexWeight: number;
  items: EnrichedMosaicItem[];
}

interface ProportionalRow {
  isSingleStandalone?: boolean;
  cols: ProportionalCol[];
}

interface TiledMosaicGalleryProps {
  images: MosaicImageItem[];
  compact?: boolean;
}

function computeColEffectiveRatio(items: EnrichedMosaicItem[]): number {
  if (items.length === 0) return 1;
  // For vertically stacked images in a single column of width W,
  // total height H = W * sum(h_i / w_i) => W / H = 1 / sum(1 / r_i)
  let sumInverseRatio = 0;
  for (const it of items) {
    const r = it.dims.ratio > 0 ? it.dims.ratio : 1.3333;
    sumInverseRatio += 1 / r;
  }
  return sumInverseRatio > 0 ? Number((1 / sumInverseRatio).toFixed(5)) : 1;
}

/**
 * Builds proportional rows that preserve:
 * 1. Exact Jetpack Tiled Gallery row/column structures from source-data/raw/html/*.html
 *    whenever a gallery sequence matches one of the 56 original Jetpack galleries.
 * 2. Standalone uncropped rendering for single images, banners (grota.jpg, graphic1.jpg, visit.jpg),
 *    maps, diagrams, and brand logos.
 * 3. Proportional multi-column rows (using true pixel aspect ratios) for all other galleries,
 *    guaranteeing 0% cropping on every image.
 */
function buildProportionalRows(enriched: EnrichedMosaicItem[]): ProportionalRow[] {
  const total = enriched.length;
  if (total === 0) return [];

  if (total === 1) {
    return [
      {
        isSingleStandalone: true,
        cols: [{ flexWeight: 1, items: [enriched[0]] }],
      },
    ];
  }

  const allJetpack = getAllJetpackGalleries();
  const rows: ProportionalRow[] = [];

  // Check if any sub-sequence starting at `cursor` matches an exact Jetpack gallery from raw HTML
  let cursor = 0;
  while (cursor < total) {
    // If current item is a small brand logo (like on /magazin where logo precedes product gallery),
    // render the logo as its own standalone row first!
    if (enriched[cursor].isSmallLogo && total - cursor > 1) {
      rows.push({
        isSingleStandalone: true,
        cols: [{ flexWeight: 1, items: [enriched[cursor]] }],
      });
      cursor++;
      continue;
    }

    const remainingSlice = enriched.slice(cursor);
    const remainingFiles = remainingSlice.map((e) => e.filename);

    // Find longest matching Jetpack gallery starting at cursor
    let matchedGallery = null;
    for (const g of allJetpack) {
      if (g.count <= remainingFiles.length && g.firstFile === remainingFiles[0]) {
        const subSig = remainingFiles.slice(0, g.count).join('|');
        if (subSig === g.signature) {
          if (!matchedGallery || g.count > matchedGallery.count) {
            matchedGallery = g;
          }
        }
      }
    }

    if (matchedGallery) {
      let itemOffset = cursor;
      for (const jRow of matchedGallery.rows) {
        const cols: ProportionalCol[] = [];
        for (const jCol of jRow.cols) {
          const colItems: EnrichedMosaicItem[] = [];
          for (let k = 0; k < jCol.items.length; k++) {
            if (itemOffset < total) {
              colItems.push(enriched[itemOffset]);
              itemOffset++;
            }
          }
          if (colItems.length > 0) {
            cols.push({
              flexWeight: computeColEffectiveRatio(colItems),
              items: colItems,
            });
          }
        }
        if (cols.length > 0) {
          rows.push({ cols });
        }
      }
      cursor = itemOffset;
      continue;
    }

    // Check if there is a Jetpack gallery starting AFTER 1 standalone image
    if (remainingSlice.length >= 3) {
      const nextFiles = remainingFiles.slice(1);
      const nextMatch = allJetpack.find(
        (g) =>
          g.count <= nextFiles.length &&
          g.firstFile === nextFiles[0] &&
          nextFiles.slice(0, g.count).join('|') === g.signature
      );
      if (nextMatch) {
        rows.push({
          isSingleStandalone: true,
          cols: [{ flexWeight: 1, items: [enriched[cursor]] }],
        });
        cursor++;
        continue;
      }
    }

    // Fallback: proportional Jetpack-style rows of 2 or 3 columns using exact aspect ratios
    const rem = total - cursor;
    let take = 3;
    if (rem === 1) take = 1;
    else if (rem === 2 || rem === 4) take = 2;
    else take = 3;

    const rowSlice = enriched.slice(cursor, cursor + take);
    if (rowSlice.length === 1) {
      rows.push({
        isSingleStandalone: true,
        cols: [{ flexWeight: 1, items: rowSlice }],
      });
    } else {
      rows.push({
        cols: rowSlice.map((item) => ({
          flexWeight: computeColEffectiveRatio([item]),
          items: [item],
        })),
      });
    }
    cursor += take;
  }

  return rows;
}

function isMeaningfulCaption(text?: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (
    /^(whatsapp|img|dsc|p10|20\d\d|[0-9_-]+|imagine|fotografie|csm_|kw\d+|00\d+|grota|visit|graphic|transilvania cave diving)/i.test(
      trimmed
    )
  ) {
    return false;
  }
  return true;
}

export function TiledMosaicGallery({
  images,
  compact = false,
}: TiledMosaicGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const validImages = (images || []).filter(
    (img) => img.src && !img.src.includes('placeholder-cavern.svg')
  );

  const handlePrev = useCallback(() => {
    if (activeIndex === null || validImages.length === 0) return;
    setActiveIndex((activeIndex - 1 + validImages.length) % validImages.length);
  }, [activeIndex, validImages.length]);

  const handleNext = useCallback(() => {
    if (activeIndex === null || validImages.length === 0) return;
    setActiveIndex((activeIndex + 1) % validImages.length);
  }, [activeIndex, validImages.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, handlePrev, handleNext]);

  if (validImages.length === 0) return null;

  const enriched: EnrichedMosaicItem[] = validImages.map((img, index) => {
    const dims = getImageDimensions(img.src, img.width, img.height);
    const filename = normalizeFilename(img.src);
    const isSmallLogo = isSmallLogoImage(img.src, dims);
    return { img, index, filename, dims, isSmallLogo };
  });

  const rows = buildProportionalRows(enriched);
  const activeItem = activeIndex !== null ? enriched[activeIndex] : null;

  // Detect repeated alt texts across multiple images in the same gallery so we don't repeat them as captions
  const altCounts = new Map<string, number>();
  for (const v of validImages) {
    if (v.alt) {
      altCounts.set(v.alt, (altCounts.get(v.alt) || 0) + 1);
    }
  }

  const renderFigure = (item: EnrichedMosaicItem, delayMs: number, isStandalone = false) => {
    const { img, index, dims, isSmallLogo } = item;
    const hasUniqueAlt = Boolean(img.alt && (altCounts.get(img.alt) || 0) === 1);
    const displayCaption = isMeaningfulCaption(img.caption)
      ? img.caption
      : hasUniqueAlt && isMeaningfulCaption(img.alt)
      ? img.alt
      : undefined;

    if (isStandalone && isSmallLogo) {
      return (
        <figure
          key={`${img.src}-${index}`}
          className="my-4 flex flex-col items-center justify-center"
        >
          <button
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Mărește imaginea: ${img.alt || `Logo ${index + 1}`}`}
            className="overflow-hidden rounded-xl border border-cavern-600 bg-white p-3 shadow-md transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-karst-400"
          >
            <img
              src={img.src}
              alt={img.alt || `Logo ${index + 1}`}
              width={dims.width}
              height={dims.height}
              loading="lazy"
              className="block h-auto max-h-24 w-auto max-w-[240px] object-contain"
            />
          </button>
        </figure>
      );
    }

    return (
      <figure
        key={`${img.src}-${index}`}
        style={{
          transitionDelay: `${Math.min(delayMs, 350)}ms`,
        }}
        className={`tiled-mosaic-item group relative w-full overflow-hidden rounded-xl border border-cavern-700/90 bg-cavern-950 shadow-md ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <button
          type="button"
          onClick={() => setActiveIndex(index)}
          aria-label={`Mărește imaginea: ${img.alt || `Fotografie ${index + 1}`}`}
          className="relative block w-full overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-karst-400"
        >
          {/* 100% Uncropped Natural Aspect Ratio Image (block h-auto w-full) */}
          <img
            src={img.src}
            alt={img.alt || `Fotografie documentară ${index + 1}`}
            width={dims.width}
            height={dims.height}
            loading="lazy"
            className="tiled-mosaic-img block h-auto w-full"
          />

          {/* Subtle hover highlight & expand icon (never obscures banners at rest) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cavern-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg border border-limestone-100/20 bg-cavern-950/80 text-limestone-100 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 scale-90">
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          </span>

          {(displayCaption || img.credit) && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {displayCaption && (
                <p className="line-clamp-2 text-xs font-medium leading-snug text-limestone-50 drop-shadow">
                  {displayCaption}
                </p>
              )}
              {img.credit && (
                <p className="mt-0.5 font-mono text-[11px] text-karst-300 drop-shadow">
                  Foto: {img.credit}
                </p>
              )}
            </div>
          )}
        </button>
      </figure>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`wp-block-jetpack-tiled-gallery is-style-rectangular ${
        compact ? 'my-3 space-y-2' : 'my-6 space-y-2.5'
      }`}
    >
      {rows.map((row, rIdx) => {
        const baseDelay = rIdx * 60;

        if (row.isSingleStandalone && row.cols.length === 1 && row.cols[0].items.length === 1) {
          return (
            <div key={`row-${rIdx}`} className="w-full">
              {renderFigure(row.cols[0].items[0], baseDelay, true)}
            </div>
          );
        }

        return (
          <div
            key={`row-${rIdx}`}
            className="tiled-gallery__row flex w-full flex-col gap-2 sm:flex-row sm:items-start sm:gap-2.5"
          >
            {row.cols.map((col, cIdx) => (
              <div
                key={`col-${rIdx}-${cIdx}`}
                style={{
                  flex: `${col.flexWeight} 1 0%`,
                }}
                className="tiled-gallery__col flex w-full min-w-0 flex-col gap-2 sm:gap-2.5"
              >
                {col.items.map((item, iIdx) =>
                  renderFigure(item, baseDelay + cIdx * 45 + iIdx * 30, false)
                )}
              </div>
            ))}
          </div>
        );
      })}

      {/* Premium Full-Screen Lightbox with Filmstrip */}
      {activeItem && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vizualizare fotografie mărită"
          className="theme-hero-dark animate-lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-cavern-950/95 p-3 sm:p-6 backdrop-blur-md"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="animate-lightbox-content relative flex max-h-[94vh] w-full max-w-6xl flex-col items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="mb-2.5 flex w-full items-center justify-between text-xs text-limestone-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-cavern-700 bg-cavern-900/90 px-3.5 py-1.5 font-mono">
                <Camera className="h-3.5 w-3.5 text-karst-400" />
                Fotografia {activeIndex + 1} din {enriched.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                aria-label="Închide galeria foto"
                className="inline-flex items-center gap-1.5 rounded-lg border border-cavern-700 bg-cavern-800 px-3.5 py-1.5 text-limestone-100 transition hover:border-karst-400 hover:text-karst-400"
              >
                <span>Închide (Esc)</span>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-cavern-700 bg-cavern-900/90 p-2 shadow-2xl">
              {enriched.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Fotografia anterioară"
                  className="absolute left-3 z-10 rounded-full border border-cavern-600 bg-cavern-950/85 p-2.5 text-limestone-100 transition hover:scale-105 hover:border-karst-400 hover:text-karst-400"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <img
                key={activeItem.img.src}
                src={activeItem.img.src}
                alt={activeItem.img.alt || 'Imagine mărită'}
                width={activeItem.dims.width}
                height={activeItem.dims.height}
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain transition-all duration-300"
              />

              {enriched.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Fotografia următoare"
                  className="absolute right-3 z-10 rounded-full border border-cavern-600 bg-cavern-950/85 p-2.5 text-limestone-100 transition hover:scale-105 hover:border-karst-400 hover:text-karst-400"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Caption & Filmstrip */}
            <div className="mt-2.5 w-full space-y-2.5">
              {(isMeaningfulCaption(activeItem.img.caption) ||
                activeItem.img.credit) && (
                <div className="w-full rounded-xl border border-cavern-800 bg-cavern-900/90 px-4 py-2.5 text-center text-sm text-limestone-100">
                  {isMeaningfulCaption(activeItem.img.caption) && (
                    <p className="font-medium">{activeItem.img.caption}</p>
                  )}
                  {activeItem.img.credit && (
                    <p className="mt-0.5 font-mono text-xs text-karst-400">
                      Credit foto: {activeItem.img.credit}
                    </p>
                  )}
                </div>
              )}

              {enriched.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
                  {enriched.slice(0, 18).map((thumb, tIdx) => (
                    <button
                      key={`${thumb.img.src}-${tIdx}`}
                      type="button"
                      onClick={() => setActiveIndex(tIdx)}
                      aria-label={`Selectează fotografia ${tIdx + 1}`}
                      className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border bg-cavern-950 transition-all ${
                        tIdx === activeIndex
                          ? 'border-karst-400 ring-2 ring-karst-400/50 scale-105'
                          : 'border-cavern-700 opacity-55 hover:opacity-90'
                      }`}
                    >
                      <img
                        src={thumb.img.src}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
