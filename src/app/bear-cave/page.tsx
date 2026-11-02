import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/bear-cave');

export default function BearCavePage() {
  return renderStaticDocumentPage('/bear-cave', { name: 'Attractions', path: '/descopera' });
}

export const dynamic = 'force-dynamic';
