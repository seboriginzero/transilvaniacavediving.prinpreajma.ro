import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/moneasa-adventure');

export default function MoneasaAdventurePage() {
  return renderStaticDocumentPage('/moneasa-adventure', {
    name: 'Aventuri și experiențe',
    path: '/aventuri',
  });
}

