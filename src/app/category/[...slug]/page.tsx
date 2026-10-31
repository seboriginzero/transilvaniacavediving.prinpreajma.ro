import React from 'react';
import { getAllPosts } from '@/lib/content';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JurnalFilterClient } from '@/components/JurnalFilterClient';

export default function CategoryArchiveCatchAllPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const posts = getAllPosts();
  const label = (params.slug || []).join(' / ');

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Jurnal', path: '/jurnal' },
            { name: `Categorie: ${label}`, path: `/category/${(params.slug || []).join('/')}` },
          ]}
        />
        <h1 className="text-3xl font-extrabold text-limestone-50">
          Arhivă Categorie: {label}
        </h1>
      </div>
      <JurnalFilterClient posts={posts} />
    </div>
  );
}

