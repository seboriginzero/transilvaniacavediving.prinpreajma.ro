import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/statiunea-moneasa');

export default function StatiuneaMoneasaPage() {
  return renderStaticDocumentPage('/statiunea-moneasa', {
    name: 'Istorie și patrimoniu',
    path: '/istorie-si-patrimoniu',
  });
}

