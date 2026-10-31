import React from 'react';
import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/blog');

export default function ServiciiPage() {
  return renderStaticDocumentPage('/blog', { name: 'Servicii', path: '/servicii' });
}

