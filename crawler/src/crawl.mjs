import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeFetch } from './security.mjs';
import { extractPageRecord, normalizeUrl, sha256, stripTags } from './extractor.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function urlToSlug(urlStr) {
  try {
    const u = new URL(urlStr);
    let p = u.pathname.replace(/^\/+|\/+$/g, '');
    if (!p) p = 'home';
    p = p.replace(/[^a-zA-Z0-9-_]/g, '_');
    if (u.search) {
      const q = u.search.replace(/[^a-zA-Z0-9]/g, '_');
      p = `${p}_${q}`;
    }
    return p.slice(0, 140);
  } catch {
    return 'unknown_' + Date.now();
  }
}

function classifyMediaFolder(sourcePageUrl, mediaUrl, altText = '', caption = '') {
  const combined = `${sourcePageUrl || ''} ${mediaUrl || ''} ${altText || ''} ${caption || ''}`.toLowerCase();
  if (combined.includes('logo') || combined.includes('icon') || combined.includes('cropped-')) return 'logos';
  if (/\.(pdf|doc|docx|zip|kml|gpx)(\?|$)/i.test(mediaUrl)) return 'documents';
  if (combined.includes('grota-ursului') || combined.includes('grota_ursului') || combined.includes('ursului')) return 'grota-ursului';
  if (combined.includes('liliecilor')) return 'pestera-liliecilor';
  if (combined.includes('moara') || combined.includes('carstic')) return 'sistemul-carstic';
  if (combined.includes('ferrata') || combined.includes('dezna')) return 'via-ferrata';
  if (combined.includes('belvedere')) return 'belvedere';
  if (combined.includes('isverna')) return 'isverna';
  if (combined.includes('czaran') || combined.includes('istoric') || combined.includes('arhiva') || combined.includes('vechi')) return 'historical';
  if (combined.includes('magazin') || combined.includes('shop') || combined.includes('tricou') || combined.includes('cana') || combined.includes('produs')) return 'shop';
  if (combined.includes('diving') || combined.includes('scufund') || combined.includes('iantd') || combined.includes('sidemount') || combined.includes('cavern') || combined.includes('sura-mare')) return 'cave-diving';
  if (combined.includes('speo') || combined.includes('canyoning') || combined.includes('canion')) return 'speologie';
  if (combined.includes('moneasa')) return 'moneasa';
  return 'speologie';
}

async function fetchWithRetry(url, options, maxRetries = 3, baseDelayMs = 1000) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await safeFetch(url, options);
      if (res.status === 429 || res.status === 503) {
        const retryAfter = parseInt(res.headers['retry-after'] || '', 10);
        const waitMs = !Number.isNaN(retryAfter) ? retryAfter * 1000 : baseDelayMs * Math.pow(2, attempt + 1);
        console.warn(`[RateLimit/503] HTTP ${res.status} on ${url}, waiting ${waitMs}ms...`);
        await sleep(waitMs);
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const waitMs = baseDelayMs * Math.pow(2, attempt);
        console.warn(`[Retry ${attempt + 1}/${maxRetries}] ${url} failed: ${err.message}. Waiting ${waitMs}ms`);
        await sleep(waitMs);
      }
    }
  }
  throw lastError;
}

