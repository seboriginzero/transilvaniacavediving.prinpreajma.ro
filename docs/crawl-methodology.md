# Crawl Methodology & Extraction Architecture

## 1. Overview

The Transilvania Cave Diving (`https://transilvaniacavediving.com`) crawling and extraction engine (`crawler/src/`) was architected to perform a complete, deterministic, resumable, and SSRF-safe inventory of all publicly accessible content and authorized media assets on the source website.

## 2. Multi-Layer Discovery Strategy

The crawler executes discovery across multiple complementary channels to ensure zero silent omissions:

1. **Robots & Sitemap Inspection**:
   - `/robots.txt` (identifying crawl policies, WordPress.com hosting headers, and canonical XML sitemaps).
   - `/sitemap.xml` and `/news-sitemap.xml` (plus fallback checks for `/wp-sitemap.xml`, `/sitemap_index.xml`, and `/feed/`).
2. **WordPress REST API & WordPress.com Public API**:
   - The HTTP `Link` header on `transilvaniacavediving.com` exposes the official WordPress.com REST API namespace (`transilvaniacavedivingcom.wordpress.com`).
   - The crawler queries `/wp/v2/sites/transilvaniacavedivingcom.wordpress.com/pages`, `/posts`, `/media`, `/categories`, `/tags`, and `/rest/v1.1/sites/transilvaniacavedivingcom.wordpress.com/posts?number=100&type=any` with automatic pagination (`x-wp-totalpages`).
3. **Seed Checklist & Recursive HTML Link Discovery**:
   - Seeds all known primary navigation paths (`/`, `/blog/`, `/grota-ursului/`, `/pestera-liliecilor/`, `/pestera-uscata-de-la-moara/`, `/via-ferrata-cetate-dezna/`, `/moneasa-adventure/`, `/visit-isverna/`, `/magazin/`, `/contact/`, `/statiunea-moneasa/`, `/czaran-gyula/`, `/belvedere-moneasa/`).
   - Extracts all internal `<a href>` links from navigation menus, submenus, article bodies, category archives, tags, and footers.

## 3. Crawl Scope & Rate Limiting

- **Primary Hostname**: `https://transilvaniacavediving.com` (normalizing `http://` and `www.` variants to canonical `https://transilvaniacavediving.com`).
- **Authorized Media Hostnames**: `transilvaniacavedivingcom.files.wordpress.com`, `i0.wp.com`, `i1.wp.com`, `i2.wp.com`, `s0.wp.com`.
- **Exclusions**:
  - WordPress admin/authentication paths (`/wp-admin/`, `/wp-login.php`, `/wp-signup.php`, `/xmlrpc.php`, `/remote-login.php`).
  - Dynamic share/comment query parameters (`?share=`, `?replytocom=`, `?like_comment=`, `?_wpnonce=`, `?s=`).
  - External third-party domains (recorded strictly as `external_links` references, never recursively crawled).
- **Politeness & Reliability**:
  - Concurrency bounded to `2` simultaneous requests.
  - Inter-batch delay of `1000ms` for HTML pages and `400ms` for static media assets.
  - Exponential backoff (`1s`, `2s`, `4s`) for transient network errors, honoring HTTP `429` / `503` and `Retry-After` headers.

## 4. Content & Metadata Extraction Pipeline

Each HTML page is archived verbatim in `source-data/raw/html/<slug>.html` and parsed by `crawler/src/extractor.mjs` into `source-data/normalized/pages/<slug>.json` with all mandatory fields:

- **URLs**: `source_url`, `final_url`, `canonical_url`.
- **Metadata**: `source_title`, `meta_description`, `language` (`ro`), `content_type`, `page_type`, `publication_date`, `last_modified`, `retrieved_at`.
- **Structure**: Ordered `headings` (`h1`–`h6`), semantic `sections`, and full `body_markdown` preserving tables, lists, blockquotes, links, and Romanian diacritics (`ă, â, î, ș, ț`).
- **Media**: Full-resolution `images` (stripping WordPress thumbnail resize query strings `?w=` to retrieve original archival resolution alongside alt text, `<figcaption>` captions, and EXIF/caption photographer credits), `videos`, and `documents`.
- **Domain Entities**: Extracted `contact_information`, `prices` (with historical context), `schedules`, `historical_dates`, `safety_warnings`, and `structured_data` (JSON-LD).

## 5. Resumability & Checkpointing

- Crawl state is persisted continuously to `source-data/manifests/crawl-state.json`.
- Downloaded media files are hashed with `SHA-256` (`source-data/manifests/media-manifest.json`), storing raw archival copies in `public/media/original/` and deduplicated thematic copies in `public/media/<category>/`.

