'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  KeyRound,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  MapPin,
  Calendar,
  LogOut,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { DynamicSiteSettings } from '@/lib/settings';

export default function AdministratorPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [settings, setSettings] = useState<DynamicSiteSettings | null>(null);

  // Check auth state and load current settings
  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setIsAuthenticated(Boolean(data.authenticated));
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPassword('');
        await fetchSettings();
      } else {
        setSaveStatus({ type: 'error', message: data.error || 'Parolă incorectă' });
      }
    } catch {
      setSaveStatus({ type: 'error', message: 'Eroare la conectare' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
      setSettings(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSubmitting(true);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSettings(data.settings);
        setSaveStatus({ type: 'success', message: 'Prețurile și orarele au fost actualizate și salvate cu succes!' });
        setTimeout(() => setSaveStatus(null), 5000);
      } else {
        setSaveStatus({ type: 'error', message: data.error || 'Eroare la salvare' });
      }
    } catch {
      setSaveStatus({ type: 'error', message: 'Eroare de comunicare cu serverul' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-karst-400 font-mono text-sm">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Se încarcă panoul de administrare...</span>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md editorial-card rounded-none skeuo-glass p-8">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none bg-cavern-950 border border-cavern-700 text-karst-400 shadow-inner">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-limestone-50">
              Administrare Transilvania
            </h1>
            <p className="text-xs sm:text-sm text-limestone-300">
              Modificare orare de funcționare, prețuri bilete și disponibilitate obiective turistice Moneasa.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5"
              >
                Parolă Acces Administrator
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduceți parola configurată..."
                  className="w-full rounded-none skeuo-input px-4 py-3 pl-11 text-sm text-limestone-50 placeholder-limestone-400 focus:border-karst-500 focus:outline-none"
                />
                <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-limestone-400" />
              </div>
            </div>

            {saveStatus && saveStatus.type === 'error' && (
              <div className="flex items-center gap-2 rounded-none border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{saveStatus.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-none skeuo-button-primary px-5 py-3 font-semibold text-white shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Verificare...</span>
                </>
              ) : (
                <>
                  <span>Conectare la Panou</span>
                  <KeyRound className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="text-xs font-mono text-limestone-400 hover:text-karst-400 transition"
              >
                ← Înapoi la pagina principală
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN PANEL
  if (!settings) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cavern-700 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-karst-400">
            <Sparkles className="h-4 w-4" />
            <span>Panou de Gestiune Rapidă · Moneasa</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-limestone-50">
            Editare Orare și Prețuri
          </h1>
          <p className="mt-1 text-xs text-limestone-300">
            Modificările salvate se reflectă instantaneu pe site (pagina principală, carusel, secțiuni de informare).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-none skeuo-button-secondary px-3.5 py-2 text-xs font-semibold text-limestone-200 hover:text-limestone-50"
          >
            <span>Vezi Site Live</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-none skeuo-button-secondary px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/30"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Deconectare</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div
          className={`flex items-center gap-3 rounded-none border p-4 text-sm ${
            saveStatus.type === 'success'
              ? 'border-karst-500/50 bg-karst-950/60 text-karst-200'
              : 'border-red-500/50 bg-red-950/60 text-red-200'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-karst-400" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: GROTA URSULUI MONEASA */}
        <div className="editorial-card rounded-none skeuo-glass p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cavern-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-none bg-cavern-950 border border-cavern-700 text-safety-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-limestone-50">
                  Peștera Grota Ursului (Moneasa)
                </h2>
                <p className="text-xs text-limestone-300">
                  Traseu turistic amenajat și electrificat, cca. 200 m (până în Sala Czárán Gyula)
                </p>
              </div>
            </div>
            <span className="font-mono text-xs rounded-none border border-cavern-700 bg-cavern-950 px-3 py-1 text-limestone-300">
              Ultima actualizare: {settings.grotaUrsului.lastUpdated}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Status text */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
                Status Vizitare
              </label>
              <input
                type="text"
                value={settings.grotaUrsului.status}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    grotaUrsului: { ...settings.grotaUrsului, status: e.target.value },
                  })
                }
                className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
              />
            </div>

            {/* Zile funcționare */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
                Zile Deschise
              </label>
              <input
                type="text"
                value={settings.grotaUrsului.days}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    grotaUrsului: { ...settings.grotaUrsului, days: e.target.value },
                  })
                }
                className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
              />
            </div>

            {/* Interval orar */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
                Interval Orar
              </label>
              <input
                type="text"
                value={settings.grotaUrsului.hours}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    grotaUrsului: { ...settings.grotaUrsului, hours: e.target.value },
                  })
                }
                className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
              />
            </div>

            {/* Preț Adult */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
                Bilet Adult (Lei)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={settings.grotaUrsului.adultPrice}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      grotaUrsului: { ...settings.grotaUrsului, adultPrice: Number(e.target.value) },
                    })
                  }
                  className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-mono text-limestone-400">LEI</span>
              </div>
            </div>

            {/* Preț Copil */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
                Bilet Copil (Lei)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={settings.grotaUrsului.childPrice}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      grotaUrsului: { ...settings.grotaUrsului, childPrice: Number(e.target.value) },
                    })
                  }
                  className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-mono text-limestone-400">LEI</span>
              </div>
            </div>

            {/* Telefon Contact Ghidaj */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
                Telefon Programări / Info
              </label>
              <input
                type="text"
                value={settings.grotaUrsului.phoneContact}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    grotaUrsului: { ...settings.grotaUrsului, phoneContact: e.target.value },
                  })
                }
                className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notă specială gratuități & grupuri */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
              Notă Gratuități / Grupuri Organizate
            </label>
            <textarea
              rows={2}
              value={settings.grotaUrsului.specialNote}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  grotaUrsului: { ...settings.grotaUrsului, specialNote: e.target.value },
                })
              }
              className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 2: VIA FERRATA CETATEA DEZNA */}
        <div className="editorial-card rounded-none skeuo-glass p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cavern-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-none bg-cavern-950 border border-cavern-700 text-karst-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-limestone-50">
                  Via Ferrata Cetatea Dezna
                </h2>
                <p className="text-xs text-limestone-300">
                  Dealul Osoiu, Dezna · 600 m · grad B · punte indiană de 25 m
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
                Regim Acces Traseu
              </label>
              <input
                type="text"
                value={settings.viaFerrata.status}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    viaFerrata: { ...settings.viaFerrata, status: e.target.value },
                  })
                }
                className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
                Program / Sezon
              </label>
              <input
                type="text"
                value={settings.viaFerrata.schedule}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    viaFerrata: { ...settings.viaFerrata, schedule: e.target.value },
                  })
                }
                className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
                Taxă de acces
              </label>
              <input
                type="text"
                value={settings.viaFerrata.priceNote}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    viaFerrata: { ...settings.viaFerrata, priceNote: e.target.value },
                  })
                }
                className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-limestone-300 mb-1.5">
                Închiriere Echipament
              </label>
              <input
                type="text"
                value={settings.viaFerrata.equipmentRentalPrice}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    viaFerrata: { ...settings.viaFerrata, equipmentRentalPrice: e.target.value },
                  })
                }
                className="w-full rounded-none skeuo-input px-3.5 py-2.5 text-sm text-limestone-50 focus:border-karst-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON BAR */}
        <div className="sticky bottom-6 z-30 flex items-center justify-between gap-4 rounded-none skeuo-glass p-4 shadow-2xl">
          <div className="flex items-center gap-2 text-xs text-limestone-300">
            <Clock className="h-4 w-4 text-karst-400" />
            <span>Verificați datele înainte de salvare. Salvarea actualizează direct baza de date dinamică.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-none skeuo-button-primary px-6 py-3 font-semibold text-white shadow-lg disabled:opacity-50 shrink-0"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Se salvează...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Salvează Toate Modificările</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

