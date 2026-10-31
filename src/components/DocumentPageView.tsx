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

      {/* Clean Editorial Header (no cropped banner behind text; banners render at 100% visibility in content) */}
      <div className="relative overflow-hidden border-b border-cavern-700 bg-gradient-to-b from-cavern-950 via-cavern-900 to-cavern-900/60 py-10 lg:py-14">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <h1 className="max-w-4xl font-serif text-3xl font-extrabold tracking-tight text-limestone-50 sm:text-4xl lg:text-5xl">
            {page.cleanTitle}
          </h1>

          {page.metaDescription && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-limestone-200 sm:text-lg">
              {page.metaDescription}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <LanguageSwitcher currentLang={page.language} translations={page.translations} />

        {/* Historical Context Notice for dated archive posts */}
        {(showHistoricalNotice || page.pageType === 'article') && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-safety-500/40 bg-cavern-800/90 p-4 text-xs leading-relaxed text-limestone-200">
            <History className="mt-0.5 h-5 w-5 shrink-0 text-safety-400" aria-hidden="true" />
            <div>
              <strong className="text-safety-400">Notă de Context Istoric și Arhivă:</strong> Acest articol face parte din arhiva documentară Transilvania Cave Diving
              {page.publicationDate ? ` (publicat la ${page.publicationDate.slice(0, 10)})` : ''}. Orice tarife, promoții sezoniere, programe sau disponibilități de stoc menționate în text reflectă momentul publicării originale și necesită confirmare telefonică la{' '}
              <a href="tel:+40770846001" className="font-mono font-semibold text-karst-400 underline">
                +40 770 846 001
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
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-cavern-700/80 bg-cavern-800/50 p-6 sm:p-8 shadow-xl">
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
            {tocHeadings.length > 1 && (
              <div className="sticky top-28 space-y-6">
                <div className="rounded-2xl border border-cavern-700 bg-cavern-800/90 p-5 shadow-lg">
                  <div className="mb-3 flex items-center gap-2 border-b border-cavern-700 pb-3">
                    <BookOpen className="h-4 w-4 text-karst-400" aria-hidden="true" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-limestone-100">
                      Cuprinsul Paginii
                    </h2>
                  </div>
                  <ul className="space-y-2 text-xs">
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

                {/* Quick Contact / Reservation Card */}
                <div className="rounded-2xl border border-karst-500/40 bg-gradient-to-br from-cavern-800 to-cavern-900 p-5 shadow-lg">
                  <h3 className="text-base font-bold text-limestone-100">
                    Programări Ghidaj, Ture &amp; Informații
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-limestone-300">
                    Pentru programarea grupurilor la Peștera Grota Ursului, ture de speoturism, cave diving sau închiriere echipament Via Ferrata:
                  </p>
                  <div className="mt-4 space-y-2.5">
                    <a
                      href="tel:+40770846001"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-karst-600 px-4 py-2.5 text-sm font-bold text-cavern-950 transition hover:bg-karst-500"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      +40 770 846 001
                    </a>
                    <Link
                      href="/contact"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-cavern-600 bg-cavern-900 px-4 py-2.5 text-sm font-semibold text-limestone-100 transition hover:border-karst-400 hover:text-karst-400"
                    >
                      Formular de Contact <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
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
