'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Globe } from 'lucide-react';
import type { NavItem } from '@/lib/content';

interface HeaderProps {
  navigation: NavItem[];
  phonePrimary: string;
}

type SiteLang = 'ro' | 'en' | 'hu';

const NAV_TRANSLATIONS: Record<SiteLang, Record<string, string>> = {
  ro: {},
  en: {
    '/': 'Home',
    '/descopera': 'Explore Caves',
    '/aventuri': 'Adventures',
    '/servicii': 'Services',
    '/istorie-si-patrimoniu': 'History & Heritage',
    '/jurnal': 'Journal',
    '/magazin': 'Shop',
    '/contact': 'Contact',
  },
  hu: {
    '/': 'Főoldal',
    '/descopera': 'Barlangok',
    '/aventuri': 'Kalandok',
    '/servicii': 'Szolgáltatások',
    '/istorie-si-patrimoniu': 'Történelem',
    '/jurnal': 'Napló',
    '/magazin': 'Üzlet',
    '/contact': 'Kapcsolat',
  },
};

const MULTILINGUAL_GROUPS: Record<string, Record<SiteLang, string>> = {
  '/pestera-liliecilor': {
    ro: '/pestera-liliecilor',
    en: '/bat-cave',
    hu: '/denever-barlang',
  },
  '/bat-cave': {
    ro: '/pestera-liliecilor',
    en: '/bat-cave',
    hu: '/denever-barlang',
  },
  '/denever-barlang': {
    ro: '/pestera-liliecilor',
    en: '/bat-cave',
    hu: '/denever-barlang',
  },
  '/pestera-uscata-de-la-moara': {
    ro: '/pestera-uscata-de-la-moara',
    en: '/the-mill-karst-system',
    hu: '/a-malom-karsztrendszere',
  },
  '/the-mill-karst-system': {
    ro: '/pestera-uscata-de-la-moara',
    en: '/the-mill-karst-system',
    hu: '/a-malom-karsztrendszere',
  },
  '/a-malom-karsztrendszere': {
    ro: '/pestera-uscata-de-la-moara',
    en: '/the-mill-karst-system',
    hu: '/a-malom-karsztrendszere',
  },
};

function detectLangFromPath(pathname: string): SiteLang | null {
  if (pathname === '/bat-cave' || pathname === '/the-mill-karst-system') return 'en';
  if (pathname === '/denever-barlang' || pathname === '/a-malom-karsztrendszere') return 'hu';
  if (pathname === '/pestera-liliecilor' || pathname === '/pestera-uscata-de-la-moara') return 'ro';
  return null;
}

