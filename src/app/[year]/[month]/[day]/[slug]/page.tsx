import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostByDateAndSlug } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { DocumentPageView } from '@/components/DocumentPageView';

interface ChronologicalRouteProps {
  params: {
    year: string;
    month: string;
    day: string;
    slug: string;
  };
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => {
    const parts = post.path.split('/').filter(Boolean);
    return {
      year: parts[0],
      month: parts[1],
      day: parts[2],
      slug: decodeURIComponent(parts[3]),
    };
  });
}

export function generateMetadata({ params }: ChronologicalRouteProps): Metadata {
  const post = getPostByDateAndSlug(params.year, params.month, params.day, params.slug);
  if (!post) return { title: 'Articol negăsit' };
  return buildPageMetadata(post);
}

export default function ChronologicalPostPage({ params }: ChronologicalRouteProps) {
  const post = getPostByDateAndSlug(params.year, params.month, params.day, params.slug);
  if (!post) notFound();

  const related = getAllPosts().filter(
    (p) => p.path !== post.path && p.categoryLabel === post.categoryLabel
  );

  return (
    <DocumentPageView
      page={post}
      breadcrumbs={[
        { name: 'Jurnal', path: '/jurnal' },
        { name: post.cleanTitle, path: post.path },
      ]}
      relatedPages={related}
      showHistoricalNotice={true}
    />
  );
}

