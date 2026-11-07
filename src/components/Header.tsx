'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Globe,
  Sun,
  Moon,
  Check,
  ExternalLink,
} from 'lucide-react';
import type { NavItem } from '@/lib/content';

interface HeaderProps {
  navigation: NavItem[];
  phonePrimary: string;
}

type SiteLang = 'ro' | 'en' | 'hu';
type ThemeMode = 'dark' | 'light';

const LANGUAGES: { code: SiteLang; label: string; flag: string; flagEmoji: string }[] = [
  { code: 'ro', label: 'Română', flag: 'RO', flagEmoji: '🇷🇴' },
  { code: 'en', label: 'English', flag: 'EN', flagEmoji: '🇬🇧' },
  { code: 'hu', label: 'Magyar', flag: 'HU', flagEmoji: '🇭🇺' },
];

// Direct route mapping between translated equivalents
const ROUTE_TRANSLATIONS: Record<string, { ro: string; en: string; hu: string }> = {
  // Peștera Liliecilor (Bat Cave / Denevér-barlang)
  '/pestera-liliecilor': { ro: '/pestera-liliecilor', en: '/bat-cave', hu: '/denever-barlang' },
  '/bat-cave': { ro: '/pestera-liliecilor', en: '/bat-cave', hu: '/denever-barlang' },
  '/denever-barlang': { ro: '/pestera-liliecilor', en: '/bat-cave', hu: '/denever-barlang' },

  // Sistemul Carstic de la Moară (The Mill Karst / Malom Karsztrendszer)
  '/pestera-uscata-de-la-moara': { ro: '/pestera-uscata-de-la-moara', en: '/the-mill-karst-system', hu: '/a-malom-karsztrendszere' },
  '/the-mill-karst-system': { ro: '/pestera-uscata-de-la-moara', en: '/the-mill-karst-system', hu: '/a-malom-karsztrendszere' },
  '/a-malom-karsztrendszere': { ro: '/pestera-uscata-de-la-moara', en: '/the-mill-karst-system', hu: '/a-malom-karsztrendszere' },

  // Grota Ursului (Bear's Cave / Medve-barlang)
  '/grota-ursului': { ro: '/grota-ursului', en: '/bear-cave', hu: '/medve-barlang' },
  '/bear-cave': { ro: '/grota-ursului', en: '/bear-cave', hu: '/medve-barlang' },
  '/medve-barlang': { ro: '/grota-ursului', en: '/bear-cave', hu: '/medve-barlang' },

  // Via Ferrata Cetatea Dezna
  '/via-ferrata-cetate-dezna': { ro: '/via-ferrata-cetate-dezna', en: '/via-ferrata-dezna-en', hu: '/via-ferrata-dezna-hu' },
  '/via-ferrata-dezna-en': { ro: '/via-ferrata-cetate-dezna', en: '/via-ferrata-dezna-en', hu: '/via-ferrata-dezna-hu' },
  '/via-ferrata-dezna-hu': { ro: '/via-ferrata-cetate-dezna', en: '/via-ferrata-dezna-en', hu: '/via-ferrata-dezna-hu' },
};

// Localized navigation items
const NAV_EN: NavItem[] = [
  { label: 'Home', href: '/', description: 'Home Page' },
  {
    label: 'Attractions & Trails',
    href: '/descopera',
    description: 'Caves and mountain trails in Moneasa and Dezna',
    children: [
      { label: "Bear's Cave", href: '/bear-cave', badge: 'Electrified trail · 200 m' },
      { label: 'Bat Cave', href: '/bat-cave', badge: '1.3 km · blue stripe' },
      { label: 'The Mill Karst System', href: '/the-mill-karst-system', badge: 'Natura 2000' },
      { label: 'Via Ferrata Dezna', href: '/via-ferrata-dezna-en', badge: '600 m · grade B' },
      { label: 'Belvedere Moneasa', href: '/belvedere-moneasa', badge: '2.7 km · red dot' },
      { label: 'Moneasa Adventure', href: '/moneasa-adventure', badge: 'Adventure Park' },
    ],
  },
  {
    label: 'History & Heritage',
    href: '/statiunea-moneasa',
    description: 'Moneasa Resort & Gyula Czárán',
    children: [
      { label: 'Moneasa Resort', href: '/statiunea-moneasa', badge: 'Since 1597' },
      { label: 'Gyula Czárán', href: '/czaran-gyula', badge: '1847–1906' },
    ],
  },
  { label: 'Contact', href: '/contact', description: 'Contact & Bookings' },
];

