'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, ArrowRight, Filter } from 'lucide-react';
import type { PageRecord } from '@/lib/content';
import { CardMediaThumb } from '@/components/CardMediaThumb';

interface JurnalFilterClientProps {
  posts: PageRecord[];
}

export function JurnalFilterClient({ posts }: JurnalFilterClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toate');

  const categories = useMemo(() => {
    const set = new Set<string>(['Toate']);
    for (const p of posts) {
      if (p.categoryLabel) set.add(p.categoryLabel);
    }
    return Array.from(set);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat = selectedCategory === 'Toate' || post.categoryLabel === selectedCategory;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        post.cleanTitle.toLowerCase().includes(q) ||
        post.metaDescription.toLowerCase().includes(q) ||
        post.bodyMarkdown.toLowerCase().includes(q)
      );
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div>
      {/* Search & Category Filter Controls */}
      <div className="mb-8 rounded-2xl border border-cavern-700 bg-cavern-800/90 p-5 shadow-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
          <div className="relative md:col-span-6">
            <label htmlFor="jurnal-search" className="sr-only">
              Caută în arhiva de articole
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-limestone-400"
              aria-hidden="true"
            />
            <input
              id="jurnal-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută după peșteră, curs IANTD, echipament Fenix/TecLine, an..."
              className="w-full rounded-xl border border-cavern-600 bg-cavern-950 py-2.5 pl-10 pr-4 text-sm text-limestone-100 placeholder-limestone-400 focus:border-karst-400 focus:outline-none focus:ring-1 focus:ring-karst-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 md:col-span-6">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-limestone-300 mr-1">
              <Filter className="h-3.5 w-3.5 text-karst-400" aria-hidden="true" />
              Categorie:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-karst-500 text-cavern-950'
                      : 'bg-cavern-900 text-limestone-200 hover:bg-cavern-700 hover:text-karst-400 border border-cavern-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-cavern-700/80 pt-3 text-xs text-limestone-300">
          <span>
            Afișare <strong className="text-karst-400">{filteredPosts.length}</strong> din{' '}
            <strong>{posts.length}</strong> articole publicate în arhivă
          </span>
          {(searchQuery || selectedCategory !== 'Toate') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Toate');
              }}
              className="text-karst-400 underline hover:text-karst-300"
            >
              Resetează filtrele
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article
            key={post.path}
            className="group flex flex-col overflow-hidden rounded-2xl border border-cavern-700 bg-cavern-800/80 shadow-md transition hover:border-karst-500"
          >
            <Link href={post.path} className="block w-full">
              <CardMediaThumb src={post.heroImage} alt={post.cleanTitle} />
            </Link>
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold uppercase tracking-wider text-karst-400">
                    {post.categoryLabel}
                  </span>
                  {post.publicationDate && (
                    <span className="inline-flex items-center gap-1 font-mono text-limestone-400">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      {post.publicationDate.slice(0, 10)}
                    </span>
                  )}
                </div>

                <h2 className="mt-2 text-lg font-bold text-limestone-100 group-hover:text-karst-400">
                  <Link href={post.path}>{post.cleanTitle}</Link>
                </h2>

                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-limestone-300">
                  {post.metaDescription}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-cavern-700/80 pt-3 text-xs">
                <span className="font-mono text-limestone-400">
                  {post.images.length} foto
                </span>
                <Link
                  href={post.path}
                  className="inline-flex items-center gap-1 font-semibold text-karst-400 group-hover:translate-x-0.5 transition"
                >
                  Citește articolul <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

