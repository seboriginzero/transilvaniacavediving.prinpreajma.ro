import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, BookOpen, Video, ArrowRight, History, Phone } from 'lucide-react';
import type { PageRecord } from '@/lib/content';
import { buildPageEntityJsonLd } from '@/lib/seo';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SafetyWarningBanner } from './SafetyWarningBanner';
import { TechnicalSpecsCard } from './TechnicalSpecsCard';
import { MarkdownContent, slugifyHeading } from './MarkdownContent';
import { CardMediaThumb } from './CardMediaThumb';
import { getDynamicSettings } from '@/lib/settings';

interface DocumentPageViewProps {
  page: PageRecord;
  breadcrumbs: BreadcrumbItem[];
  relatedPages?: PageRecord[];
  showHistoricalNotice?: boolean;
}

export function DocumentPageView({
  page,
  breadcrumbs,
  relatedPages = [],
  showHistoricalNotice = false,
}: DocumentPageViewProps) {
  const settings = getDynamicSettings();
  const phone = settings.grotaUrsului.phoneContact || '+40 770 846 001';
  const phoneClean = phone.replace(/[^0-9+]/g, '');
  const entityJsonLd = buildPageEntityJsonLd(page);

  // Extract TOC headings (level 1-3) that are short enough to be navigation items
  const tocHeadings = (page.headings || []).filter(
    (h) =>
      h.level <= 3 &&
      h.text.length > 2 &&
      h.text.length < 95 &&
      !/^related$/i.test(h.text.trim())
  );

  return (
    <article className="pb-16">
      {entityJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entityJsonLd) }}
        />
      )}

      {/* Clean Editorial Header */}
      <div className="relative overflow-hidden border-b border-cavern-700 bg-gradient-to-b from-cavern-950 via-cavern-900 to-cavern-900/60 py-10 lg:py-14">
        <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full border border-karst-500/40 bg-karst-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-karst-400">
              {page.categoryLabel}
            </span>
            {page.region && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cavern-700 bg-cavern-800/90 px-3 py-1 text-xs text-limestone-200">
                <MapPin className="h-3.5 w-3.5 text-karst-400" aria-hidden="true" />
                {page.region}
              </span>
            )}
            {page.publicationDate && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cavern-700 bg-cavern-800/90 px-3 py-1 font-mono text-xs text-limestone-300">
                <Calendar className="h-3.5 w-3.5 text-safety-400" aria-hidden="true" />
                Publicat: {page.publicationDate.slice(0, 10)}
              </span>
            )}
          </div>

          <h1 className="max-w-5xl font-serif text-3xl font-extrabold tracking-tight text-limestone-50 sm:text-4xl lg:text-5xl">
            {page.cleanTitle}
          </h1>

          {page.metaDescription && (
            <p className="mt-4 max-w-4xl text-base leading-relaxed text-limestone-200 sm:text-lg">
              {page.metaDescription}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Container - Full Canvas Editorial Width */}
      <div className="mx-auto max-w-[1500px] px-4 pt-8 sm:px-6 lg:px-10">
        <LanguageSwitcher currentLang={page.language} translations={page.translations} />

        {/* Historical Context Notice for dated archive posts */}
        {(showHistoricalNotice || page.pageType === 'article') && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-safety-500/40 bg-cavern-800/90 p-4 text-xs leading-relaxed text-limestone-200">
            <History className="mt-0.5 h-5 w-5 shrink-0 text-safety-400" aria-hidden="true" />
            <div>
              <strong className="text-safety-400">Notă de Context Istoric și Arhivă:</strong> Acest articol face parte din arhiva documentară Transilvania Cave Diving
              {page.publicationDate ? ` (publicat la ${page.publicationDate.slice(0, 10)})` : ''}. Orice tarife, promoții sezoniere, programe sau disponibilități de stoc menționate în text reflectă momentul publicării originale și necesită confirmare telefonică la{' '}
              <a href={`tel:${phoneClean}`} className="font-mono font-semibold text-karst-400 underline">
                {phone}
              </a>
              .
            </div>
          </div>
        )}

        {/* Safety Warnings */}
        <SafetyWarningBanner warnings={page.safetyWarnings} />

        {/* Technical Specifications Card */}
        <TechnicalSpecsCard
          specs={page.technicalSpecs}
          scheduleSummary={page.scheduleSummary}
          pricingSummary={page.pricingSummary}
          validationStatus={page.validationStatus}
        />

        {/* Two-column layout: Main Document + Sidebar TOC/Action */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            {/* Mobile & Tablet Collapsible Table of Contents (visible below 1024px) */}
            {tocHeadings.length > 1 && (
              <details className="mb-6 rounded-2xl border border-cavern-700 bg-cavern-800/90 p-4 shadow-md lg:hidden">
                <summary className="flex cursor-pointer items-center justify-between text-xs font-bold uppercase tracking-wider text-limestone-100">
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-karst-400" aria-hidden="true" />
                    Cuprinsul Paginii ({tocHeadings.length} secțiuni)
                  </span>
                  <span className="font-mono text-[11px] text-karst-400">Deschide ▾</span>
                </summary>
                <ul className="mt-3 space-y-1.5 border-t border-cavern-700 pt-3 text-xs">
                  {tocHeadings.map((h, i) => (
                    <li key={i}>
                      <a
                        href={`#${slugifyHeading(h.text)}`}
                        className="block rounded-lg px-2.5 py-1.5 text-limestone-200 transition hover:bg-cavern-700 hover:text-karst-400"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <div className="editorial-card rounded-2xl p-5 sm:p-8">
              <MarkdownContent markdown={page.bodyMarkdown} />
            </div>

            {/* Embedded Videos if present */}
            {page.videos && page.videos.length > 0 && (
              <section aria-label="Materiale Video" className="mt-10 space-y-4">
                <div className="flex items-center gap-2 border-b border-cavern-700 pb-3">
                  <Video className="h-5 w-5 text-karst-400" aria-hidden="true" />
                  <h2 className="text-xl font-bold text-limestone-100">
                    Documentare Video
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {page.videos.map((vUrl, idx) => (
                    <div
                      key={idx}
                      className="aspect-video w-full overflow-hidden rounded-2xl border border-cavern-700 bg-cavern-950 shadow-lg"
                    >
                      <iframe
                        src={vUrl}
                        title={`${page.cleanTitle} — Video ${idx + 1}`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: TOC + Booking/Contact Card */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {tocHeadings.length > 1 && (
                <div className="hidden rounded-2xl border border-cavern-700 bg-cavern-800/90 p-5 shadow-lg lg:block">
                  <div className="mb-3 flex items-center gap-2 border-b border-cavern-700 pb-3">
                    <BookOpen className="h-4 w-4 text-karst-400" aria-hidden="true" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-limestone-100">
                      Cuprinsul Paginii
                    </h2>
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {tocHeadings.map((h, i) => (
                      <li key={i}>
                        <a
                          href={`#${slugifyHeading(h.text)}`}
                          className="block rounded-lg px-2.5 py-1.5 text-limestone-300 transition hover:bg-cavern-700 hover:text-karst-400"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Contact / Reservation Card (always visible on both mobile and desktop) */}
              <div className="editorial-card rounded-2xl p-5">
                <h3 className="font-serif text-base font-bold text-limestone-50">
                  Programări Ghidaj, Ture și Informații
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-limestone-200">
                  Pentru programarea grupurilor la Peștera Grota Ursului, ghidaj speologic sau închiriere kit Via Ferrata:
                </p>
                <div className="mt-4 space-y-2.5">
                  <a
                    href={`tel:${phoneClean}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-karst-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-karst-500"
                  >
                    <Phone className="h-4 w-4 text-white" aria-hidden="true" />
                    <span className="text-white font-mono tracking-wide">{phone}</span>
                  </a>
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-cavern-600 bg-cavern-900 px-4 py-2.5 text-sm font-semibold text-limestone-100 transition hover:border-karst-400 hover:text-karst-400"
                  >
                    Formular de Contact <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Contextual Official Facebook Links */}
                <div className="mt-4 border-t border-cavern-700/80 pt-3.5 space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-limestone-300">
                    Pagini Oficiale Facebook:
                  </span>
                  <div className="flex flex-col gap-1.5 text-xs">
                    {page.path === '/grota-ursului' && (
                      <a
                        href="https://www.facebook.com/Pe%C8%99tera-Grota-Ursului-Moneasa-108508321317590"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded-lg border border-cavern-700 bg-cavern-900/90 px-3 py-2 font-semibold text-limestone-100 transition hover:border-[#1877F2] hover:text-karst-400"
                      >
                        <span>Facebook: Peștera Grota Ursului</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#1877F2]" />
                      </a>
                    )}
                    {page.path === '/belvedere-moneasa' && (
                      <a
                        href="https://www.facebook.com/Belvedere-Moneasa-105856912164648"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded-lg border border-cavern-700 bg-cavern-900/90 px-3 py-2 font-semibold text-limestone-100 transition hover:border-[#1877F2] hover:text-karst-400"
                      >
                        <span>Facebook: Belvedere Moneasa</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#1877F2]" />
                      </a>
                    )}
                    {page.path === '/via-ferrata-cetate-dezna' && (
                      <a
                        href="https://www.facebook.com/profile.php?id=100083662944867"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded-lg border border-cavern-700 bg-cavern-900/90 px-3 py-2 font-semibold text-limestone-100 transition hover:border-[#1877F2] hover:text-karst-400"
                      >
                        <span>Facebook: Via Ferrata Cetatea Dezna</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#1877F2]" />
                      </a>
                    )}
                    {page.path === '/czaran-gyula' && (
                      <a
                        href="https://www.facebook.com/profile.php?id=61575535798320"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded-lg border border-cavern-700 bg-cavern-900/90 px-3 py-2 font-semibold text-limestone-100 transition hover:border-[#1877F2] hover:text-karst-400"
                      >
                        <span>Facebook: Czárán Gyula – Moneasa</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#1877F2]" />
                      </a>
                    )}
                    {page.path === '/visit-isverna' && (
                      <a
                        href="https://www.facebook.com/isvernacavediving"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded-lg border border-cavern-700 bg-cavern-900/90 px-3 py-2 font-semibold text-limestone-100 transition hover:border-[#1877F2] hover:text-karst-400"
                      >
                        <span>Facebook: Visit Isverna Cave Diving</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#1877F2]" />
                      </a>
                    )}
                    <a
                      href="https://www.facebook.com/cavedivingromania"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between rounded-lg border border-cavern-700 bg-cavern-900/90 px-3 py-2 font-semibold text-limestone-100 transition hover:border-[#1877F2] hover:text-karst-400"
                    >
                      <span>Facebook: Transilvania Cave Diving</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#1877F2]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Pages / Articles */}
        {relatedPages.length > 0 && (
          <section aria-label="Pagini și articole conexe" className="mt-14 border-t border-cavern-700 pt-10">
            <h2 className="mb-6 text-2xl font-bold text-limestone-100">
              Explorează și Alte Obiective sau Articole Conexe
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPages.slice(0, 3).map((rel) => (
                <Link
                  key={rel.path}
                  href={rel.path}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-cavern-700 bg-cavern-800/80 transition hover:border-karst-500"
                >
                  <CardMediaThumb src={rel.heroImage} alt={rel.cleanTitle} />
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-karst-400">
                        {rel.categoryLabel}
                      </span>
                      <h3 className="mt-1.5 text-lg font-bold text-limestone-100 group-hover:text-karst-400">
                        {rel.cleanTitle}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs text-limestone-300">
                        {rel.metaDescription}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-karst-400">
                      Citește integral <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
