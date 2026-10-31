import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { DocumentPageView } from '@/components/DocumentPageView';

interface RouteParams {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const posts = getAllPosts();
  const params: { slug: string }[] = [];
  for (const post of posts) {
    const decoded = decodeURIComponent(post.slug);
    params.push({ slug: decoded });
    if (post.slug !== decoded) {
      params.push({ slug: post.slug });
    }
  }
  return params;
}

export function generateMetadata({ params }: RouteParams): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Articol negăsit' };
  return buildPageMetadata(post);
}

export default function JurnalArticlePage({ params }: RouteParams) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getAllPosts().filter(
    (p) => p.path !== post.path && p.categoryLabel === post.categoryLabel
  );

  return (
    <DocumentPageView
      page={post}
      breadcrumbs={[
        { name: 'Jurnal', path: '/jurnal' },
        { name: post.cleanTitle, path: `/jurnal/${post.slug}` },
      ]}
      relatedPages={related}
      showHistoricalNotice={true}
    />
  );
}