const NAV_HU: NavItem[] = [
  { label: 'Kezdőlap', href: '/', description: 'Főoldal' },
  {
    label: 'Látnivalók és Útvonalak',
    href: '/descopera',
    description: 'Barlangok és hegyi túrák Menyházán és Déznán',
    children: [
      { label: 'Medve-barlang', href: '/medve-barlang', badge: 'Kivilágított út · 200 m' },
      { label: 'Denevér-barlang', href: '/denever-barlang', badge: '1,3 km · kék sáv' },
      { label: 'Malom Karsztrendszer', href: '/a-malom-karsztrendszere', badge: 'Natura 2000' },
      { label: 'Déznai Vár Via Ferrata', href: '/via-ferrata-dezna-hu', badge: '600 m · B fok' },
      { label: 'Menyházi Kilátó', href: '/belvedere-moneasa', badge: '2,7 km · piros pont' },
      { label: 'Menyháza Kalandpark', href: '/moneasa-adventure', badge: 'Kalandpark' },
    ],
  },
  {
    label: 'Történelem és Örökség',
    href: '/statiunea-moneasa',
    description: 'Menyháza fürdő és Czárán Gyula',
    children: [
      { label: 'Menyháza Gyógyfürdő', href: '/statiunea-moneasa', badge: '1597 óta' },
      { label: 'Czárán Gyula', href: '/czaran-gyula', badge: '1847–1906' },
    ],
  },
  { label: 'Kapcsolat', href: '/contact', description: 'Kapcsolat és információ' },
];

