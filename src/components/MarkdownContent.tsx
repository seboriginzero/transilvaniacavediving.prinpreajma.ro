import React from 'react';
import Link from 'next/link';
import { TiledMosaicGallery, type MosaicImageItem } from '@/components/TiledMosaicGallery';

interface MarkdownContentProps {
  markdown: string;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const tokenRegex = /(!?\[([^\]]+)\]\(([^)]+)\)|\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[2] !== undefined && match[3] !== undefined) {
      const fullToken = match[1];
      const label = match[2];
      const href = match[3].trim();

      // If an inline image token ![alt](src) ever appears inside text, render an inline <img> instead of "!alt" link
      if (fullToken.startsWith('![')) {
        if (!href.includes('placeholder-cavern.svg')) {
          result.push(
            <img
              key={`inline-img-${keyCounter++}`}
              src={href}
              alt={label}
              loading="lazy"
              className="my-3 block h-auto max-w-full rounded-xl border border-cavern-700"
            />
          );
        }
      } else {
        const isInternal = href.startsWith('/');
        if (isInternal) {
          result.push(
            <Link
              key={`link-${keyCounter++}`}
              href={href}
              className="font-semibold text-karst-400 underline decoration-karst-500/50 underline-offset-4 transition hover:text-karst-300"
            >
              {label}
            </Link>
          );
        } else {
          result.push(
            <a
              key={`ext-${keyCounter++}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-karst-400 underline decoration-karst-500/50 underline-offset-4 transition hover:text-karst-300 break-words"
            >
              {label}
            </a>
          );
        }
      }
    } else if (match[4] !== undefined) {
      result.push(
        <strong key={`bi-${keyCounter++}`} className="font-bold italic text-limestone-50">
          {match[4]}
        </strong>
      );
    } else if (match[5] !== undefined) {
      result.push(
        <strong key={`b-${keyCounter++}`} className="font-semibold text-limestone-50">
          {match[5]}
        </strong>
      );
    } else if (match[6] !== undefined) {
      result.push(
        <em key={`i-${keyCounter++}`} className="italic text-limestone-200">
          {match[6]}
        </em>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}

type ParsedBlock =
  | { kind: 'gallery'; images: MosaicImageItem[]; creditNote?: string }
  | { kind: 'text'; raw: string };

function isBoilerplateBlock(block: string): boolean {
  const trimmed = block.trim();
  if (!trimmed) return true;
  if (/^like loading/i.test(trimmed)) return true;
  if (/^#{1,6}\s*related\s*$/i.test(trimmed)) return true;
  if (/^#{1,6}\s*$/.test(trimmed)) return true;
  if (/^(posted|published)\s+by\s*\[transilvaniacavediving\]/i.test(trimmed)) return true;
  return false;
}

function extractGalleryImagesFromBlock(block: string): MosaicImageItem[] | null {
  const lines = block
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const extracted: MosaicImageItem[] = [];
  for (const line of lines) {
    const m = line.match(/^(?:[-*]\s*)?!\[([^\]]*)\]\(([^)]+)\)$/);
    if (!m) return null;
    const alt = m[1] || 'Imagine documentară';
    const src = m[2].trim();
    if (!src.includes('placeholder-cavern.svg')) {
      extracted.push({ src, alt });
    }
  }
  return extracted;
}

function isUnorderedListBlock(block: string): boolean {
  const lines = block
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    lines.length > 0 &&
    lines.every(
      (l) =>
        (l.startsWith('- ') || l.startsWith('* ') || l.startsWith('■')) &&
        !/^(?:[-*]\s*)?!\[([^\]]*)\]\(([^)]+)\)$/.test(l)
    )
  );
}

function isOrderedListBlock(block: string): boolean {
  const lines = block
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length > 0 && lines.every((l) => /^\d+\.\s+/.test(l));
}

function groupMarkdownBlocks(rawBlocks: string[]): ParsedBlock[] {
  const grouped: ParsedBlock[] = [];
  let i = 0;

  while (i < rawBlocks.length) {
    const block = rawBlocks[i];
    if (isBoilerplateBlock(block)) {
      i++;
      continue;
    }

    const firstImages = extractGalleryImagesFromBlock(block);
    if (firstImages) {
      const images: MosaicImageItem[] = [];
      const seenInGallery = new Set<string>();

      while (i < rawBlocks.length) {
        const current = rawBlocks[i];
        const imgs = extractGalleryImagesFromBlock(current);
        if (!imgs) break;
        for (const item of imgs) {
          if (!seenInGallery.has(item.src)) {
            seenInGallery.add(item.src);
            images.push(item);
          }
        }
        i++;
      }

      // Check if the immediately following block is a level-6 photo credit ("###### Foto: ...")
      let creditNote: string | undefined;
      if (i < rawBlocks.length) {
        const nextHeading = rawBlocks[i].match(/^#{6}\s+([\s\S]+)$/);
        if (nextHeading) {
          creditNote = nextHeading[1].replace(/\n+/g, ' ').replace(/\*\*|\*/g, '').trim();
          i++;
        }
      }

      if (images.length > 0) {
        grouped.push({ kind: 'gallery', images, creditNote });
      }
      continue;
    }

    // Merge consecutive unordered list blocks so items separated by blank lines form a single <ul>
    if (isUnorderedListBlock(block)) {
      const mergedLines: string[] = [];
      while (i < rawBlocks.length && isUnorderedListBlock(rawBlocks[i])) {
        mergedLines.push(
          ...rawBlocks[i]
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)
        );
        i++;
      }
      grouped.push({ kind: 'text', raw: mergedLines.join('\n') });
      continue;
    }

    // Merge consecutive ordered list blocks so items separated by blank lines form a single <ol>
    if (isOrderedListBlock(block)) {
      const mergedLines: string[] = [];
      while (i < rawBlocks.length && isOrderedListBlock(rawBlocks[i])) {
        mergedLines.push(
          ...rawBlocks[i]
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)
        );
        i++;
      }
      grouped.push({ kind: 'text', raw: mergedLines.join('\n') });
      continue;
    }

    grouped.push({ kind: 'text', raw: block });
    i++;
  }

  return grouped;
}

export function MarkdownContent({ markdown }: MarkdownContentProps) {
  if (!markdown) return null;

  const rawBlocks = markdown
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const groupedBlocks = groupMarkdownBlocks(rawBlocks);

  return (
    <div className="space-y-5 text-base leading-relaxed text-limestone-100">
      {groupedBlocks.map((item, idx) => {
        if (item.kind === 'gallery') {
          return (
            <div key={`gallery-${idx}`} className="my-7">
              <TiledMosaicGallery images={item.images} />
              {item.creditNote && (
                <p className="-mt-3 mb-4 text-center font-mono text-xs italic text-karst-400">
                  {renderInlineFormatting(item.creditNote)}
                </p>
              )}
            </div>
          );
        }

        const block = item.raw;

        // Headings: # to ######
        const headingMatch = block.match(/^(#{1,6})\s+([\s\S]+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const rawText = headingMatch[2].replace(/\n+/g, ' ').trim();
          const cleanText = rawText.replace(/\*\*|\*/g, '');
          const id = slugifyHeading(cleanText);

          if (level === 6) {
            return (
              <p
                key={idx}
                className="-mt-3 mb-4 text-center font-mono text-xs italic text-karst-400"
              >
                {renderInlineFormatting(rawText)}
              </p>
            );
          }

          if (level <= 2) {
            return (
              <h2
                key={idx}
                id={id}
                className="mt-10 scroll-mt-28 border-b border-cavern-700 pb-2.5 font-serif text-2xl font-bold tracking-tight text-limestone-50"
              >
                {renderInlineFormatting(rawText)}
              </h2>
            );
          }

          if (level === 3) {
            return (
              <h3
                key={idx}
                id={id}
                className="mt-8 scroll-mt-28 font-serif text-xl font-bold text-karst-400"
              >
                {renderInlineFormatting(rawText)}
              </h3>
            );
          }

          return (
            <h4
              key={idx}
              id={id}
              className="mt-6 scroll-mt-28 text-lg font-semibold text-limestone-100"
            >
              {renderInlineFormatting(rawText)}
            </h4>
          );
        }

        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

        // Markdown Pipe Table block (| Col 1 | Col 2 |)
        if (lines.length >= 2 && lines.every((l) => l.startsWith('|') && l.endsWith('|'))) {
          const parsedRows = lines
            .filter((l) => !/^\|[\s\-:|]+\|$/.test(l))
            .map((l) =>
              l
                .slice(1, -1)
                .split('|')
                .map((cell) => cell.trim())
            );

          if (parsedRows.length > 0) {
            const [headerRow, ...bodyRows] = parsedRows;
            const hasHeaderText = headerRow.some((cell) => cell.length > 0);
            return (
              <div
                key={idx}
                className="my-6 overflow-x-auto rounded-xl border border-cavern-700 bg-cavern-900/70 shadow-md"
              >
                <table className="w-full border-collapse text-left text-sm">
                  {hasHeaderText && (
                    <thead className="border-b border-cavern-700 bg-cavern-950/80 text-xs uppercase tracking-wider text-karst-400">
                      <tr>
                        {headerRow.map((cell, cIdx) => (
                          <th key={cIdx} className="px-4 py-3 font-bold">
                            {renderInlineFormatting(cell)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-cavern-800">
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx} className="transition hover:bg-cavern-800/40">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-4 py-2.5 align-top ${
                              cIdx === 0
                                ? 'font-medium text-limestone-200 sm:w-2/5'
                                : 'text-limestone-100'
                            }`}
                          >
                            {renderInlineFormatting(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // Unordered list block (- , * , or ■)
        if (
          lines.every(
            (l) => l.startsWith('- ') || l.startsWith('* ') || l.startsWith('■')
          )
        ) {
          return (
            <ul
              key={idx}
              className="my-4 list-disc space-y-2 rounded-xl border border-cavern-800 bg-cavern-900/50 py-4 pl-8 pr-4 text-limestone-100"
            >
              {lines.map((line, lIdx) => (
                <li key={lIdx} className="leading-relaxed">
                  {renderInlineFormatting(line.replace(/^(?:[-*]|■)\s*/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        // Ordered list block
        if (lines.every((l) => /^\d+\.\s+/.test(l))) {
          return (
            <ol
              key={idx}
              className="my-4 list-decimal space-y-2 rounded-xl border border-cavern-800 bg-cavern-900/50 py-4 pl-8 pr-4 text-limestone-100"
            >
              {lines.map((line, lIdx) => (
                <li key={lIdx} className="leading-relaxed">
                  {renderInlineFormatting(line.replace(/^\d+\.\s+/, ''))}
                </li>
              ))}
            </ol>
          );
        }

        // Blockquote
        if (lines.every((l) => l.startsWith('>'))) {
          return (
            <blockquote
              key={idx}
              className="my-6 border-l-4 border-karst-500 bg-cavern-800/70 py-3 pl-5 pr-4 italic text-limestone-200 rounded-r-xl"
            >
              {lines.map((line, lIdx) => (
                <p key={lIdx}>{renderInlineFormatting(line.replace(/^>\s*/, ''))}</p>
              ))}
            </blockquote>
          );
        }

        // Multi-line paragraph
        return (
          <p key={idx} className="leading-relaxed text-limestone-100">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {renderInlineFormatting(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
