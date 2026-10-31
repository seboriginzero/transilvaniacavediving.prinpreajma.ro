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
  const params: { year: string; month: string; day: string; slug: string }[] = [];
  for (const post of posts) {
    const parts = post.path.split('/').filter(Boolean);
    const rawSlug = parts[3];
    const decodedSlug = decodeURIComponent(rawSlug);
    params.push({
      year: parts[0],
      month: parts[1],
      day: parts[2],
      slug: decodedSlug,
    });
    if (rawSlug !== decodedSlug) {
      params.push({
        year: parts[0],
        month: parts[1],
        day: parts[2],
        slug: rawSlug,
      });
    }
  }
  return params;
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

