import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import type { TranslationLink } from '@/lib/content';

interface LanguageSwitcherProps {
  currentLang: string;
  translations: TranslationLink[];
}

export function LanguageSwitcher({ currentLang, translations }: LanguageSwitcherProps) {
  const hasDirectTranslations = translations && translations.length > 0;

  const displayLinks: TranslationLink[] = hasDirectTranslations
    ? translations
    : [
        { lang: 'ro', path: '#', label: 'Română' },
        { lang: 'en', path: '/bat-cave', label: 'English (Bat Cave)' },
        { lang: 'en', path: '/the-mill-karst-system', label: 'English (Mill Karst)' },
        { lang: 'hu', path: '/denever-barlang', label: 'Magyar (Denevér-barlang)' },
        { lang: 'hu', path: '/a-malom-karsztrendszere', label: 'Magyar (Malom-karszt)' },
      ];

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cavern-700 bg-cavern-800/90 px-4 py-2.5 text-xs shadow-sm">
      <span className="inline-flex items-center gap-1.5 font-medium text-limestone-200">
        <Globe className="h-4 w-4 text-karst-400" aria-hidden="true" />
        {hasDirectTranslations
          ? 'Selectează limba pentru această pagină (RO / EN / HU):'
          : 'Documentație multilingvă disponibilă (RO / EN / HU):'}
      </span>
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Versiuni lingvistice">
        {displayLinks.map((t) => {
          const active = t.lang === currentLang && (hasDirectTranslations || t.lang === 'ro');
          if (t.path === '#') {
            return (
              <span
                key={`${t.lang}-${t.label}`}
                aria-current="page"
                className="rounded-lg bg-karst-600 px-3 py-1 font-semibold text-limestone-50 shadow-sm"
              >
                {t.label} ({t.lang.toUpperCase()})
              </span>
            );
          }
          return (
            <Link
              key={`${t.lang}-${t.path}`}
              href={t.path}
              aria-current={active ? 'page' : undefined}
              className={`rounded-lg px-3 py-1 font-semibold transition ${
                active
                  ? 'bg-karst-600 text-limestone-50 shadow-sm'
                  : 'border border-cavern-700 bg-cavern-900 text-limestone-200 hover:border-karst-400 hover:text-karst-400'
              }`}
            >
              {hasDirectTranslations ? `${t.label} (${t.lang.toUpperCase()})` : t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
