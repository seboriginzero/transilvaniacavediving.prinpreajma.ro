import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/pestera-liliecilor');

export default function PesteraLiliecilorPage() {
  return renderStaticDocumentPage('/pestera-liliecilor', { name: 'Descoperă', path: '/descopera' });
}