export function Header({ navigation, phonePrimary }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [logoHovered, setLogoHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Derive current language from pathname
  const currentLang: SiteLang =
    pathname === '/bat-cave' ||
    pathname === '/the-mill-karst-system' ||
    pathname === '/bear-cave' ||
    pathname === '/via-ferrata-dezna-en'
      ? 'en'
      : pathname === '/denever-barlang' ||
        pathname === '/a-malom-karsztrendszere' ||
        pathname === '/medve-barlang' ||
        pathname === '/via-ferrata-dezna-hu'
      ? 'hu'
      : 'ro';

  // Active navigation set matching language
  const activeNavigation = currentLang === 'en' ? NAV_EN : currentLang === 'hu' ? NAV_HU : navigation;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tcd-theme');
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdowns & modals on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setOpenDropdown(null);
        setLangDropdownOpen(false);
        setLogoHovered(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(nextTheme);
    try {
      localStorage.setItem('tcd-theme', nextTheme);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setLangDropdownOpen(false);
  }, [pathname]);

  const handleSelectLang = (code: SiteLang) => {
    setLangDropdownOpen(false);
    if (code === currentLang) return;

    // Check if direct translation exists for current page
    const direct = ROUTE_TRANSLATIONS[pathname];
    if (direct && direct[code]) {
      router.push(direct[code]);
      return;
    }

    // Default entry page per language
    if (code === 'en') {
      router.push('/bat-cave');
    } else if (code === 'hu') {
      router.push('/denever-barlang');
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-16 max-h-16 w-full border-b border-cavern-700/70 bg-cavern-950/90 backdrop-blur-xl" style={{ height: '4rem', maxHeight: '4rem' }}>
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <div
            className="relative shrink-0"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            onFocus={() => setLogoHovered(true)}
            onBlur={() => setLogoHovered(false)}
          >
            <Link href="/" className="flex shrink-0 items-center py-2" aria-label="Transilvania Cave Diving — Acasă">
              <img src="/media/logos/tcd-logo.svg" alt="Transilvania Cave Diving" className="logo-dark-mode h-9 w-auto" width={160} height={38} />
              <img src="/media/logos/tcd-logo-light.svg" alt="Transilvania Cave Diving" className="logo-light-mode h-9 w-auto" width={160} height={38} />
            </Link>

            {/* Emblemă Transilvania extinsă la hover */}
            {logoHovered && (
              <div
                style={{ position: 'absolute', top: '100%', left: 0, zIndex: 60 }}
                className="pt-2 animate-lightbox-content pointer-events-auto"
              >
                <div className="w-72 sm:w-80 overflow-hidden rounded-none skeuo-glass p-2">
                  <div className="relative aspect-[828/934] w-full overflow-hidden rounded-none bg-black border border-white/10">
                    <img
                      src="/media/logos/transilvania-logo-full.jpg"
                      alt="Transilvania Cave Diving"
                      className="h-full w-full object-contain"
                      width={828}
                      height={934}
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <nav aria-label="Navigare principală" className="hidden items-center gap-1 lg:flex">
            {activeNavigation.map((item) => {
              if (item.href === '/contact') return null;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || Boolean(item.children && item.children.some((c) => pathname === c.href));
              const base = `relative inline-flex h-16 items-center gap-1 px-4 text-sm transition-colors ${
                isActive ? 'font-semibold text-limestone-50' : 'font-medium text-limestone-300 hover:text-limestone-50'
              }`;

              if (item.children && item.children.length > 0) {
                const isOpen = openDropdown === item.href;
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      className={base}
                      onClick={() => setOpenDropdown(isOpen ? null : item.href)}
                    >
                      {item.label}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-karst-400' : 'text-limestone-400'}`} />
                      {isActive && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-karst-500" />}
                    </button>
                    {isOpen && (
                      <div className="absolute left-0 top-full w-72 pt-1">
                        <div className="rounded-none skeuo-glass p-1.5 animate-fade-in">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`group flex items-start justify-between rounded-none px-3.5 py-2.5 transition ${
                                pathname === child.href ? 'bg-cavern-800 text-limestone-50 border-l-2 border-karst-500' : 'text-limestone-200 hover:bg-cavern-800/80 hover:text-limestone-50'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <span className="block text-sm font-semibold">{child.label}</span>
                                {child.badge && <span className="block text-[11px] text-karst-400 font-medium">{child.badge}</span>}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={base}>
                  {item.label}
                  {isActive && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-karst-500" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/contact"
              className="inline-flex h-9 items-center rounded-none skeuo-button-primary px-4 text-xs font-bold text-white shadow-sm transition"
            >
              {currentLang === 'en' ? 'Contact' : currentLang === 'hu' ? 'Kapcsolat' : 'Contact'}
            </Link>
            <button
              onClick={toggleTheme}
              aria-label="Schimbă tema"
              className="flex h-9 w-9 items-center justify-center rounded-none skeuo-button-secondary text-limestone-300 transition hover:text-limestone-50"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-expanded={langDropdownOpen}
                className="inline-flex h-9 items-center gap-1.5 rounded-none skeuo-button-secondary px-3 text-xs font-semibold text-limestone-200 transition hover:border-karst-400 hover:text-limestone-50"
                title="Selectează limba / Select language / Nyelvválasztás"
              >
                <Globe className="h-3.5 w-3.5 text-karst-400" />
                <span>{currentLang.toUpperCase()}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-none skeuo-glass p-2 z-50">
                  <div className="px-2.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-karst-400 border-b border-cavern-700/70">
                    Limbă / Language / Nyelv
                  </div>
                  <div className="space-y-1 pt-1.5">
                    {LANGUAGES.map((lang) => {
                      const isActive = currentLang === lang.code;
                      const direct = ROUTE_TRANSLATIONS[pathname];
                      const hasDirect = Boolean(direct && direct[lang.code]);

                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelectLang(lang.code)}
                          className={`flex w-full items-center justify-between rounded-none px-3 py-2 text-left text-sm transition ${
                            isActive
                              ? 'bg-karst-600/20 text-karst-300 font-bold border-l-2 border-karst-500'
                              : 'text-limestone-200 hover:bg-cavern-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{lang.flagEmoji}</span>
                            <span>{lang.label}</span>
                            {hasDirect && !isActive && (
                              <span className="text-[10px] text-karst-400 font-mono font-normal">● direct</span>
                            )}
                          </span>
                          {isActive && <Check className="h-4 w-4 text-karst-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Trail Guide Links */}
                  <div className="mt-2.5 border-t border-cavern-700/70 pt-2 px-2.5">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-limestone-400">
                      Ghiduri Traduse / Guides:
                    </span>
                    <div className="mt-1.5 space-y-1">
                      <Link
                        href="/bear-cave"
                        onClick={() => setLangDropdownOpen(false)}
                        className="flex items-center justify-between rounded-none px-2 py-1 text-xs text-limestone-300 hover:bg-cavern-800 hover:text-white"
                      >
                        <span>🇬🇧 Bear's Cave (Moneasa)</span>
                        <ExternalLink className="h-3 w-3 text-karst-400" />
                      </Link>
                      <Link
                        href="/bat-cave"
                        onClick={() => setLangDropdownOpen(false)}
                        className="flex items-center justify-between rounded-none px-2 py-1 text-xs text-limestone-300 hover:bg-cavern-800 hover:text-white"
                      >
                        <span>🇬🇧 Bat Cave (Moneasa)</span>
                        <ExternalLink className="h-3 w-3 text-karst-400" />
                      </Link>
                      <Link
                        href="/the-mill-karst-system"
                        onClick={() => setLangDropdownOpen(false)}
                        className="flex items-center justify-between rounded-none px-2 py-1 text-xs text-limestone-300 hover:bg-cavern-800 hover:text-white"
                      >
                        <span>🇬🇧 Mill Karst (Natura 2000)</span>
                        <ExternalLink className="h-3 w-3 text-karst-400" />
                      </Link>
                      <Link
                        href="/medve-barlang"
                        onClick={() => setLangDropdownOpen(false)}
                        className="flex items-center justify-between rounded-none px-2 py-1 text-xs text-limestone-300 hover:bg-cavern-800 hover:text-white"
                      >
                        <span>🇭🇺 Medve-barlang (Menyháza)</span>
                        <ExternalLink className="h-3 w-3 text-karst-400" />
                      </Link>
                      <Link
                        href="/denever-barlang"
                        onClick={() => setLangDropdownOpen(false)}
                        className="flex items-center justify-between rounded-none px-2 py-1 text-xs text-limestone-300 hover:bg-cavern-800 hover:text-white"
                      >
                        <span>🇭🇺 Denevér-barlang (Menyháza)</span>
                        <ExternalLink className="h-3 w-3 text-karst-400" />
                      </Link>
                      <Link
                        href="/a-malom-karsztrendszere"
                        onClick={() => setLangDropdownOpen(false)}
                        className="flex items-center justify-between rounded-none px-2 py-1 text-xs text-limestone-300 hover:bg-cavern-800 hover:text-white"
                      >
                        <span>🇭🇺 Malom Karsztrendszer</span>
                        <ExternalLink className="h-3 w-3 text-karst-400" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-none skeuo-button-secondary text-limestone-200 lg:hidden"
              aria-label={mobileOpen ? 'Închide meniul' : 'Deschide meniul'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-cavern-950 px-5 pb-10 pt-4 lg:hidden">
          {/* Mobile Language Switcher */}
          <div className="mb-6 rounded-none skeuo-glass p-4">
            <span className="block text-xs font-mono uppercase tracking-wider text-karst-400 mb-2">
              Selectează limba / Language / Nyelv:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => {
                const isActive = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleSelectLang(lang.code);
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-none py-2 px-2 text-xs font-semibold transition ${
                      isActive
                        ? 'skeuo-button-primary text-white'
                        : 'skeuo-button-secondary text-limestone-200'
                    }`}
                  >
                    <span>{lang.flagEmoji}</span>
                    <span>{lang.flag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <nav className="divide-y divide-cavern-700">
            {activeNavigation.map((item) => (
              <div key={item.href} className="py-4">
                <Link href={item.href} onClick={() => setMobileOpen(false)} className="block font-display text-2xl font-semibold text-limestone-50">
                  {item.label}
                </Link>
                {item.children && (
                  <div className="mt-3 space-y-2">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} onClick={() => setMobileOpen(false)} className="block text-base text-limestone-300 hover:text-limestone-50">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <a
            href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
            className="mt-6 flex items-center justify-center gap-2 rounded-none skeuo-button-primary py-3.5 text-sm font-semibold text-white"
          >
            <Phone className="h-4 w-4" />
            {phonePrimary}
          </a>
        </div>
      )}
    </>
  );
}
