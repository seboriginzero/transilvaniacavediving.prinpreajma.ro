import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/via-ferrata-dezna-hu');

export default function ViaFerrataDeznaHuPage() {
  return renderStaticDocumentPage('/via-ferrata-dezna-hu', { name: 'Látnivalók', path: '/descopera' });
}

export const dynamic = 'force-dynamic';
