import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/via-ferrata-cetate-dezna');

export const dynamic = 'force-dynamic';

export default function ViaFerrataDeznaPage() {
  return renderStaticDocumentPage('/via-ferrata-cetate-dezna', {
    name: 'Aventuri și experiențe',
    path: '/aventuri',
  });
}

