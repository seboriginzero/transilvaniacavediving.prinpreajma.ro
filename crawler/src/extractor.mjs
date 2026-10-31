import crypto from 'node:crypto';

/**
 * Decode common HTML entities while preserving UTF-8 and Romanian diacritics.
 */
export function decodeHtmlEntities(str) {
  if (!str) return '';
  const named = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#039;': "'",
    '&ndash;': '–',
    '&mdash;': '—',
    '&hellip;': '…',
    '&laquo;': '«',
    '&raquo;': '»',
    '&bdquo;': '„',
    '&ldquo;': '“',
    '&rdquo;': '”',
    '&lsquo;': '‘',
    '&rsquo;': '’',
    '&copy;': '©',
    '&reg;': '®',
    '&deg;': '°',
    '&euro;': '€',
    '&bull;': '•',
  };

  return str
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return Number.isNaN(code) ? _ : String.fromCodePoint(code);
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = parseInt(hex, 16);
      return Number.isNaN(code) ? _ : String.fromCodePoint(code);
    })
    .replace(/&[a-zA-Z0-9#]+;/g, (entity) => named[entity] ?? entity);
}

export function stripTags(html) {
  if (!html) return '';
  return decodeHtmlEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim()
  );
}

export function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Normalize a discovered URL relative to baseUrl.
 */
export function normalizeUrl(rawHref, baseUrl, excludedQueryParams = []) {
  if (!rawHref) return null;
  const trimmed = decodeHtmlEntities(rawHref.trim());
  if (
    !trimmed ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('data:')
  ) {
    return null;
  }

  let parsed;
  try {
    parsed = new URL(trimmed, baseUrl);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return null;
  }

  // Canonicalize primary domain to https://transilvaniacavediving.com
  if (
    parsed.hostname === 'www.transilvaniacavediving.com' ||
    parsed.hostname === 'transilvaniacavediving.com'
  ) {
    parsed.protocol = 'https:';
    parsed.hostname = 'transilvaniacavediving.com';
  }

  parsed.hash = '';

  // Remove excluded query parameters
  for (const param of excludedQueryParams) {
    parsed.searchParams.delete(param.trim());
  }

  // Sort remaining query params for deterministic URL normalization
  parsed.searchParams.sort();

  return parsed.toString();
}

/**
 * Extract attribute value from an HTML tag string.
 */
export function getAttr(tag, attrName) {
  const regex = new RegExp(`\\b${attrName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>` + '`]+))', 'i');
  const match = tag.match(regex);
  if (!match) return null;
  return decodeHtmlEntities(match[1] ?? match[2] ?? match[3] ?? '');
}

/**
 * Convert an HTML region (such as <main>, <article>, or .entry-content) into rich Markdown
 * while preserving headings, paragraphs, lists, tables, blockquotes, links, captions, and images.
 */
