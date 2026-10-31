import type { MetadataRoute } from 'next';
import { getAllPages, getAllPosts } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://transilvaniacavediving.com';
  const pages = getAllPages();
  const posts = getAllPosts();

  const hubRoutes = [
    '/descopera',
    '/aventuri',
    '/cave-diving',
    '/servicii',
    '/istorie-si-patrimoniu',
    '/jurnal',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    entries.push({
      url: `${siteUrl}${page.path === '/' ? '' : page.path}`,
      lastModified: page.lastModified ? new Date(page.lastModified) : new Date(),
      changeFrequency: page.path === '/' ? 'weekly' : 'monthly',
      priority: page.path === '/' ? 1.0 : 0.9,
    });
  }

  for (const hub of hubRoutes) {
    entries.push({
      url: `${siteUrl}${hub}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  for (const post of posts) {
    entries.push({
      url: `${siteUrl}${post.path}`,
      lastModified: post.lastModified ? new Date(post.lastModified) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}

