import type { Metadata } from 'next';
import { getCompanyInfo, type PageRecord } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://transilvaniacavediving.com';

export function buildPageMetadata(page: PageRecord, overridePath?: string): Metadata {
  const canonicalPath = overridePath || page.path;
  const fullUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
  const description =
    page.metaDescription ||
    `${page.cleanTitle} — Informații oficiale, descrieri tehnice, istoric și ghidaj de la Transilvania Cave Diving.`;

  const languages: Record<string, string> = {};
  if (page.translations && page.translations.length > 0) {
    for (const t of page.translations) {
      languages[t.lang] = `${SITE_URL}${t.path}`;
    }
  }

  return {
    title: page.title,
    description,
    alternates: {
      canonical: fullUrl,
      ...(Object.keys(languages).length > 0 ? { languages } : {}),
    },
    openGraph: {
      title: page.title,
      description,
      url: fullUrl,
      siteName: 'Transilvania Cave Diving',
      locale: page.language === 'en' ? 'en_US' : page.language === 'hu' ? 'hu_HU' : 'ro_RO',
      type: page.pageType === 'article' ? 'article' : 'website',
      images: [
        {
          url: `${SITE_URL}${page.heroImage}`,
          alt: page.cleanTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description,
      images: [`${SITE_URL}${page.heroImage}`],
    },
  };
}

export function buildOrganizationJsonLd() {
  const company = getCompanyInfo();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: company.brandName,
    legalName: company.legalName,
    taxID: company.cif,
    url: SITE_URL,
    logo: `${SITE_URL}/media/logos/tcd-logo.svg`,
    telephone: company.phonePrimary,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Arad',
      addressRegion: 'Arad',
      addressCountry: 'RO',
    },
    sameAs: [company.facebookUrl, company.youtubeUrl],
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Transilvania Cave Diving',
    inLanguage: ['ro-RO', 'en-US', 'hu-HU'],
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

export function buildPageEntityJsonLd(page: PageRecord) {
  const fullUrl = `${SITE_URL}${page.path === '/' ? '' : page.path}`;

  if (page.pageType === 'destination') {
    return {
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      name: page.cleanTitle,
      description: page.metaDescription,
      url: fullUrl,
      image: page.images.slice(0, 5).map((i) => `${SITE_URL}${i.localPath}`),
      inLanguage: page.language,
      isAccessibleForFree: page.path === '/via-ferrata-cetate-dezna' || page.path === '/pestera-liliecilor',
      address: {
        '@type': 'PostalAddress',
        addressRegion: page.region,
        addressCountry: 'RO',
      },
    };
  }

  if (page.pageType === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.cleanTitle,
      description: page.metaDescription,
      url: fullUrl,
      image: [`${SITE_URL}${page.heroImage}`],
      datePublished: page.publicationDate || '2021-01-01T00:00:00Z',
      dateModified: page.lastModified || page.publicationDate || '2021-01-01T00:00:00Z',
      author: {
        '@id': `${SITE_URL}/#organization`,
      },
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
    };
  }

  return null;
}

