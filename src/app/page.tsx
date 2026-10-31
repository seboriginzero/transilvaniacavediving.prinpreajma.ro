import React from 'react';
import Link from 'next/link';
import {
  Waves,
  Mountain,
  BookOpen,
  Wrench,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';
import {
  getPageByPath,
  getAllPages,
  getAllPosts,
} from '@/lib/content';
import { MediaGallery } from '@/components/MediaGallery';
import { HeroCarousel } from '@/components/HeroCarousel';
import { TiledMosaicGallery } from '@/components/TiledMosaicGallery';
import { EquipmentShowcase } from '@/components/EquipmentShowcase';
import { CardMediaThumb } from '@/components/CardMediaThumb';

export default function HomePage() {
  const homePage = getPageByPath('/');
  const allPages = getAllPages();
  const recentPosts = getAllPosts().slice(0, 6);

  const mainDestinations = [
    '/grota-ursului',
    '/pestera-liliecilor',
    '/pestera-uscata-de-la-moara',
    '/via-ferrata-cetate-dezna',
    '/belvedere-moneasa',
    '/visit-isverna',
  ]
    .map((p) => allPages.find((page) => page.path === p))
    .filter(Boolean);

  // Exact first 5 images from the original homepage Jetpack Tiled Gallery (home.html)
  const introMosaicImages = (homePage?.images || []).slice(0, 5).map((img) => ({
    src: img.localPath,
    alt: img.alt,
    caption: img.caption,
    credit: img.credit,
    width: img.width,
    height: img.height,
  }));

  // Remaining photos from the homepage archive
  const remainingHomeImages = (homePage?.images || []).slice(5);

  return (
    <div className="space-y-20 pb-20">
      {/* FULL-BLEED NATURAL PHOTOGRAPHY CAROUSEL */}
      <HeroCarousel />

      {/* ORIGINAL HOMEPAGE STATEMENT & 5-IMAGE JETPACK TILED MOSAIC */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-4xl text-center">
          <p className="font-serif text-xl italic leading-relaxed text-limestone-100 sm:text-2xl">
            „Transilvania” este un proiect dedicat promovării activităților de turism speologic, a scufundărilor, precum și pentru amenajarea și promovarea altor destinații turistice.
          </p>
        </div>
        <TiledMosaicGallery images={introMosaicImages} />
      </section>

      {/* SECTION 1: DESCOPERĂ OBIECTIVELE CARSTICE ȘI MONTANE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-cavern-700 pb-5">
          <div>
            <p className="text-sm font-medium text-karst-400">
              Peșteri, rezervații naturale și trasee montane
            </p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-limestone-50 sm:text-4xl">
              Descoperă Locurile și Peșterile Noastre
            </h2>
          </div>
          <Link
            href="/descopera"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-limestone-200 hover:text-karst-400"
          >
            Vezi toate obiectivele <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {mainDestinations.map((dest) => {
            if (!dest) return null;
            return (
              <article
                key={dest.path}
                className="editorial-card group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <Link href={dest.path} className="block w-full">
                  <CardMediaThumb src={dest.heroImage} alt={dest.cleanTitle} />
                </Link>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-limestone-300">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-karst-400" aria-hidden="true" />
                      <span>{dest.region}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-2xl font-bold text-limestone-50 group-hover:text-karst-400">
                      <Link href={dest.path}>{dest.cleanTitle}</Link>
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-limestone-200">
                      {dest.metaDescription}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-cavern-700/80 pt-4">
                    <div className="flex items-center gap-2">
                      {dest.translations && dest.translations.length > 0 ? (
                        dest.translations.map((t) => (
                          <Link
                            key={t.path}
                            href={t.path}
                            className="rounded border border-cavern-700 bg-cavern-900 px-2 py-0.5 text-xs text-limestone-300 hover:text-karst-400"
                          >
                            {t.lang.toUpperCase()}
                          </Link>
                        ))
                      ) : (
                        <span className="text-xs text-limestone-400">
                          {dest.images.length} fotografii
                        </span>
                      )}
                    </div>
                    <Link
                      href={dest.path}
                      className="inline-flex items-center gap-1 text-sm font-medium text-karst-400 transition group-hover:translate-x-0.5"
                    >
                      Citește povestea <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* WARM NATURAL CALLOUT: GROTA URSULUI SCHEDULE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="editorial-card rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3 lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-safety-400">
                <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Program de vizitare — Peștera Grota Ursului, Stațiunea Moneasa</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-limestone-50 sm:text-3xl">
                Deschisă sâmbăta și duminica între orele 11:00 – 16:00
              </h2>
              <p className="text-sm leading-relaxed text-limestone-200 sm:text-base">
                Traseu turistic amenajat și iluminat de 200 m până în Sala Czárán Gyula, alături de expoziția picturilor rupestre din Peștera Coliboaia (cca. 36.000 ani). Bilete: <strong>20 lei</strong> adulți și copii peste 14 ani · <strong>10 lei</strong> copii sub 14 ani · <strong>Gratuit</strong> pentru copii sub 5 ani, speologi și salvatori montani/speologi legitimați. Pentru grupuri organizate, deschidem și în afara programului, pe bază de programare.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
              <Link
                href="/grota-ursului"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-karst-600 px-5 py-3 text-sm font-semibold text-limestone-50 transition hover:bg-karst-500"
              >
                Detalii despre Grota Ursului
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cavern-600 bg-cavern-900 px-5 py-3 text-sm font-medium text-limestone-100 transition hover:border-limestone-300"
              >
                Programează un grup
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ACTIVITĂȚI, SERVICII ȘI PATRIMONIU */}
      <section className="border-y border-limestone-200/10 bg-cavern-950/60 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-medium text-karst-400">
              Experiențe în natură și activități specializate
            </p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-limestone-50 sm:text-4xl">
              Cu ce ne ocupăm
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="editorial-card flex flex-col justify-between rounded-2xl p-6">
              <div>
                <Waves className="h-7 w-7 text-karst-400" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl font-bold text-limestone-50">
                  Scufundări în Peșteri (Cave Diving)
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-limestone-200">
                  Ture ghidate în peșteri și galerii de mină scufundate din România și străinătate pentru scafandri brevetați, plus cursuri IANTD (Side Mount, Cavern, Intro to Cave).
                </p>
              </div>
              <Link
                href="/cave-diving"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-karst-400 hover:underline"
              >
                Află mai multe <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="editorial-card flex flex-col justify-between rounded-2xl p-6">
              <div>
                <Mountain className="h-7 w-7 text-safety-400" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl font-bold text-limestone-50">
                  Speoturism, Via Ferrata &amp; Școala Altfel
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-limestone-200">
                  Ture de speoturism cu echipament complet în Grota Ursului (250–1.500 m), traseul Via Ferrata Cetatea Dezna și excursii școlare Moneasa Adventure.
                </p>
              </div>
              <Link
                href="/aventuri"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-safety-400 hover:underline"
              >
                Vezi programele <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="editorial-card flex flex-col justify-between rounded-2xl p-6">
              <div>
                <Wrench className="h-7 w-7 text-karst-400" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl font-bold text-limestone-50">
                  Lucrări Subacvatice și la Înălțime
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-limestone-200">
                  Inspecții, mentenanță și lucrări subacvatice la baraje, hidrocentrale și stații de pompare, precum și lucrări în puțuri, spații înguste și amenajări turistice.
                </p>
              </div>
              <Link
                href="/servicii"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-karst-400 hover:underline"
              >
                Vezi serviciile <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="editorial-card flex flex-col justify-between rounded-2xl p-6">
              <div>
                <BookOpen className="h-7 w-7 text-safety-400" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl font-bold text-limestone-50">
                  Istoria Moneasa &amp; Czárán Gyula
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-limestone-200">
                  Monografia istorică a Stațiunii Moneasa (1597–prezent), viața pionierului turismului în Munții Apuseni, Czárán Gyula (1847–1906), și cărți poștale de epocă.
                </p>
              </div>
              <Link
                href="/istorie-si-patrimoniu"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-safety-400 hover:underline"
              >
                Citește istoria locului <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MAGAZIN ECHIPAMENTE (PROFESSIONAL SHOWCASE) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-cavern-700 pb-5">
          <div>
            <p className="text-sm font-medium text-karst-400">
              Distribuție oficială echipamente speologie, cave diving și salvare
            </p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-limestone-50 sm:text-4xl">
              Echipamente Profesionale la Vânzare
            </h2>
          </div>
          <Link
            href="/magazin"
            className="inline-flex items-center gap-1.5 rounded-xl bg-karst-600 px-4 py-2.5 text-xs font-semibold text-limestone-50 transition hover:bg-karst-500"
          >
            Deschide Magazinul Complet &amp; Specificațiile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <EquipmentShowcase compact />
      </section>

      {/* SECTION 4: JURNAL & ARHIVĂ DE EXPLORARE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-cavern-700 pb-5">
          <div>
            <p className="text-sm font-medium text-karst-400">
              Povești din subteran, expediții și noutăți
            </p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-limestone-50 sm:text-4xl">
              Jurnal de Explorare
            </h2>
          </div>
          <Link
            href="/jurnal"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-limestone-200 hover:text-karst-400"
          >
            Vezi toate cele 36 de articole <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {recentPosts.map((post) => (
            <article
              key={post.path}
              className="editorial-card group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <Link href={post.path} className="block w-full">
                <CardMediaThumb src={post.heroImage} alt={post.cleanTitle} />
              </Link>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between text-xs text-limestone-300">
                    <span className="font-medium text-karst-400">
                      {post.categoryLabel}
                    </span>
                    {post.publicationDate && (
                      <span>{post.publicationDate.slice(0, 10)}</span>
                    )}
                  </div>
                  <h3 className="mt-2 font-serif text-xl font-bold text-limestone-50 group-hover:text-karst-400">
                    <Link href={post.path}>{post.cleanTitle}</Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-limestone-200">
                    {post.metaDescription}
                  </p>
                </div>
                <Link
                  href={post.path}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-karst-400"
                >
                  Citește articolul <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 5: HOMEPAGE ORIGINAL ARCHIVE GALLERY */}
      {remainingHomeImages.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MediaGallery
            images={remainingHomeImages}
            title="Fotografii din Activitățile și Explorările Transilvania Cave Diving"
          />
        </div>
      )}
    </div>
  );
}
