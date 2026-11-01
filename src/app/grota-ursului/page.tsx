import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/grota-ursului');

export default function GrotaUrsuluiPage() {
  return renderStaticDocumentPage('/grota-ursului', { name: 'Descoperă', path: '/descopera' });
}


export const dynamic = 'force-dynamic';
