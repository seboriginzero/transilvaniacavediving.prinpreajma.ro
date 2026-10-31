import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/belvedere-moneasa');

export default function BelvedereMoneasaPage() {
  return renderStaticDocumentPage('/belvedere-moneasa', { name: 'Descoperă', path: '/descopera' });
}

