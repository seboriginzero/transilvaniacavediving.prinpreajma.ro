'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Maximize2 } from 'lucide-react';
import { FullScreenImageModal } from './FullScreenImageModal';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Programare vizită Grota Ursului / Speoturism');
  const [message, setMessage] = useState('');
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
          website: websiteHoneypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setFeedback(data.error || 'A apărut o eroare la trimiterea mesajului.');
        return;
      }

      setStatus('success');
      setFeedback(
        data.message ||
          'Mesajul dumneavoastră a fost înregistrat cu succes! Vă vom contacta în cel mai scurt timp.'
      );
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setStatus('error');
      setFeedback('Eroare de conexiune. Vă rugăm să ne apelați direct la +40 770 846 001.');
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col justify-between rounded-2xl border border-cavern-700 bg-cavern-800/90 p-6 sm:p-8 shadow-xl"
        noValidate
      >
        <div className="space-y-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-cavern-700/60 pb-4">
            <div>
              <h2 className="text-xl font-bold text-limestone-100">
                Formular de Contact și Rezervări
              </h2>
              <p className="mt-1 text-xs text-limestone-300">
                Câmpurile marcate cu <span className="text-safety-400">*</span> sunt obligatorii. Pentru urgențe sau confirmări rapide în weekend, apelați{' '}
                <a href="tel:+40770846001" className="font-mono font-semibold text-karst-400 underline">
                  +40 770 846 001
                </a>
                .
              </p>
            </div>

            {/* Logo Transilvania cu acțiune Ecran Complet */}
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="group relative shrink-0 overflow-hidden rounded-xl border border-cavern-700 bg-black p-1.5 shadow-md transition hover:border-karst-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-karst-400"
              title="Apasă pentru vizualizare pe tot ecranul"
              aria-label="Apasă pentru vizualizare completă siglă Transilvania"
            >
              <img
                src="/media/logos/transilvania-logo-full.jpg"
                alt="Logo Transilvania"
                className="h-12 w-12 object-contain"
                width={828}
                height={934}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition duration-200 group-hover:opacity-100">
                <Maximize2 className="h-4 w-4 text-white" />
              </div>
            </button>
          </div>

          {/* Honeypot anti-spam field */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-website-hp">Website</label>
            <input
              id="contact-website-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={websiteHoneypot}
              onChange={(e) => setWebsiteHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-limestone-200">
                Nume și Prenume <span className="text-safety-400">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Andrei Popescu"
                className="mt-1.5 w-full rounded-xl border border-cavern-600 bg-cavern-950 px-3.5 py-2.5 text-sm text-limestone-100 placeholder-limestone-400 focus:border-karst-400 focus:outline-none focus:ring-1 focus:ring-karst-400"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-limestone-200">
                Adresă de Email <span className="text-safety-400">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={120}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nume@exemplu.ro"
                className="mt-1.5 w-full rounded-xl border border-cavern-600 bg-cavern-950 px-3.5 py-2.5 text-sm text-limestone-100 placeholder-limestone-400 focus:border-karst-400 focus:outline-none focus:ring-1 focus:ring-karst-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-limestone-200">
                Telefon de Contact
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                maxLength={30}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+40 7xx xxx xxx"
                className="mt-1.5 w-full rounded-xl border border-cavern-600 bg-cavern-950 px-3.5 py-2.5 text-sm text-limestone-100 placeholder-limestone-400 focus:border-karst-400 focus:outline-none focus:ring-1 focus:ring-karst-400"
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-limestone-200">
                Tip Solicitare
              </label>
              <select
                id="contact-subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-cavern-600 bg-cavern-950 px-3.5 py-2.5 text-sm text-limestone-100 focus:border-karst-400 focus:outline-none focus:ring-1 focus:ring-karst-400"
              >
                <option value="Programare vizită Grota Ursului / Speoturism">
                  Programare vizită Grota Ursului / Speoturism
                </option>
                <option value="Via Ferrata Cetatea Dezna / Ghidaj Montan">
                  Via Ferrata Cetatea Dezna / Ghidaj Montan
                </option>
                <option value="Moneasa Adventure (Școala Altfel / Săptămâna Verde)">
                  Moneasa Adventure (Școala Altfel / Săptămâna Verde)
                </option>
                <option value="Lucrări Subacvatice Comerciale / Lucrări la Înălțime">
                  Lucrări Subacvatice Comerciale / Lucrări la Înălțime
                </option>
              </select>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-limestone-200">
              Mesaj / Detalii Programare sau Solicitare <span className="text-safety-400">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              minLength={10}
              maxLength={2500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Specificați numărul de persoane, perioada dorită sau detaliile solicitării..."
              className="mt-1.5 w-full flex-1 min-h-[140px] resize-none rounded-xl border border-cavern-600 bg-cavern-950 px-3.5 py-2.5 text-sm text-limestone-100 placeholder-limestone-400 focus:border-karst-400 focus:outline-none focus:ring-1 focus:ring-karst-400"
            />
          </div>

          {status === 'error' && (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-xl border border-red-500/50 bg-red-950/60 px-4 py-3 text-xs text-red-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{feedback}</span>
            </div>
          )}

          {status === 'success' && (
            <div
              role="status"
              className="flex items-center gap-2.5 rounded-xl border border-karst-500/50 bg-karst-950/50 px-4 py-3 text-xs text-karst-300"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-karst-400" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-karst-600 px-6 py-3 text-sm font-bold text-cavern-950 shadow-lg transition hover:bg-karst-500 disabled:opacity-50 sm:w-auto"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>{status === 'submitting' ? 'Se trimite solicitarea...' : 'Trimite Mesajul'}</span>
          </button>
        </div>
      </form>

      <FullScreenImageModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        src="/media/logos/transilvania-logo-full.jpg"
        alt="Logo oficial Transilvania — vizualizare ecran complet"
        caption="Emblema oficială Transilvania · Munții Codru-Moma"
      />
    </>
  );
}
