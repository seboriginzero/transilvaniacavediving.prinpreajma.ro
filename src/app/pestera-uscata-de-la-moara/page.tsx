import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/pestera-uscata-de-la-moara');

export default function SistemulCarsticMoaraPage() {
  return renderStaticDocumentPage('/pestera-uscata-de-la-moara', { name: 'Descoperă', path: '/descopera' });
}