export function htmlToMarkdown(html, baseUrl) {
  if (!html) return '';

  // Remove scripts, styles, navs, forms, and WordPress sharing/likes widgets
  let cleaned = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<div[^>]*class="[^"]*(?:sharedaddy|jp-relatedposts|wpcnt|wpa|sd-sharing-enabled|jetpack-likes-widget-wrapper)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

  // Convert figure + figcaption
  cleaned = cleaned.replace(/<figure\b[^>]*>([\s\S]*?)<\/figure>/gi, (_, inner) => {
    const imgMatch = inner.match(/<img\b[^>]*>/i);
    const capMatch = inner.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i);
    const caption = capMatch ? stripTags(capMatch[1]) : '';
    if (imgMatch) {
      const origFile = getAttr(imgMatch[0], 'data-orig-file') || getAttr(imgMatch[0], 'src') || '';
      const alt = getAttr(imgMatch[0], 'alt') || caption || '';
      const absSrc = normalizeUrl(origFile, baseUrl) || origFile;
      return `\n\n![${alt}](${absSrc})${caption ? `\n*${caption}*` : ''}\n\n`;
    }
    return inner;
  });

  // Convert standalone images
  cleaned = cleaned.replace(/<img\b[^>]*>/gi, (imgTag) => {
    const origFile = getAttr(imgTag, 'data-orig-file') || getAttr(imgTag, 'src') || '';
    const alt = getAttr(imgTag, 'alt') || '';
    const absSrc = normalizeUrl(origFile, baseUrl) || origFile;
    if (!absSrc) return '';
    return `\n![${alt}](${absSrc})\n`;
  });

  // Convert links
  cleaned = cleaned.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (full, attrs, inner) => {
    const href = getAttr(`<a ${attrs}>`, 'href');
    const text = stripTags(inner);
    if (!text) return inner;
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return text;
    const absHref = normalizeUrl(href, baseUrl) || href;
    return `[${text}](${absHref})`;
  });

  // Convert headings h1-h6
  for (let level = 1; level <= 6; level++) {
    const hashes = '#'.repeat(level);
    const re = new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, 'gi');
    cleaned = cleaned.replace(re, (_, inner) => `\n\n${hashes} ${stripTags(inner)}\n\n`);
  }

  // Convert blockquotes
  cleaned = cleaned.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const text = stripTags(inner);
    return `\n\n> ${text.split('\n').join('\n> ')}\n\n`;
  });

  // Convert tables
  cleaned = cleaned.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (_, tableInner) => {
    const rows = [];
    const trRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch;
    while ((trMatch = trRegex.exec(tableInner)) !== null) {
      const cells = [];
      const cellRegex = /<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
      let cellMatch;
      while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
        cells.push(stripTags(cellMatch[1]).replace(/\|/g, '\\|').replace(/\n+/g, ' '));
      }
      if (cells.length > 0) rows.push(cells);
    }
    if (rows.length === 0) return '';
    const colCount = Math.max(...rows.map((r) => r.length));
    const lines = [];
    rows.forEach((row, idx) => {
      const padded = Array.from({ length: colCount }, (_, i) => row[i] || '');
      lines.push(`| ${padded.join(' | ')} |`);
      if (idx === 0) {
        lines.push(`| ${padded.map(() => '---').join(' | ')} |`);
      }
    });
    return `\n\n${lines.join('\n')}\n\n`;
  });

  // Convert list items
  cleaned = cleaned.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => {
    return `\n- ${stripTags(inner)}`;
  });
  cleaned = cleaned.replace(/<\/?(?:ul|ol)\b[^>]*>/gi, '\n\n');

  // Convert strong/em
  cleaned = cleaned.replace(/<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, (_, inner) => {
    const t = stripTags(inner);
    return t ? `**${t}**` : '';
  });
  cleaned = cleaned.replace(/<(?:em|i)\b[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, (_, inner) => {
    const t = stripTags(inner);
    return t ? `*${t}*` : '';
  });

  // Convert paragraphs and breaks
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
  cleaned = cleaned.replace(/<p\b[^>]*>/gi, '\n\n');
  cleaned = cleaned.replace(/<\/div>/gi, '\n');

  // Strip remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  cleaned = decodeHtmlEntities(cleaned);

  // Normalize blank lines
  return cleaned
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extract structured page record matching Section 2.4 mandatory fields.
 */
export function extractPageRecord(html, sourceUrl, finalUrl, config) {
  const retrievedAt = new Date().toISOString();

  // Language
  const langMatch = html.match(/<html[^>]*\blang=["']([^"']+)["']/i);
  const language = langMatch ? langMatch[1].toLowerCase().split('-')[0] : 'ro';

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const sourceTitle = titleMatch ? stripTags(titleMatch[1]) : '';

  // Meta tags
  let metaDescription = '';
  let canonicalUrl = '';
  let publicationDate = null;
  let lastModified = null;
  const ogImages = [];

  const metaRegex = /<meta\b[^>]*>/gi;
  let metaMatch;
  while ((metaMatch = metaRegex.exec(html)) !== null) {
    const tag = metaMatch[0];
    const name = (getAttr(tag, 'name') || getAttr(tag, 'property') || '').toLowerCase();
    const content = getAttr(tag, 'content') || '';
    if (!content) continue;
    if (name === 'description' && !metaDescription) {
      metaDescription = content;
    } else if (name === 'og:description' && !metaDescription) {
      metaDescription = content;
    } else if (name === 'article:published_time' && !publicationDate) {
      publicationDate = content;
    } else if (name === 'article:modified_time' && !lastModified) {
      lastModified = content;
    } else if (name === 'og:image') {
      const norm = normalizeUrl(content, finalUrl);
      if (norm) ogImages.push(norm);
    }
  }

  // Canonical link
  const linkRegex = /<link\b[^>]*>/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    const tag = linkMatch[0];
    const rel = (getAttr(tag, 'rel') || '').toLowerCase();
    if (rel === 'canonical') {
      const href = getAttr(tag, 'href');
      if (href) canonicalUrl = normalizeUrl(href, finalUrl) || href;
    }
  }

  // Structured data JSON-LD
  const structuredData = [];
  const ldRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ldMatch;
  while ((ldMatch = ldRegex.exec(html)) !== null) {
    try {
      structuredData.push(JSON.parse(ldMatch[1].trim()));
    } catch {
      // ignore malformed json-ld
    }
  }

  // Isolate main content area (entry-content, article, main, or body fallback)
  let mainHtml = html;
  const entryMatch =
    html.match(/<div[^>]*class=["'][^"']*entry-content[^"']*["'][^>]*>([\s\S]*?)<\/article>/i) ||
    html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i) ||
    html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) ||
    html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);

  if (entryMatch) {
    mainHtml = entryMatch[1];
  }

  // Headings & Sections
  const headings = [];
  const sections = [];
  const headingRegex = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;
  const headingMatches = [];
  let hMatch;
  while ((hMatch = headingRegex.exec(mainHtml)) !== null) {
    const level = parseInt(hMatch[1].slice(1), 10);
    const text = stripTags(hMatch[2]);
    if (text) {
      headings.push({ level, text });
      headingMatches.push({ level, text, index: hMatch.index, endIndex: headingRegex.lastIndex });
    }
  }

  if (headingMatches.length > 0) {
    // Capture intro before first heading if any
    const introHtml = mainHtml.slice(0, headingMatches[0].index);
    const introMd = htmlToMarkdown(introHtml, finalUrl);
    if (introMd.length > 20) {
      sections.push({
        heading: 'Introducere',
        level: 1,
        content_markdown: introMd,
      });
    }
    for (let i = 0; i < headingMatches.length; i++) {
      const current = headingMatches[i];
      const nextIndex = i + 1 < headingMatches.length ? headingMatches[i + 1].index : mainHtml.length;
      const sliceHtml = mainHtml.slice(current.endIndex, nextIndex);
      const md = htmlToMarkdown(sliceHtml, finalUrl);
      sections.push({
        heading: current.text,
        level: current.level,
        content_markdown: md,
      });
    }
  } else {
    const fullMd = htmlToMarkdown(mainHtml, finalUrl);
    if (fullMd) {
      sections.push({
        heading: sourceTitle || 'Conținut principal',
        level: 1,
        content_markdown: fullMd,
      });
    }
  }

  const bodyMarkdown = htmlToMarkdown(mainHtml, finalUrl);

  // Extract images from entire page & main content
  const imagesMap = new Map();
  const addImage = (rawUrl, meta = {}) => {
    const norm = normalizeUrl(rawUrl, finalUrl);
    if (!norm) return;
    // Strip WP resize query params (?w=..., ?resize=...) to also get original high-res URL
    let cleanUrl = norm;
    try {
      const u = new URL(norm);
      if (u.hostname.endsWith('wordpress.com') || u.hostname.endsWith('wp.com')) {
        u.searchParams.delete('w');
        u.searchParams.delete('h');
        u.searchParams.delete('crop');
        u.searchParams.delete('resize');
        u.searchParams.delete('fit');
        cleanUrl = u.toString();
      }
    } catch {
      // keep norm
    }
    const existing = imagesMap.get(cleanUrl) || {
      url: cleanUrl,
      raw_url: norm,
      alt: '',
      caption: '',
      credit: '',
      width: null,
      height: null,
    };
    if (meta.alt && !existing.alt) existing.alt = meta.alt;
    if (meta.caption && !existing.caption) existing.caption = meta.caption;
    if (meta.credit && !existing.credit) existing.credit = meta.credit;
    if (meta.width && !existing.width) existing.width = meta.width;
    if (meta.height && !existing.height) existing.height = meta.height;
    imagesMap.set(cleanUrl, existing);
  };

  // Check figures for caption/credit pairing
  const figureRegex = /<figure\b[^>]*>([\s\S]*?)<\/figure>/gi;
  let figMatch;
  while ((figMatch = figureRegex.exec(html)) !== null) {
    const inner = figMatch[1];
    const capMatch = inner.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i);
    const caption = capMatch ? stripTags(capMatch[1]) : '';
    let credit = '';
    if (/foto\s*:|credit\s*:|photo\s*:|autor\s*:/i.test(caption)) {
      credit = caption;
    }
    const imgInFigRegex = /<img\b[^>]*>/gi;
    let im;
    while ((im = imgInFigRegex.exec(inner)) !== null) {
      const tag = im[0];
      const src = getAttr(tag, 'data-orig-file') || getAttr(tag, 'data-large-file') || getAttr(tag, 'src');
      const alt = getAttr(tag, 'alt') || '';
      const w = parseInt(getAttr(tag, 'width') || '', 10) || null;
      const h = parseInt(getAttr(tag, 'height') || '', 10) || null;
      if (src) addImage(src, { alt, caption, credit, width: w, height: h });
    }
  }

  // All img tags
  const imgRegex = /<img\b[^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const tag = imgMatch[0];
    const orig = getAttr(tag, 'data-orig-file');
    const large = getAttr(tag, 'data-large-file');
    const src = getAttr(tag, 'src');
    const lazySrc = getAttr(tag, 'data-src') || getAttr(tag, 'data-lazy-src');
    const alt = getAttr(tag, 'alt') || '';
    const title = getAttr(tag, 'title') || '';
    const dataMeta = getAttr(tag, 'data-image-meta') || '';
    let credit = '';
    if (dataMeta) {
      try {
        const parsedMeta = JSON.parse(dataMeta);
        if (parsedMeta.credit) credit = parsedMeta.credit;
      } catch {
        // ignore
      }
    }
    const w = parseInt(getAttr(tag, 'width') || '', 10) || null;
    const h = parseInt(getAttr(tag, 'height') || '', 10) || null;
    const targetSrc = orig || large || lazySrc || src;
    if (targetSrc && !targetSrc.includes('gravatar.com') && !targetSrc.includes('pixel.wp.com')) {
      addImage(targetSrc, { alt: alt || title, credit, width: w, height: h });
    }
  }

  // CSS background-image URLs
  const bgRegex = /background(?:-image)?\s*:\s*[^;]*url\(['"]?([^'")]+)['"]?\)/gi;
  let bgMatch;
  while ((bgMatch = bgRegex.exec(html)) !== null) {
    const rawBg = bgMatch[1];
    if (rawBg && !rawBg.startsWith('data:')) {
      addImage(rawBg, { alt: 'Background image' });
    }
  }

  for (const ogImg of ogImages) {
    if (!ogImg.includes('s0.wp.com/i/blank.jpg')) {
      addImage(ogImg, { alt: sourceTitle });
    }
  }

  // Extract videos
  const videos = new Set();
  const videoRegex = /<(?:video|source|iframe)\b[^>]*>/gi;
  let vMatch;
  while ((vMatch = videoRegex.exec(html)) !== null) {
    const src = getAttr(vMatch[0], 'src') || getAttr(vMatch[0], 'data-src');
    if (
      src &&
      (src.includes('youtube.com') ||
        src.includes('youtu.be') ||
        src.includes('vimeo.com') ||
        src.includes('videopress.com') ||
        /\.(mp4|webm|ogg)(\?|$)/i.test(src))
    ) {
      videos.add(normalizeUrl(src, finalUrl) || src);
    }
  }

  // Extract links (internal, external, documents)
  const internalLinks = new Set();
  const externalLinks = new Set();
  const documents = new Set();

  const aRegex = /<a\b[^>]*>/gi;
  let aMatch;
  while ((aMatch = aRegex.exec(html)) !== null) {
    const rawHref = getAttr(aMatch[0], 'href');
    const norm = normalizeUrl(rawHref, finalUrl, config.excludedQueryParams);
    if (!norm) continue;

    let parsed;
    try {
      parsed = new URL(norm);
    } catch {
      continue;
    }

    if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|kml|gpx)(\?|$)/i.test(parsed.pathname)) {
      documents.add(norm);
    }

    if (
      parsed.hostname === 'transilvaniacavediving.com' ||
      parsed.hostname === 'www.transilvaniacavediving.com' ||
      parsed.hostname === 'transilvaniacavedivingcom.wordpress.com'
    ) {
      // Check if it's an image direct link in a gallery
      if (/\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/i.test(parsed.pathname)) {
        addImage(norm, {});
      } else {
        internalLinks.add(norm);
      }
    } else if (
      parsed.hostname === 'transilvaniacavedivingcom.files.wordpress.com' ||
      parsed.hostname.endsWith('.wp.com')
    ) {
      if (/\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/i.test(parsed.pathname)) {
        addImage(norm, {});
      } else if (/\.(pdf|doc|docx|zip)(\?|$)/i.test(parsed.pathname)) {
        documents.add(norm);
      } else {
        externalLinks.add(norm);
      }
    } else {
      externalLinks.add(norm);
    }
  }

  // Semantic entity extraction from bodyMarkdown
  const lines = bodyMarkdown.split('\n').map((l) => l.trim()).filter(Boolean);

  // Contact information
  const contactInformation = new Set();
  const phoneRegex = /(?:\+40|0040|07\d{2}|02\d{2}|03\d{2})[\s.\-]?\d{3}[\s.\-]?\d{3,4}/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  for (const line of lines) {
    const phones = line.match(phoneRegex);
    if (phones) phones.forEach((p) => contactInformation.add(`Telefon: ${p.trim()} (${line.slice(0, 140)})`));
    const emails = line.match(emailRegex);
    if (emails) emails.forEach((e) => contactInformation.add(`Email: ${e.trim()}`));
    if (/\b(?:contact|telefon|email|adres[aă]|rezerv[aă]ri|informații)\b/i.test(line) && /\d/.test(line)) {
      contactInformation.add(line.slice(0, 200));
    }
  }

  // Prices
  const prices = new Set();
  for (const line of lines) {
    if (/\b(?:\d+\s*(?:lei|ron|euro|eur|€)|tarif|pre[tț]|bilet|tax[aă]|cost|intrar(?:e|ii))\b/i.test(line)) {
      prices.add(line.slice(0, 250));
    }
  }

  // Schedules
  const schedules = new Set();
  for (const line of lines) {
    if (
      /\b(?:program|orar|luni|mar[tț]i|miercuri|joi|vineri|s[aâ]mb[aă]t[aă]|duminic[aă]|orele|\d{1,2}:\d{2})\b/i.test(
        line
      )
    ) {
      schedules.add(line.slice(0, 250));
    }
  }

  // Historical dates
  const historicalDates = new Set();
  for (const line of lines) {
    if (/\b(?:1[6789]\d{2}|20[012]\d)\b/.test(line)) {
      historicalDates.add(line.slice(0, 280));
    }
  }

  // Safety warnings & photo credits inside text
  const safetyWarnings = new Set();
  for (const line of lines) {
    if (
      /\b(?:echipament|aten[tț]ie|pericol|interzis|ghid|casc[aă]|neamenajat|speologic|risc|obligatoriu|siguran[tț][aă]|certificare|antrenament|dificultate|protec[tț]ie|avertisment)\b/i.test(
        line
      )
    ) {
      safetyWarnings.add(line.slice(0, 280));
    }
  }

  // Determine page_type
  const urlPath = new URL(finalUrl).pathname.toLowerCase();
  let pageType = 'page';
  if (urlPath === '/' || urlPath === '') {
    pageType = 'homepage';
  } else if (urlPath.startsWith('/blog') || urlPath.startsWith('/category/') || urlPath.startsWith('/tag/') || /^\/\d{4}\//.test(urlPath)) {
    pageType = /^\/\d{4}\/\d{2}\//.test(urlPath) ? 'article' : 'archive';
  } else if (
    urlPath.includes('grota-ursului') ||
    urlPath.includes('pestera') ||
    urlPath.includes('via-ferrata') ||
    urlPath.includes('isverna') ||
    urlPath.includes('belvedere') ||
    urlPath.includes('moneasa')
  ) {
    pageType = 'destination';
  } else if (urlPath.includes('magazin') || urlPath.includes('shop')) {
    pageType = 'shop';
  } else if (urlPath.includes('contact')) {
    pageType = 'contact';
  } else if (urlPath.includes('czaran')) {
    pageType = 'heritage';
  }

  return {
    source_url: sourceUrl,
    final_url: finalUrl,
    canonical_url: canonicalUrl || finalUrl,
    source_title: sourceTitle,
    meta_description: metaDescription,
    language,
    content_type: 'text/html',
    page_type: pageType,
    headings,
    sections,
    body_markdown: bodyMarkdown,
    images: Array.from(imagesMap.values()),
    videos: Array.from(videos),
    documents: Array.from(documents),
    internal_links: Array.from(internalLinks),
    external_links: Array.from(externalLinks),
    contact_information: Array.from(contactInformation),
    prices: Array.from(prices),
    schedules: Array.from(schedules),
    historical_dates: Array.from(historicalDates),
    safety_warnings: Array.from(safetyWarnings),
    structured_data: structuredData,
    publication_date: publicationDate,
    last_modified: lastModified,
    retrieved_at: retrievedAt,
    validation_status: 'extracted',
    migration_status: 'pending',
  };
}

