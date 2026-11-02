import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/via-ferrata-dezna-en');

export default function ViaFerrataDeznaEnPage() {
  return renderStaticDocumentPage('/via-ferrata-dezna-en', { name: 'Attractions', path: '/descopera' });
}

export const dynamic = 'force-dynamic';

