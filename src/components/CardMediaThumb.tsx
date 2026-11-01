import React from 'react';
import { getImageDimensions } from '@/lib/visual-layout';

interface CardMediaThumbProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Renders a card thumbnail that guarantees 100% of the source image (including wide banners
 * like grota.jpg / graphic1.jpg / visit.jpg, vertical posters, and studio product photos)
 * is completely visible without cropping (`object-contain`), while preserving a uniform
 * 16:10 card header frame with a subtle blurred ambient background.
 */
export function CardMediaThumb({ src, alt, className = '' }: CardMediaThumbProps) {
  const dims = getImageDimensions(src);

  return (
    <div
      className={`relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-black ${className}`}
    >
      {/* Subtle blurred ambient backdrop to fill any letterbox/pillarbox space organically */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl brightness-50"
      />

      {/* Foreground image: 100% uncropped (`object-contain`), never cuts off banners or products */}
      <img
        src={src}
        alt={alt}
        width={dims.width}
        height={dims.height}
        loading="lazy"
        className="relative z-10 max-h-full max-w-full object-contain transition duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}

