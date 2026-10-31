import React from 'react';
import { notFound } from 'next/navigation';
import { Phone, MapPin, Building2, Clock, ExternalLink } from 'lucide-react';
import { getPageByPath, getCompanyInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ContactForm } from '@/components/ContactForm';

export const metadata = (() => {
  const page = getPageByPath('/contact');
  return page
    ? buildPageMetadata(page, '/contact')
    : { title: 'Contact — Transilvania Cave Diving' };
})();

export default function ContactPage() {
  const page = getPageByPath('/contact');
  if (!page) notFound();

  const company = getCompanyInfo();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div>
        <Breadcrumbs items={[{ name: 'Contact', path: '/contact' }]} />
        <span className="text-xs font-bold uppercase tracking-wider text-karst-400">
          Date Oficiale de Identificare · Programări Ture · Comenzi Echipamente
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-limestone-50 sm:text-5xl">
          Contactează Transilvania Cave Diving
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-limestone-200">
          Pentru programarea grupurilor la Peștera Grota Ursului din Moneasa, ture de speoturism, excursii școlare Moneasa Adventure, scufundări tehnice în Peștera Isverna, comenzi de echipamente sau oferte pentru lucrări subacvatice:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left Column: Official Fiscal & Contact Data */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-cavern-700 bg-cavern-800/90 p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-cavern-700 pb-4">
              <div className="rounded-xl bg-karst-500/15 p-3 text-karst-400">
                <Building2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-limestone-50">{company.legalName}</h2>
                <p className="text-xs font-mono text-karst-400">
                  CIF: {company.cif} · Reg. com.: {company.regCom}
                </p>
              </div>
            </div>

            <dl className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-karst-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-limestone-400">
                    Telefon Oficial de Contact
                  </dt>
                  <dd className="mt-1 font-mono text-lg font-bold text-limestone-50">
                    <a href="tel:+40770846001" className="hover:text-karst-400">
                      {company.phonePrimary}
                    </a>
                  </dd>
                  <dd className="mt-1 text-xs text-limestone-400">
                    Referință suplimentară arhivă speoturism: {company.phoneSecondaryHistorical}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-karst-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-limestone-400">
                    Sediu &amp; Puncte Operaționale
                  </dt>
                  <dd className="mt-1 text-limestone-100">
                    <strong>Sediu social:</strong> {company.headquarters}
                  </dd>
                  <dd className="mt-1 text-limestone-200">
                    <strong>Obiectiv turistic administrat:</strong> Peștera Grota Ursului (Peștera de la Băi), Stațiunea Moneasa, Județul Arad
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-safety-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-limestone-400">
                    Program Vizitare Peștera Grota Ursului
                  </dt>
                  <dd className="mt-1 text-limestone-100">
                    Sâmbătă și Duminică: <strong>11:00 – 16:00</strong>
                  </dd>
                  <dd className="mt-0.5 text-xs text-limestone-300">
                    În afara programului: deschis la cerere pentru grupuri organizate, pe bază de programare prealabilă.
                  </dd>
                </div>
              </div>
            </dl>

            <div className="border-t border-cavern-700 pt-4">
              <a
                href={company.mapsGrotaUrsului}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-karst-400 hover:underline"
              >
                Deschide localizarea Peșterii Grota Ursului în Google Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

