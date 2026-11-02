import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/medve-barlang');

export default function MedveBarlangPage() {
  return renderStaticDocumentPage('/medve-barlang', { name: 'Látnivalók', path: '/descopera' });
}

export const dynamic = 'force-dynamic';
