'use client';

import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface FullScreenImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  caption?: string;
}

export function FullScreenImageModal({
  isOpen,
  onClose,
  src,
  alt,
  caption,
}: FullScreenImageModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <div
        className="relative flex flex-col items-center max-h-[92vh] max-w-[94vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 inline-flex items-center gap-1.5 rounded-none skeuo-button-secondary px-4 py-1.5 text-xs font-semibold text-limestone-100 shadow-xl transition hover:border-karst-400 hover:text-white"
          aria-label="Închide vizualizarea ecran complet"
        >
          <X className="h-4 w-4" />
          <span>Închide (ESC)</span>
        </button>

        <div className="overflow-hidden rounded-none skeuo-glass p-2 shadow-2xl">
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] max-w-[90vw] object-contain"
          />
        </div>

        {caption && (
          <p className="mt-3 text-center text-xs font-medium text-limestone-300">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

