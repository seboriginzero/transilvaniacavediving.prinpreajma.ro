import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/visit-isverna');

export default function VisitIsvernaPage() {
  return renderStaticDocumentPage('/visit-isverna', {
    name: 'Aventuri și experiențe',
    path: '/aventuri',
  });
}

