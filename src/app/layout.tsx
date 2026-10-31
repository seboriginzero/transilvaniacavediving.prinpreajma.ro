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
    'Transilvania Cave Diving — Peștera Grota Ursului Moneasa, Peștera Liliecilor, Sistemul Carstic de la Moară, Via Ferrata Cetatea Dezna, Peștera Isverna, cursuri IANTD, echipamente și lucrări subacvatice.',
  openGraph: {
    siteName: 'Transilvania Cave Diving',
    locale: 'ro_RO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const company = getCompanyInfo();
  const navigation = getNavigation();
  const orgJsonLd = buildOrganizationJsonLd();
  const siteJsonLd = buildWebSiteJsonLd();

  return (
    <html lang="ro" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-cavern-900 text-limestone-100 antialiased">
        <Header navigation={navigation} phonePrimary={company.phonePrimary} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer company={company} />
      </body>
    </html>
  );
}