export function Header({ navigation, phonePrimary }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<SiteLang>('ro');

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    const pathLang = detectLangFromPath(pathname);
    if (pathLang) {
      setSelectedLang(pathLang);
    }
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLanguageSelect = (lang: SiteLang) => {
    setSelectedLang(lang);
    const group = MULTILINGUAL_GROUPS[pathname];
    if (group && group[lang]) {
      router.push(group[lang]);
      return;
    }
    // If on another page and selecting EN or HU, navigate to the primary EN/HU page if currently on a translated page,
    // or if switching back to RO from an EN/HU route
    if (lang === 'en' && (pathname === '/denever-barlang' || pathname === '/pestera-liliecilor')) {
      router.push('/bat-cave');
    } else if (lang === 'hu' && (pathname === '/bat-cave' || pathname === '/pestera-liliecilor')) {
      router.push('/denever-barlang');
    }
  };

  const getTranslatedNavLabel = (item: NavItem): string => {
    if (selectedLang === 'ro') return item.label;
    return NAV_TRANSLATIONS[selectedLang][item.href] || item.label;
  };

  const getLangHref = (lang: SiteLang): string => {
    const group = MULTILINGUAL_GROUPS[pathname];
    if (group && group[lang]) return group[lang];
    if (lang === 'ro') return pathname === '/bat-cave' || pathname === '/denever-barlang' ? '/pestera-liliecilor' : pathname === '/the-mill-karst-system' || pathname === '/a-malom-karsztrendszere' ? '/pestera-uscata-de-la-moara' : pathname || '/';
    if (lang === 'en') return '/bat-cave';
    return '/denever-barlang';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cavern-700/70 bg-cavern-900/90 backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-karst-600 focus:px-4 focus:py-2.5 focus:font-semibold focus:text-limestone-50 focus:shadow-lg"
      >
        Sari la conținutul principal
      </a>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3.5 sm:px-6 lg:px-6 xl:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-karst-400"
          aria-label="Transilvania Cave Diving — Acasă"
        >
          <img
            src="/media/logos/tcd-logo.svg"
            alt="Transilvania Cave Diving Logo"
            className="h-9 w-auto sm:h-10 lg:h-9 xl:h-11"
            width={185}
            height={44}
          />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Navigare principală" className="hidden lg:flex lg:items-center lg:gap-0.5 xl:gap-1">
          {navigation.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`) ||
                  (item.children && item.children.some((c) => pathname === c.href));

            const displayLabel = getTranslatedNavLabel(item);

            if (item.children && item.children.length > 0) {
              const isOpen = openDropdown === item.href;
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-l-md px-1.5 py-2 text-xs font-medium transition xl:px-2.5 xl:text-sm ${
                        isActive
                          ? 'font-semibold text-karst-400'
                          : 'text-limestone-100 hover:text-karst-400'
                      }`}
                    >
                      {displayLabel}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-label={`Submeniu ${displayLabel}`}
                      onClick={() => setOpenDropdown(isOpen ? null : item.href)}
                      className={`inline-flex items-center rounded-r-md px-0.5 py-2 text-xs transition xl:px-1 xl:text-sm ${
                        isActive
                          ? 'text-karst-400'
                          : 'text-limestone-300 hover:text-karst-400'
                      }`}
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform xl:h-4 xl:w-4 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="absolute left-0 top-full z-50 w-72 pt-2">
                      <div className="rounded-xl border border-cavern-700 bg-cavern-900 p-2 shadow-xl">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition ${
                              pathname === child.href
                                ? 'bg-cavern-800 font-semibold text-karst-400'
                                : 'text-limestone-100 hover:bg-cavern-800 hover:text-karst-400'
                            }`}
                          >
                            <span>{child.label}</span>
                            {child.badge && (
                              <span className="ml-2 rounded border border-cavern-700 bg-cavern-950 px-1.5 py-0.5 font-mono text-[10px] text-karst-400">
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-md px-1.5 py-2 text-xs font-medium transition xl:px-2.5 xl:text-sm ${
                  isActive
                    ? 'font-semibold text-karst-400'
                    : item.href === '/contact'
                    ? 'ml-1 rounded-lg bg-karst-600 px-2.5 py-1.5 font-semibold text-limestone-50 hover:bg-karst-500 xl:ml-1.5 xl:px-3.5 xl:py-2'
                    : 'text-limestone-100 hover:text-karst-400'
                }`}
              >
                {displayLabel}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions on Desktop: Phone Icon + RO / EN / HU Language Selector Buttons */}
        <div className="hidden shrink-0 lg:flex lg:items-center lg:gap-1.5 xl:gap-2.5">
          {/* Phone Icon Only (number hidden as requested) */}
          <a
            href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
            title={`Apelează ${phonePrimary}`}
            aria-label={`Apelează ${phonePrimary}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cavern-700 bg-cavern-800/80 text-karst-400 transition hover:border-karst-400 hover:bg-cavern-700 hover:text-limestone-50 xl:h-9 xl:w-9"
          >
            <Phone className="h-3.5 w-3.5 xl:h-4 xl:w-4" aria-hidden="true" />
            <span className="sr-only">{phonePrimary}</span>
          </a>

          {/* Language Selector Buttons: RO | EN | HU */}
          <div
            role="group"
            aria-label="Selectează limba (RO / EN / HU)"
            className="inline-flex items-center rounded-lg border border-cavern-700 bg-cavern-800/90 p-0.5"
          >
            {(['ro', 'en', 'hu'] as const).map((lang) => {
              const isCurrent = selectedLang === lang;
              const targetHref = getLangHref(lang);
              return (
                <Link
                  key={lang}
                  href={targetHref}
                  onClick={() => handleLanguageSelect(lang)}
                  aria-current={isCurrent ? 'true' : undefined}
                  title={
                    lang === 'ro'
                      ? 'Română (RO)'
                      : lang === 'en'
                      ? 'English (EN)'
                      : 'Magyar (HU)'
                  }
                  className={`rounded-md px-1.5 py-1 font-mono text-[11px] font-bold uppercase transition xl:px-2.5 xl:text-xs ${
                    isCurrent
                      ? 'bg-karst-600 text-limestone-50 shadow-sm'
                      : 'text-limestone-300 hover:bg-cavern-700 hover:text-limestone-50'
                  }`}
                >
                  {lang.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Right Controls: Compact RO/EN/HU + Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <div
            role="group"
            aria-label="Selectează limba"
            className="inline-flex items-center rounded-lg border border-cavern-700 bg-cavern-800/90 p-0.5"
          >
            {(['ro', 'en', 'hu'] as const).map((lang) => {
              const isCurrent = selectedLang === lang;
              const targetHref = getLangHref(lang);
              return (
                <Link
                  key={lang}
                  href={targetHref}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`rounded px-2 py-1 font-mono text-[11px] font-bold uppercase transition ${
                    isCurrent
                      ? 'bg-karst-600 text-limestone-50'
                      : 'text-limestone-300 hover:text-limestone-50'
                  }`}
                >
                  {lang.toUpperCase()}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileOpen ? 'Închide meniul de navigare' : 'Deschide meniul de navigare'}
            className="inline-flex items-center justify-center rounded-lg border border-cavern-700 bg-cavern-800 p-2.5 text-limestone-100 hover:border-karst-500 hover:text-karst-400 focus:outline-none focus:ring-2 focus:ring-karst-400"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Navigare mobilă"
          className="max-h-[82vh] overflow-y-auto border-t border-cavern-700 bg-cavern-900 px-4 pb-6 pt-3 shadow-2xl lg:hidden"
        >
          {/* Mobile Language Selector Strip */}
          <div className="mb-3 flex items-center justify-between rounded-xl border border-cavern-700 bg-cavern-950/70 px-3.5 py-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-limestone-300">
              <Globe className="h-4 w-4 text-karst-400" aria-hidden="true" />
              Limbă / Language / Nyelv:
            </span>
            <div className="flex items-center gap-1.5">
              {(['ro', 'en', 'hu'] as const).map((lang) => {
                const isCurrent = selectedLang === lang;
                return (
                  <Link
                    key={lang}
                    href={getLangHref(lang)}
                    onClick={() => {
                      handleLanguageSelect(lang);
                      setMobileOpen(false);
                    }}
                    className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold uppercase ${
                      isCurrent
                        ? 'bg-karst-600 text-limestone-50'
                        : 'border border-cavern-700 bg-cavern-800 text-limestone-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            {navigation.map((item) => (
              <div key={item.href} className="rounded-lg border border-cavern-800 bg-cavern-950/40 p-2">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-semibold text-limestone-100 hover:bg-cavern-800 hover:text-karst-400"
                >
                  {getTranslatedNavLabel(item)}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-cavern-700 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-md px-2.5 py-1.5 text-sm text-limestone-300 hover:bg-cavern-800 hover:text-karst-400"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
