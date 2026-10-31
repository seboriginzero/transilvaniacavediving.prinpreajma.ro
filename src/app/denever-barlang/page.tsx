import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/denever-barlang');

export default function DeneverBarlangPage() {
  return renderStaticDocumentPage('/denever-barlang', { name: 'Descoperă', path: '/descopera' });
}

