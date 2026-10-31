# Security Architecture & Hardening Guide

## 1. Threat Model & Defense-in-Depth

The reconstructed Transilvania Cave Diving application and its companion crawling engine follow OWASP ASVS and OWASP Top 10 security controls across both build-time data ingestion and runtime HTTP serving.

## 2. SSRF Protection in the Crawling Subsystem

The crawler (`crawler/src/security.mjs`) implements strict Server-Side Request Forgery (SSRF) defenses verified by automated unit tests (`crawler/tests/security.test.mjs`):

1. **Scheme Allowlisting**: Only `https:` and `http:` URLs are permitted. `file:`, `ftp:`, `gopher:`, `data:`, and `javascript:` schemes are rejected immediately.
2. **Hostname Allowlisting**: Requests are restricted to explicit allowlists in `crawler/config/crawler.config.json` (`transilvaniacavediving.com`, `public-api.wordpress.com`, `transilvaniacavedivingcom.files.wordpress.com`, `i0.wp.com`–`i2.wp.com`). Direct IP literals and embedded URL credentials (`user:pass@host`) are blocked.
3. **DNS Resolution & Private IP Blocking**: Before establishing connections, hostnames are resolved via `dns.lookup(..., { all: true })` and every resolved IPv4/IPv6 address is checked against `isPrivateOrReservedIp()`, blocking:
   - Loopback (`127.0.0.0/8`, `::1`, `::ffff:127.0.0.1`)
   - Private RFC 1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
   - Link-local & Cloud Metadata (`169.254.0.0/16`, `fe80::/10`)
   - Carrier-grade NAT (`100.64.0.0/10`) & Unique Local IPv6 (`fc00::/7`)
4. **Redirect Revalidation**: `fetch` is executed with `redirect: 'manual'`. Every `3xx` `Location` target is normalized and re-validated through `validateSafeUrl()` up to a maximum of 5 hops.
5. **Bounded Payloads & Timeouts**: Every request enforces an `AbortController` timeout (`20,000ms`) and stream reader byte-count cap (`10 MB` for HTML/JSON, `50 MB` for media) to prevent decompression bombs or memory exhaustion.
6. **Non-Execution of Assets**: Downloaded assets are written strictly as static buffers with sanitized filenames (`[^a-zA-Z0-9._-]`) and are never executed or dynamically imported. Furthermore, the crawler is a CLI-only build/migration tool and is **never** exposed as a public web API endpoint.

## 3. Web Application Security Headers (CSP & HSTS)

Configured in `next.config.mjs` and verified via automated Playwright security tests:

- `Content-Security-Policy`: Restricts `default-src 'self'`, `script-src 'self' 'unsafe-inline'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data: blob:`, `frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://videopress.com https://www.google.com`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`.
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options`: `nosniff`
- `X-Frame-Options`: `DENY`
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Permissions-Policy`: `camera=(), microphone=(), geolocation=(), payment=()`

## 4. API & Contact Endpoint Hardening (`/api/contact`)

- **Strict Server-Side Input Validation**: Validates field types, lengths, email format, and allowed inquiry categories; rejects HTML/script injection payloads and oversized bodies.
- **Anti-Abuse & Rate Limiting**:
  - IP-based sliding-window rate limiter (`10 requests / hour` default).
  - Honeypot field (`website_url`) and minimum form interaction timestamp check to block automated spam bots without degrading WCAG 2.2 AA accessibility.
  - Origin / Referer CSRF verification on `POST` requests.
- **Safe Logging & Error Handling**: Never leaks stack traces, environment variables, or PII in error responses.

## 5. Secrets & Dependency Hygiene

- No hardcoded credentials or default administrator accounts exist in the codebase.
- All configuration is injected via environment variables documented in `.env.example`.

