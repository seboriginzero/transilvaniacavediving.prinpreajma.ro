import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/bat-cave');

export default function BatCavePage() {
  return renderStaticDocumentPage('/bat-cave', { name: 'Descoperă', path: '/descopera' });
}