async function main() {
  const configPath = path.join(PROJECT_ROOT, 'crawler/config/crawler.config.json');
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  const dnsCache = new Map();

  const statePath = path.join(PROJECT_ROOT, 'source-data/manifests/crawl-state.json');
  let state = {
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    discoveredUrls: [],
    crawledUrls: {},
    failedUrls: {},
    excludedUrls: [],
    redirects: [],
    apiSummary: {},
  };

  try {
    const existing = JSON.parse(await fs.readFile(statePath, 'utf8'));
    state = { ...state, ...existing };
    console.log(`Resuming crawl state with ${Object.keys(state.crawledUrls).length} previously crawled URLs.`);
  } catch {
    console.log('Starting fresh crawl state.');
  }

  const queue = new Set(state.discoveredUrls);
  for (const seedPath of config.seedPaths) {
    const u = normalizeUrl(seedPath, config.primaryDomain, config.excludedQueryParams);
    if (u) queue.add(u);
  }

  const saveState = async () => {
    state.updatedAt = new Date().toISOString();
    state.discoveredUrls = Array.from(queue);
    await fs.writeFile(statePath, JSON.stringify(state, null, 2), 'utf8');
  };

  const isExcludedUrl = (urlStr) => {
    try {
      const u = new URL(urlStr);
      for (const prefix of config.excludedPrefixes) {
        if (u.pathname.startsWith(prefix)) return `Excluded prefix: ${prefix}`;
      }
      for (const param of config.excludedQueryParams) {
        if (u.searchParams.has(param.trim())) return `Excluded query param: ${param}`;
      }
      if (/\.(jpe?g|png|webp|avif|gif|svg|pdf|mp4|webm|zip|xml)(\?|$)/i.test(u.pathname)) {
        return 'Non-HTML asset path';
      }
      return null;
    } catch {
      return 'Invalid URL';
    }
  };

  // =========================================================================
  // PHASE 1: ROBOTS.TXT, SITEMAPS & WORDPRESS REST API DISCOVERY
  // =========================================================================
  console.log('=== PHASE 1: SOURCE DISCOVERY ===');

  const discoveryEndpoints = [
    { name: 'robots.txt', url: `${config.primaryDomain}/robots.txt`, type: 'text' },
    { name: 'sitemap.xml', url: `${config.primaryDomain}/sitemap.xml`, type: 'xml' },
    { name: 'news-sitemap.xml', url: `${config.primaryDomain}/news-sitemap.xml`, type: 'xml' },
    { name: 'wp-sitemap.xml', url: `${config.primaryDomain}/wp-sitemap.xml`, type: 'xml' },
    { name: 'sitemap_index.xml', url: `${config.primaryDomain}/sitemap_index.xml`, type: 'xml' },
    { name: 'feed', url: `${config.primaryDomain}/feed/`, type: 'xml' },
  ];

  for (const ep of discoveryEndpoints) {
    try {
      console.log(`Checking ${ep.url} ...`);
      const res = await fetchWithRetry(ep.url, {
        allowedHosts: [...config.allowedPageHosts, ...config.allowedApiHosts],
        maxBytes: config.maxHtmlBytes,
        timeoutMs: config.timeoutMs,
        dnsCache,
      });
      await sleep(config.delayMs);
      const text = res.buffer.toString('utf8');
      await fs.writeFile(
        path.join(PROJECT_ROOT, 'source-data/raw/sitemaps', ep.name.replace(/[^a-zA-Z0-9._-]/g, '_')),
        text,
        'utf8'
      );
      if (res.status === 200 && ep.type === 'xml') {
        const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
        let m;
        let count = 0;
        while ((m = locRegex.exec(text)) !== null) {
          const norm = normalizeUrl(m[1], config.primaryDomain, config.excludedQueryParams);
          if (norm) {
            // Check if it's a nested sitemap or image or page
            if (norm.endsWith('.xml')) {
              console.log(`  Found child sitemap: ${norm}`);
            } else if (!/\.(jpe?g|png|webp|gif|svg)(\?|$)/i.test(norm)) {
              queue.add(norm);
              count++;
            }
          }
        }
        // Also extract <link> in RSS feed
        const linkRegex = /<link>\s*(https?:\/\/[^<\s]+)\s*<\/link>/gi;
        while ((m = linkRegex.exec(text)) !== null) {
          const norm = normalizeUrl(m[1], config.primaryDomain, config.excludedQueryParams);
          if (norm && !/\.(jpe?g|png|webp|gif|svg|xml)(\?|$)/i.test(norm)) {
            queue.add(norm);
            count++;
          }
        }
        console.log(`  -> Status ${res.status}, extracted ${count} page URLs from ${ep.name}`);
      } else {
        console.log(`  -> Status ${res.status} for ${ep.name}`);
      }
    } catch (err) {
      console.warn(`  -> Failed ${ep.url}: ${err.message}`);
    }
  }

  // WordPress REST API Discovery (both direct and public-api.wordpress.com)
  const wpApiResources = ['pages', 'posts', 'media', 'categories', 'tags'];
  const wpApiData = {
    pages: [],
    posts: [],
    media: [],
    categories: [],
    tags: [],
    v1Posts: [],
  };

  for (const resource of wpApiResources) {
    const apiUrls = [
      `https://public-api.wordpress.com/wp/v2/sites/${config.wpComSiteSlug}/${resource}?per_page=100`,
      `${config.primaryDomain}/wp-json/wp/v2/${resource}?per_page=100`,
    ];

    let fetched = false;
    for (const apiUrl of apiUrls) {
      if (fetched) break;
      try {
        console.log(`Fetching WP REST API (${resource}): ${apiUrl}`);
        const res = await fetchWithRetry(apiUrl, {
          allowedHosts: config.allowedApiHosts,
          maxBytes: config.maxHtmlBytes,
          timeoutMs: config.timeoutMs,
          dnsCache,
        });
        await sleep(config.delayMs);
        if (res.status === 200) {
          const jsonText = res.buffer.toString('utf8');
          const parsed = JSON.parse(jsonText);
          if (Array.isArray(parsed)) {
            wpApiData[resource] = parsed;
            await fs.writeFile(
              path.join(PROJECT_ROOT, `source-data/raw/api/wp-v2-${resource}.json`),
              JSON.stringify(parsed, null, 2),
              'utf8'
            );
            console.log(`  -> Retrieved ${parsed.length} ${resource} items from WP REST API.`);
            fetched = true;

            // Check if there are additional pages (x-wp-totalpages)
            const totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
            for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
              const pagedUrl = `${apiUrl}&page=${pageNum}`;
              console.log(`  Fetching page ${pageNum}/${totalPages} of ${resource}...`);
              const pRes = await fetchWithRetry(pagedUrl, {
                allowedHosts: config.allowedApiHosts,
                maxBytes: config.maxHtmlBytes,
                timeoutMs: config.timeoutMs,
                dnsCache,
              });
              await sleep(config.delayMs);
              if (pRes.status === 200) {
                const moreItems = JSON.parse(pRes.buffer.toString('utf8'));
                if (Array.isArray(moreItems)) {
                  wpApiData[resource].push(...moreItems);
                }
              }
            }
            if (totalPages > 1) {
              await fs.writeFile(
                path.join(PROJECT_ROOT, `source-data/raw/api/wp-v2-${resource}.json`),
                JSON.stringify(wpApiData[resource], null, 2),
                'utf8'
              );
            }
          }
        }
      } catch (err) {
        console.warn(`  -> WP REST API attempt failed (${apiUrl}): ${err.message}`);
      }
    }
  }

  // Also fetch WP.com REST API v1.1 for rich post/page metadata & attachments
  try {
    const v1Url = `https://public-api.wordpress.com/rest/v1.1/sites/${config.wpComSiteSlug}/posts?number=100&type=any`;
    console.log(`Fetching WP.com v1.1 API: ${v1Url}`);
    const res = await fetchWithRetry(v1Url, {
      allowedHosts: config.allowedApiHosts,
      maxBytes: config.maxHtmlBytes,
      timeoutMs: config.timeoutMs,
      dnsCache,
    });
    await sleep(config.delayMs);
    if (res.status === 200) {
      const data = JSON.parse(res.buffer.toString('utf8'));
      if (data && Array.isArray(data.posts)) {
        wpApiData.v1Posts = data.posts;
        await fs.writeFile(
          path.join(PROJECT_ROOT, 'source-data/raw/api/wp-v1.1-posts-any.json'),
          JSON.stringify(data, null, 2),
          'utf8'
        );
        console.log(`  -> Retrieved ${data.posts.length} total items (found=${data.found}) from WP.com v1.1 API.`);
      }
    }
  } catch (err) {
    console.warn(`  -> WP.com v1.1 API failed: ${err.message}`);
  }

  // Add all discovered WP pages/posts/categories/tags URLs to crawl queue
  for (const item of [...wpApiData.pages, ...wpApiData.posts, ...wpApiData.categories, ...wpApiData.tags]) {
    if (item.link) {
      const norm = normalizeUrl(item.link, config.primaryDomain, config.excludedQueryParams);
      if (norm) queue.add(norm);
    }
  }
  for (const item of wpApiData.v1Posts) {
    if (item.URL) {
      const norm = normalizeUrl(item.URL, config.primaryDomain, config.excludedQueryParams);
      if (norm) queue.add(norm);
    }
  }

  state.apiSummary = {
    pagesCount: wpApiData.pages.length,
    postsCount: wpApiData.posts.length,
    mediaCount: wpApiData.media.length,
    categoriesCount: wpApiData.categories.length,
    tagsCount: wpApiData.tags.length,
    v1PostsCount: wpApiData.v1Posts.length,
  };
  await saveState();

  // Build lookup map of WP REST API items by normalized URL path for enriching crawled HTML pages
  const apiRecordByPath = new Map();
  for (const p of [...wpApiData.pages, ...wpApiData.posts]) {
    if (p.link) {
      try {
        const u = new URL(p.link);
        apiRecordByPath.set(u.pathname.replace(/\/+$/, '') || '/', p);
      } catch {
        // ignore
      }
    }
  }
  const v1RecordByPath = new Map();
  for (const p of wpApiData.v1Posts) {
    if (p.URL) {
      try {
        const u = new URL(p.URL);
        v1RecordByPath.set(u.pathname.replace(/\/+$/, '') || '/', p);
      } catch {
        // ignore
      }
    }
  }

  // =========================================================================
  // PHASE 2: COMPREHENSIVE HTML WEBSITE CRAWLING
  // =========================================================================
  console.log('\n=== PHASE 2: COMPREHENSIVE WEBSITE CRAWLING ===');

  const allNormalizedPages = [];
  const processedSet = new Set();

  while (true) {
    const pendingUrls = Array.from(queue).filter((u) => !processedSet.has(u));
    if (pendingUrls.length === 0) break;

    // Process in batches of config.concurrency (2)
    const batch = pendingUrls.slice(0, config.concurrency);
    await Promise.all(
      batch.map(async (targetUrl) => {
        processedSet.add(targetUrl);

        const exclusionReason = isExcludedUrl(targetUrl);
        if (exclusionReason) {
          state.excludedUrls.push({ url: targetUrl, reason: exclusionReason });
          return;
        }

        // Only crawl allowed page hosts
        try {
          const parsedHost = new URL(targetUrl).hostname.toLowerCase();
          if (!config.allowedPageHosts.includes(parsedHost)) {
            state.excludedUrls.push({ url: targetUrl, reason: `External host: ${parsedHost}` });
            return;
          }
        } catch {
          return;
        }

        console.log(`[Crawl] Fetching ${targetUrl}`);
        try {
          const res = await fetchWithRetry(
            targetUrl,
            {
              allowedHosts: config.allowedPageHosts,
              maxBytes: config.maxHtmlBytes,
              timeoutMs: config.timeoutMs,
              dnsCache,
            },
            config.maxRetries,
            config.delayMs
          );

          if (res.redirectChain && res.redirectChain.length > 0) {
            state.redirects.push(...res.redirectChain);
          }

          if (res.status >= 400) {
            console.warn(`  -> HTTP ${res.status} for ${targetUrl}`);
            state.failedUrls[targetUrl] = {
              status: res.status,
              error: `HTTP status ${res.status}`,
              timestamp: new Date().toISOString(),
            };
            return;
          }

          if (!res.contentType.includes('text/html') && !res.contentType.includes('application/xhtml+xml')) {
            state.excludedUrls.push({ url: targetUrl, reason: `Non-HTML content-type: ${res.contentType}` });
            return;
          }

          const html = res.buffer.toString('utf8');
          const slug = urlToSlug(res.finalUrl || targetUrl);

          // Save raw HTML
          const rawHtmlPath = path.join(PROJECT_ROOT, 'source-data/raw/html', `${slug}.html`);
          await fs.writeFile(rawHtmlPath, html, 'utf8');

          // Extract normalized record
          const record = extractPageRecord(html, targetUrl, res.finalUrl || targetUrl, config);

          // Enrich with WP REST API data if matched
          const normPath = new URL(record.final_url).pathname.replace(/\/+$/, '') || '/';
          const wpItem = apiRecordByPath.get(normPath);
          const v1Item = v1RecordByPath.get(normPath);

          if (wpItem) {
            record.wp_id = wpItem.id;
            record.wp_type = wpItem.type;
            record.wp_slug = wpItem.slug;
            if (wpItem.date_gmt && !record.publication_date) record.publication_date = wpItem.date_gmt;
            if (wpItem.modified_gmt && !record.last_modified) record.last_modified = wpItem.modified_gmt;
            if (wpItem.title?.rendered) {
              record.wp_title = stripTags(wpItem.title.rendered);
            }
          }
          if (v1Item) {
            record.wp_id = record.wp_id || v1Item.ID;
            record.wp_type = record.wp_type || v1Item.type;
            record.wp_slug = record.wp_slug || v1Item.slug;
            if (v1Item.date && !record.publication_date) record.publication_date = v1Item.date;
            if (v1Item.modified && !record.last_modified) record.last_modified = v1Item.modified;
            if (v1Item.featured_image) {
              const featNorm = normalizeUrl(v1Item.featured_image, record.final_url);
              if (featNorm && !record.images.some((i) => i.url === featNorm)) {
                record.images.unshift({
                  url: featNorm,
                  raw_url: featNorm,
                  alt: record.source_title,
                  caption: 'Featured image',
                  credit: '',
                  width: null,
                  height: null,
                });
              }
            }
            if (v1Item.attachments) {
              for (const att of Object.values(v1Item.attachments)) {
                if (att.URL) {
                  const attNorm = normalizeUrl(att.URL, record.final_url);
                  if (attNorm && !record.images.some((i) => i.url === attNorm)) {
                    record.images.push({
                      url: attNorm,
                      raw_url: attNorm,
                      alt: att.alt || att.title || '',
                      caption: att.caption || att.description || '',
                      credit: att.exif?.credit || att.exif?.copyright || '',
                      width: att.width || null,
                      height: att.height || null,
                    });
                  }
                }
              }
            }
          }

          record.content_sha256 = sha256(record.body_markdown);

          // Save normalized page record
          const normPagePath = path.join(PROJECT_ROOT, 'source-data/normalized/pages', `${slug}.json`);
          await fs.writeFile(normPagePath, JSON.stringify(record, null, 2), 'utf8');
          allNormalizedPages.push(record);

          state.crawledUrls[targetUrl] = {
            finalUrl: record.final_url,
            slug,
            status: res.status,
            title: record.source_title,
            pageType: record.page_type,
            imagesCount: record.images.length,
            sectionsCount: record.sections.length,
            crawledAt: record.retrieved_at,
          };

          // Discover internal links and add to queue
          for (const link of record.internal_links) {
            const normLink = normalizeUrl(link, config.primaryDomain, config.excludedQueryParams);
            if (normLink && !processedSet.has(normLink) && !isExcludedUrl(normLink)) {
              queue.add(normLink);
            }
          }
        } catch (err) {
          console.error(`  -> Error crawling ${targetUrl}: ${err.message}`);
          state.failedUrls[targetUrl] = {
            status: null,
            error: err.message,
            timestamp: new Date().toISOString(),
          };
        }
      })
    );

    await saveState();
    await sleep(config.delayMs);
  }

  console.log(`\nCrawled ${allNormalizedPages.length} HTML pages successfully.`);

  // Write pages manifest
  await fs.writeFile(
    path.join(PROJECT_ROOT, 'source-data/manifests/pages-manifest.json'),
    JSON.stringify(allNormalizedPages, null, 2),
    'utf8'
  );

  // =========================================================================
  // PHASE 4: MEDIA ASSET INVENTORY AND AUTHORIZED DOWNLOADS
  // =========================================================================
  console.log('\n=== PHASE 4: MEDIA ASSET INVENTORY & DOWNLOADS ===');

  const mediaCandidates = new Map();

  // 1. Add media from WP REST API media endpoint
  for (const m of wpApiData.media) {
    const sourceUrl = m.source_url || m.guid?.rendered;
    if (!sourceUrl) continue;
    let cleanUrl = sourceUrl;
    try {
      const u = new URL(sourceUrl);
      u.search = '';
      cleanUrl = u.toString();
    } catch {
      // keep
    }
    mediaCandidates.set(cleanUrl, {
      source_url: cleanUrl,
      alt_text: stripTags(m.alt_text || m.title?.rendered || ''),
      caption: stripTags(m.caption?.rendered || m.description?.rendered || ''),
      photographer_credit: m.media_details?.image_meta?.credit || m.media_details?.image_meta?.copyright || '',
      width: m.media_details?.width || null,
      height: m.media_details?.height || null,
      mime_type: m.mime_type || '',
      source_page: m.post ? `wp_post_${m.post}` : config.primaryDomain,
      wp_media_id: m.id,
    });
  }

  // 2. Add media from all crawled pages
  for (const page of allNormalizedPages) {
    for (const img of page.images) {
      if (!img.url) continue;
      // Skip external tracking pixels or gravatars
      if (img.url.includes('gravatar.com') || img.url.includes('pixel.wp.com') || img.url.includes('s0.wp.com/i/')) {
        continue;
      }
      const existing = mediaCandidates.get(img.url);
      if (existing) {
        if (!existing.alt_text && img.alt) existing.alt_text = img.alt;
        if (!existing.caption && img.caption) existing.caption = img.caption;
        if (!existing.photographer_credit && img.credit) existing.photographer_credit = img.credit;
        if (existing.source_page === config.primaryDomain || existing.source_page.startsWith('wp_post_')) {
          existing.source_page = page.final_url;
        }
      } else {
        mediaCandidates.set(img.url, {
          source_url: img.url,
          alt_text: img.alt || '',
          caption: img.caption || '',
          photographer_credit: img.credit || '',
          width: img.width || null,
          height: img.height || null,
          mime_type: '',
          source_page: page.final_url,
          wp_media_id: null,
        });
      }
    }
    for (const docUrl of page.documents) {
      if (!mediaCandidates.has(docUrl)) {
        mediaCandidates.set(docUrl, {
          source_url: docUrl,
          alt_text: 'Document',
          caption: '',
          photographer_credit: '',
          width: null,
          height: null,
          mime_type: 'application/pdf',
          source_page: page.final_url,
          wp_media_id: null,
        });
      }
    }
  }

  console.log(`Discovered ${mediaCandidates.size} unique media assets to inventory and download.`);

  const mediaManifest = [];
  const shaToLocalPath = new Map();
  const candidateList = Array.from(mediaCandidates.values());

  for (let i = 0; i < candidateList.length; i += config.concurrency) {
    const batch = candidateList.slice(i, i + config.concurrency);
    await Promise.all(
      batch.map(async (item) => {
        let parsedUrl;
        try {
          parsedUrl = new URL(item.source_url);
        } catch {
          mediaManifest.push({
            ...item,
            local_path: '',
            original_filename: '',
            sha256: '',
            file_size: null,
            rights_status: 'invalid_url',
            download_status: 'failed',
          });
          return;
        }

        const originalFilename = decodeURIComponent(path.basename(parsedUrl.pathname)) || `asset_${Date.now()}.jpg`;
        const safeFilename = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');

        // Check if host is authorized (site's own WordPress media / domain)
        const host = parsedUrl.hostname.toLowerCase();
        const isAuthorizedHost = config.allowedMediaHosts.includes(host);

        if (!isAuthorizedHost) {
          mediaManifest.push({
            source_url: item.source_url,
            local_path: '',
            original_filename: safeFilename,
            sha256: '',
            mime_type: item.mime_type || 'unknown',
            width: item.width,
            height: item.height,
            file_size: null,
            alt_text: item.alt_text,
            caption: item.caption,
            photographer_credit: item.photographer_credit,
            source_page: item.source_page,
            rights_status: 'external_requires_permission',
            download_status: 'skipped_external',
          });
          return;
        }

        try {
          console.log(`[Media] Downloading ${item.source_url}`);
          const res = await fetchWithRetry(
            item.source_url,
            {
              allowedHosts: config.allowedMediaHosts,
              maxBytes: config.maxMediaBytes,
              timeoutMs: config.timeoutMs,
              dnsCache,
            },
            config.maxRetries,
            500
          );

          if (res.status >= 400) {
            mediaManifest.push({
              source_url: item.source_url,
              local_path: '',
              original_filename: safeFilename,
              sha256: '',
              mime_type: res.contentType || item.mime_type,
              width: item.width,
              height: item.height,
              file_size: null,
              alt_text: item.alt_text,
              caption: item.caption,
              photographer_credit: item.photographer_credit,
              source_page: item.source_page,
              rights_status: 'source_unavailable',
              download_status: `failed_http_${res.status}`,
            });
            return;
          }

          const hash = sha256(res.buffer);
          const categoryFolder = classifyMediaFolder(
            item.source_page,
            item.source_url,
            item.alt_text,
            item.caption
          );

          // Save original archival copy in public/media/original/
          const origRelPath = `/media/original/${safeFilename}`;
          const origAbsPath = path.join(PROJECT_ROOT, 'public', origRelPath);
          await fs.writeFile(origAbsPath, res.buffer);

          // Save categorized copy in public/media/<category>/ (deduplicated by SHA-256)
          let localRelPath = shaToLocalPath.get(hash);
          if (!localRelPath) {
            localRelPath = `/media/${categoryFolder}/${safeFilename}`;
            const catAbsPath = path.join(PROJECT_ROOT, 'public', localRelPath);
            await fs.writeFile(catAbsPath, res.buffer);
            shaToLocalPath.set(hash, localRelPath);
          }

          const rightsStatus = item.photographer_credit
            ? `authorized_first_party_with_credit (${item.photographer_credit})`
            : 'authorized_first_party_source_media';

          const assetRecord = {
            source_url: item.source_url,
            local_path: localRelPath,
            original_archive_path: origRelPath,
            original_filename: safeFilename,
            sha256: hash,
            mime_type: (res.contentType || item.mime_type || 'image/jpeg').split(';')[0].trim(),
            width: item.width,
            height: item.height,
            file_size: res.buffer.byteLength,
            alt_text: item.alt_text,
            caption: item.caption,
            photographer_credit: item.photographer_credit,
            source_page: item.source_page,
            category: categoryFolder,
            rights_status: rightsStatus,
            download_status: 'downloaded',
          };

          mediaManifest.push(assetRecord);
          await fs.writeFile(
            path.join(PROJECT_ROOT, 'source-data/normalized/media', `${safeFilename}.json`),
            JSON.stringify(assetRecord, null, 2),
            'utf8'
          );
        } catch (err) {
          console.error(`  -> Failed media download ${item.source_url}: ${err.message}`);
          mediaManifest.push({
            source_url: item.source_url,
            local_path: '',
            original_filename: safeFilename,
            sha256: '',
            mime_type: item.mime_type || 'unknown',
            width: item.width,
            height: item.height,
            file_size: null,
            alt_text: item.alt_text,
            caption: item.caption,
            photographer_credit: item.photographer_credit,
            source_page: item.source_page,
            rights_status: 'unknown',
            download_status: `error: ${err.message}`,
          });
        }
      })
    );
    await sleep(400);
  }

  await fs.writeFile(
    path.join(PROJECT_ROOT, 'source-data/manifests/media-manifest.json'),
    JSON.stringify(mediaManifest, null, 2),
    'utf8'
  );

  console.log('\n=== CRAWL & MEDIA DOWNLOAD COMPLETE ===');
  console.log(`Total Pages Extracted: ${allNormalizedPages.length}`);
  console.log(`Total Media Inventoried: ${mediaManifest.length}`);
  console.log(
    `Total Media Downloaded: ${mediaManifest.filter((m) => m.download_status === 'downloaded').length}`
  );
}

main().catch((err) => {
  console.error('Fatal crawler error:', err);
  process.exit(1);
});

