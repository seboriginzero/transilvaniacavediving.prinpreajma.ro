import siteDatabaseRaw from '@/content/site-database.json';

export interface MediaImage {
  sourceUrl: string;
  localPath: string;
  alt: string;
  caption: string;
  credit: string;
  width: number;
  height: number;
}

export interface ContentSection {
  heading: string;
  level: number;
  contentMarkdown: string;
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface TranslationLink {
  lang: string;
  path: string;
  label: string;
}

export interface PageRecord {
  sourceUrl: string;
  finalUrl: string;
  canonicalUrl: string;
  path: string;
  slug: string;
  title: string;
  cleanTitle: string;
  metaDescription: string;
  language: string;
  pageType: string;
  iaSection: string;
  categoryLabel: string;
  region: string;
  translations: TranslationLink[];
  heroImage: string;
  images: MediaImage[];
  videos: string[];
  documents: string[];
  headings: { level: number; text: string }[];
  sections: ContentSection[];
  bodyMarkdown: string;
  contactInformation: string[];
  prices: string[];
  schedules: string[];
  historicalDates: string[];
  safetyWarnings: string[];
  technicalSpecs: TechnicalSpec[];
  scheduleSummary: string | null;
  pricingSummary: string | null;
  publicationDate: string | null;
  lastModified: string | null;
  validationStatus: string;
  migrationStatus: string;
}

export interface EquipmentBrand {
  name: string;
  slug: string;
  category: string;
  description: string;
  image: string;
}

export interface NavItem {
  label: string;
  href: string;
  description: string;
  children?: {
    label: string;
    href: string;
    badge?: string;
  }[];
}

export interface CompanyInfo {
  legalName: string;
  brandName: string;
  cif: string;
  regCom: string;
  headquarters: string;
  operationalBase: string;
  phonePrimary: string;
  phoneSecondaryHistorical: string;
  facebookUrl: string;
  youtubeUrl: string;
  mapsGrotaUrsului: string;
}

export interface SiteDatabase {
  generatedAt: string;
  company: CompanyInfo;
  navigation: NavItem[];
  pages: PageRecord[];
  posts: PageRecord[];
  archives: PageRecord[];
  equipmentBrands: EquipmentBrand[];
  stats: {
    totalCrawledHtmlUrls: number;
    totalMainPages: number;
    totalBlogPosts: number;
    totalArchivePages: number;
    totalMediaAssetsDiscovered: number;
    totalLocalMediaFiles: number;
  };
}

const db = siteDatabaseRaw as unknown as SiteDatabase;

export function getSiteDatabase(): SiteDatabase {
  return db;
}

export function getCompanyInfo(): CompanyInfo {
  return db.company;
}

export function getNavigation(): NavItem[] {
  return db.navigation;
}

export function getAllPages(): PageRecord[] {
  return db.pages;
}

export function getPageByPath(routePath: string): PageRecord | undefined {
  const normalized = routePath === '/' ? '/' : `/${routePath.replace(/^\/+|\/+$/g, '')}`;
  return db.pages.find((p) => p.path === normalized);
}

const LEGACY_SLUG_ALIASES: Record<string, string> = {
  'lanterna-frontala-fenix-hm75r-1600-lumeni': 'fenix-hm75r-lanterna-frontala-1600-lumeni-223-metri',
  'lanterna-frontala-fenix-hp30r-v2-0-3000-lumeni': 'fenix-hp30r-v2-0-lanterna-frontala-3000-lumeni-270-metri',
  'lanterna-frontala-fenix-hm70r-1600-lumeni': 'nou-lanterna-frontala-fenix-hm70r-1600-lumeni',
  'lanterna-frontala-fenix-hp16r-1700-lumeni': 'fenix-hp16r-1700-lumens-high-performance-rechargeable-outdoor-headlamp',
  'set-sidemount-tecline': 'oferta-set-sidemount-tecline-15-discount',
  'led-teclight-standard-3900-lumeni': 'led-teclight-standard-3900-lm-military-line',
  'compresor-bauer-junior-ii-30th-anniversary': 'junior-ii-30th-anniversary-%f0%9f%8e%89',
  'junior-ii-30th-anniversary': 'junior-ii-30th-anniversary-%f0%9f%8e%89',
};

export function getAllPosts(): PageRecord[] {
  return db.posts;
}

export function getPostBySlug(slug: string): PageRecord | undefined {
  let decoded = slug.toLowerCase();
  try {
    decoded = decodeURIComponent(slug).toLowerCase();
  } catch {
    // keep raw slug if malformed URI component
  }
  const canonicalSlug =
    LEGACY_SLUG_ALIASES[decoded] || LEGACY_SLUG_ALIASES[slug.toLowerCase()] || decoded;

  return db.posts.find((p) => {
    const pSlugLower = p.slug.toLowerCase();
    const pSlugDecoded = decodeURIComponent(p.slug).toLowerCase();
    return (
      pSlugLower === canonicalSlug ||
      pSlugDecoded === canonicalSlug ||
      pSlugLower === decoded ||
      pSlugDecoded === decoded ||
      p.path.toLowerCase().endsWith(`/${canonicalSlug}`) ||
      p.path.toLowerCase().endsWith(`/${decoded}`)
    );
  });
}

export function getPostByDateAndSlug(
  year: string,
  month: string,
  day: string,
  slug: string
): PageRecord | undefined {
  let decodedSlug = slug.toLowerCase();
  try {
    decodedSlug = decodeURIComponent(slug).toLowerCase();
  } catch {
    // keep raw slug if malformed URI component
  }
  const canonicalSlug =
    LEGACY_SLUG_ALIASES[decodedSlug] || LEGACY_SLUG_ALIASES[slug.toLowerCase()] || decodedSlug;
  const targetPath = `/${year}/${month}/${day}/${canonicalSlug}`;

  return db.posts.find((p) => {
    const pPathLower = p.path.toLowerCase();
    const pDecoded = decodeURIComponent(p.path).toLowerCase();
    const pSlugLower = p.slug.toLowerCase();
    const pSlugDecoded = decodeURIComponent(p.slug).toLowerCase();
    return (
      pPathLower === targetPath ||
      pDecoded === targetPath ||
      pSlugLower === canonicalSlug ||
      pSlugDecoded === canonicalSlug ||
      pSlugLower === decodedSlug ||
      pSlugDecoded === decodedSlug
    );
  });
}

export function getEquipmentBrands(): EquipmentBrand[] {
  return db.equipmentBrands;
}

export function getEquipmentArticles(): PageRecord[] {
  return db.posts.filter((p) => p.categoryLabel === 'Echipamente și Tehnică');
}

export function getCaveDivingArticles(): PageRecord[] {
  return db.posts.filter(
    (p) =>
      p.categoryLabel === 'Cave Diving și Cursuri' ||
      p.cleanTitle.toLowerCase().includes('isverna') ||
      p.cleanTitle.toLowerCase().includes('cave') ||
      p.cleanTitle.toLowerCase().includes('iantd') ||
      p.cleanTitle.toLowerCase().includes('scufund') ||
      p.cleanTitle.toLowerCase().includes('sura mare') ||
      p.cleanTitle.toLowerCase().includes('șura mare')
  );
}

