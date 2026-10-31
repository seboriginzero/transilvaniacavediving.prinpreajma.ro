import React from 'react';
import { createStaticPageMetadata, renderStaticDocumentPage } from '@/lib/route-factory';

export const metadata = createStaticPageMetadata('/blog');

export default function LegacyBlogServiciiPage() {
  return renderStaticDocumentPage('/blog', { name: 'Servicii', path: '/servicii' });
}

