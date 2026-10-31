import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/the-mill-karst-system');

export default function TheMillKarstSystemPage() {
  return renderStaticDocumentPage('/the-mill-karst-system', { name: 'Descoperă', path: '/descopera' });
}

