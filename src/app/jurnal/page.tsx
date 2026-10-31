import React from 'react';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/content';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JurnalFilterClient } from '@/components/JurnalFilterClient';

export const metadata: Metadata = {
  title: 'Jurnal de Explorare și Arhivă Editorială (2019–2025)',
  description:
    'Arhiva completă a celor 36 de articole publicate de Transilvania Cave Diving: expediții în Peștera Isverna și Șura Mare, cursuri IANTD, ture de speoturism în Grota Ursului, istoria Moneasa și echipamente.',
  alternates: {
    canonical: 'https://transilvaniacavediving.com/jurnal',
  },
};

export default function JurnalArchivePage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Breadcrumbs items={[{ name: 'Jurnal', path: '/jurnal' }]} />
        <span className="text-xs font-bold uppercase tracking-wider text-karst-400">
          Arhivă Completă · {posts.length} Articole Publicate (2019 – 2025)
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-limestone-50 sm:text-5xl">
          Jurnal de Explorare, Speoturism și Tehnică Subterană
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-limestone-200">
          Toate articolele, rapoartele de tură, prezentările de cursuri IANTD, ofertele istorice pentru Școala Altfel și fișele tehnice de echipamente publicate pe site-ul Transilvania Cave Diving, păstrate integral cu galerii foto și materiale video.
        </p>
      </div>

      <JurnalFilterClient posts={posts} />
    </div>
  );
}

