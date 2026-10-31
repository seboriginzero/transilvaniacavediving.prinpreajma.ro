import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/czaran-gyula');

export default function CzaranGyulaPage() {
  return renderStaticDocumentPage('/czaran-gyula', {
    name: 'Istorie și patrimoniu',
    path: '/istorie-si-patrimoniu',
  });
}

