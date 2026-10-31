import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageByPath, getAllPages } from './content';
import { buildPageMetadata } from './seo';
import { DocumentPageView } from '@/components/DocumentPageView';
import type { BreadcrumbItem } from '@/components/Breadcrumbs';

export function createStaticPageMetadata(routePath: string): Metadata {
  const page = getPageByPath(routePath);
  if (!page) return { title: 'Pagină negăsită' };
  return buildPageMetadata(page, routePath);
}

export function renderStaticDocumentPage(
  routePath: string,
  sectionBreadcrumb: BreadcrumbItem
) {
  const page = getPageByPath(routePath);
  if (!page) notFound();

  const allPages = getAllPages();
  const relatedPages = allPages.filter(
    (p) =>
      p.path !== routePath &&
      p.path !== '/' &&
      p.language === page.language &&
      (p.iaSection === page.iaSection || p.pageType === 'destination')
  );

  return (
    <DocumentPageView
      page={page}
      breadcrumbs={[sectionBreadcrumb, { name: page.cleanTitle, path: routePath }]}
      relatedPages={relatedPages}
    />
  );
}

