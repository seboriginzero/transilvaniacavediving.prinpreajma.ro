'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';
import type { NavItem } from '@/lib/content';

interface HeaderProps {
  navigation: NavItem[];
  phonePrimary: string;
}

type SiteLang = 'ro' | 'en' | 'hu';
type ThemeMode = 'dark' | 'light';

const LANGUAGES: { code: SiteLang; label: string; flag: string }[] = [
  { code: 'ro', label: 'Română', flag: 'RO' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'hu', label: 'Magyar', flag: 'HU' },
];

export function Header({ navigation, phonePrimary }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<SiteLang>('ro');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const langMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <header className="sticky top-0 z-50 h-16 w-full border-b border-cavern-700/70 bg-cavern-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Transilvania Cave Diving — Acasă">
            <img src="/media/logos/tcd-logo.svg" alt="Transilvania Cave Diving" className="logo-dark-mode h-9 w-auto" width={160} height={38} />
            <img src="/media/logos/tcd-logo-light.svg" alt="Transilvania Cave Diving" className="logo-light-mode h-9 w-auto" width={160} height={38} />
          </Link>

          <nav aria-label="Navigare principală" className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => {
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
                    <button type="button" aria-expanded={isOpen} onClick={() => setOpenDropdown(isOpen ? null : item.href)} className={base}>
                      {item.label}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="absolute left-0 top-full w-80 pt-1">
                        <div className="overflow-hidden rounded-2xl border border-cavern-700 bg-cavern-900 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-baseline justify-between gap-3 rounded-xl px-3.5 py-3 transition ${
                                pathname === child.href ? 'bg-cavern-800' : 'hover:bg-cavern-800'
                              }`}
                            >
                              <span className="text-sm font-medium text-limestone-50">{child.label}</span>
                              {child.badge && <span className="shrink-0 text-[11px] text-limestone-400">{child.badge}</span>}
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
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
              className="mr-1 hidden items-center gap-2 text-sm font-medium text-limestone-200 transition hover:text-limestone-50 xl:inline-flex"
            >
              <Phone className="h-4 w-4 text-karst-400" />
              {phonePrimary}
            </a>
            <Link
              href="/contact"
              className="ml-1 hidden rounded-full bg-limestone-50 px-5 py-2 text-sm font-semibold text-cavern-950 transition hover:opacity-90 sm:inline-flex"
            >
              Contact
            </Link>
            <button
              onClick={toggleTheme}
              aria-label="Schimbă tema"
              className="flex h-9 w-9 items-center justify-center rounded-full text-limestone-300 transition hover:bg-cavern-800 hover:text-limestone-50"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-expanded={langDropdownOpen}
                className="inline-flex h-9 items-center gap-1 rounded-full px-2.5 text-xs font-semibold text-limestone-300 transition hover:bg-cavern-800 hover:text-limestone-50"
              >
                <Globe className="h-4 w-4" />
                {selectedLang.toUpperCase()}
                <ChevronDown className="h-3 w-3" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-2xl border border-cavern-700 bg-cavern-900 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                        selectedLang === lang.code ? 'bg-cavern-800 font-semibold text-limestone-50' : 'text-limestone-200 hover:bg-cavern-800'
                      }`}
                    >
                      {lang.label}
                      <span className="text-[11px] text-limestone-400">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-limestone-200 hover:bg-cavern-800 lg:hidden"
              aria-label={mobileOpen ? 'Închide meniul' : 'Deschide meniul'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-cavern-950 px-5 pb-10 pt-4 lg:hidden">
          <nav className="divide-y divide-cavern-700">
            {navigation.map((item) => (
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
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-limestone-50 py-3.5 text-sm font-semibold text-cavern-950"
          >
            <Phone className="h-4 w-4" />
            {phonePrimary}
          </a>
        </div>
      )}
    </>
  );
}
