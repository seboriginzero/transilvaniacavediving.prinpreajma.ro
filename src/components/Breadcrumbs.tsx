import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [{ name: 'Acasă', path: '/' }, ...items];
  const jsonLd = buildBreadcrumbJsonLd(fullItems);

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-limestone-300">
        {fullItems.map((item, idx) => {
          const isLast = idx === fullItems.length - 1;
          return (
            <li key={`${item.path}-${idx}`} className="inline-flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-cavern-500" aria-hidden="true" />}
              {isLast ? (
                <span aria-current="page" className="font-semibold text-karst-400 line-clamp-1 max-w-xs sm:max-w-md">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="inline-flex items-center gap-1 text-limestone-300 transition hover:text-karst-400"
                >
                  {idx === 0 && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

