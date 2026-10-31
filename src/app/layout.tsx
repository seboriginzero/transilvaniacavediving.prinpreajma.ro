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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const company = getCompanyInfo();
  const navigation = getNavigation();
  const orgJsonLd = buildOrganizationJsonLd();
  const siteJsonLd = buildWebSiteJsonLd();

  return (
    <html lang="ro" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tcd-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);}}catch(e){}})();`,
          }}
        />
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

