import type { Metadata } from 'next';
import './globals.css';
import { getCompanyInfo, getNavigation } from '@/lib/content';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/seo';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://transilvaniacavediving.com'),
  title: {
    default: 'Transilvania Cave Diving — Explorare Subterană, Speoturism și Scufundări în Peșteri',
    template: '%s | Transilvania Cave Diving',
  },
  description:
    'Transilvania Cave Diving — Peștera Grota Ursului Moneasa, Peștera Liliecilor, Sistemul Carstic de la Moară, Via Ferrata Cetatea Dezna, explorare speologică și patrimoniu în Munții Codru-Moma.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/media/logos/tcd-vampire-logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    siteName: 'Transilvania Cave Diving',
    locale: 'ro_RO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company = getCompanyInfo();
  const navigation = getNavigation();

  const orgJsonLd = buildOrganizationJsonLd();
  const webSiteJsonLd = buildWebSiteJsonLd();

  return (
    <html lang="ro" data-theme="dark" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('tcd-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-cavern-950 font-sans text-limestone-100 antialiased selection:bg-karst-600 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[150] focus:rounded-full focus:bg-karst-600 focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:text-white focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
        >
          Sari la conținutul principal
        </a>
        <Header navigation={navigation} phonePrimary={company.phonePrimary} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer company={company} />
      </body>
    </html>
  );
}
