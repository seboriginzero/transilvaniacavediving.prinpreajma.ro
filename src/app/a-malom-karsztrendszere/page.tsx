import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/a-malom-karsztrendszere');

export default function AMalomKarsztrendszerePage() {
  return renderStaticDocumentPage('/a-malom-karsztrendszere', { name: 'Descoperă', path: '/descopera' });
}

