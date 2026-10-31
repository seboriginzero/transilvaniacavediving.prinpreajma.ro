import dns from 'node:dns/promises';
import net from 'node:net';

/**
 * Checks whether an IPv4 or IPv6 address is private, loopback, link-local,
 * multicast, or otherwise reserved (SSRF protection).
 */
export function isPrivateOrReservedIp(ip) {
  if (!ip || typeof ip !== 'string') return true;
  const normalized = ip.trim().toLowerCase();

  if (net.isIPv4(normalized)) {
    const parts = normalized.split('.').map(Number);
    const [a, b, c] = parts;
    // 0.0.0.0/8
    if (a === 0) return true;
    // 10.0.0.0/8
    if (a === 10) return true;
    // 100.64.0.0/10 (Carrier-grade NAT)
    if (a === 100 && b >= 64 && b <= 127) return true;
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;
    // 169.254.0.0/16 (Link-local / Cloud metadata)
    if (a === 169 && b === 254) return true;
    // 172.16.0.0/12
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.0.0.0/24
    if (a === 192 && b === 0 && c === 0) return true;
    // 192.0.2.0/24 (TEST-NET-1)
    if (a === 192 && b === 0 && c === 2) return true;
    // 192.168.0.0/16
    if (a === 192 && b === 168) return true;
    // 198.18.0.0/15 (Benchmark)
    if (a === 198 && (b === 18 || b === 19)) return true;
    // 198.51.100.0/24 (TEST-NET-2)
    if (a === 198 && b === 51 && c === 100) return true;
    // 203.0.113.0/24 (TEST-NET-3)
    if (a === 203 && b === 0 && c === 113) return true;
    // 224.0.0.0/4 (Multicast & Reserved)
    if (a >= 224) return true;
    return false;
  }

  if (net.isIPv6(normalized)) {
    if (normalized === '::' || normalized === '::1') return true;
    // IPv4-mapped IPv6 ::ffff:a.b.c.d
    if (normalized.startsWith('::ffff:')) {
      const v4 = normalized.slice(7);
      if (net.isIPv4(v4)) return isPrivateOrReservedIp(v4);
    }
    // Unique local fc00::/7 (fc00..fdff)
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
    // Link-local fe80::/10
    if (
      normalized.startsWith('fe8') ||
      normalized.startsWith('fe9') ||
      normalized.startsWith('fea') ||
      normalized.startsWith('feb')
    ) {
      return true;
    }
    // Multicast ff00::/8
    if (normalized.startsWith('ff')) return true;
    // Documentation 2001:db8::/32
    if (normalized.startsWith('2001:db8:') || normalized.startsWith('2001:0db8:')) return true;
    return false;
  }

  return true;
}

/**
 * Validates a URL string against scheme restrictions, allowed hostnames,
 * and DNS resolution to prevent SSRF attacks.
 */
export async function validateSafeUrl(rawUrl, allowedHosts, dnsCache = new Map()) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { valid: false, reason: 'Invalid URL syntax' };
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { valid: false, reason: `Unsupported URL scheme: ${parsed.protocol}` };
  }

  if (parsed.username || parsed.password) {
    return { valid: false, reason: 'Credentials in URL are prohibited' };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (net.isIP(hostname)) {
    return { valid: false, reason: 'Direct IP literal URLs are prohibited' };
  }

  const isAllowedHost = allowedHosts.some((allowed) => {
    const clean = allowed.toLowerCase();
    return hostname === clean || (clean.startsWith('*.') && hostname.endsWith(clean.slice(1)));
  });

  if (!isAllowedHost) {
    return { valid: false, reason: `Hostname not allowlisted: ${hostname}` };
  }

  // DNS resolution check for private/internal IPs
  try {
    let addresses = dnsCache.get(hostname);
    if (!addresses) {
      const records = await dns.lookup(hostname, { all: true });
      addresses = records.map((r) => r.address);
      dnsCache.set(hostname, addresses);
    }
    if (!addresses || addresses.length === 0) {
      return { valid: false, reason: `DNS resolution returned no addresses for ${hostname}` };
    }
    for (const addr of addresses) {
      if (isPrivateOrReservedIp(addr)) {
        return { valid: false, reason: `Hostname ${hostname} resolved to restricted IP ${addr}` };
      }
    }
  } catch (err) {
    return { valid: false, reason: `DNS lookup failed for ${hostname}: ${err.message}` };
  }

  return { valid: true, url: parsed.toString(), parsed };
}

/**
 * Safe HTTP fetch with redirect revalidation, timeout, and max byte enforcement.
 */
export async function safeFetch(rawUrl, options = {}) {
  const {
    allowedHosts = [],
    maxBytes = 10 * 1024 * 1024,
    timeoutMs = 20000,
    maxRedirects = 5,
    dnsCache = new Map(),
    headers = {},
  } = options;

  let currentUrl = rawUrl;
  const redirectChain = [];

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount++) {
    const validation = await validateSafeUrl(currentUrl, allowedHosts, dnsCache);
    if (!validation.valid) {
      throw new Error(`SSRF Validation blocked URL (${currentUrl}): ${validation.reason}`);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response;
    try {
      response = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'User-Agent': 'TransilvaniaCaveDivingMigrationBot/1.0 (+https://transilvaniacavediving.com)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
          'Accept-Language': 'ro-RO,ro;q=0.9,en-US;q=0.8,en;q=0.7',
          ...headers,
        },
      });
    } finally {
      clearTimeout(timer);
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) {
        throw new Error(`Redirect status ${response.status} without Location header at ${currentUrl}`);
      }
      const nextUrl = new URL(location, currentUrl).toString();
      redirectChain.push({ from: currentUrl, to: nextUrl, status: response.status });
      currentUrl = nextUrl;
      continue;
    }

    const contentLengthHeader = response.headers.get('content-length');
    if (contentLengthHeader && Number(contentLengthHeader) > maxBytes) {
      throw new Error(`Content-Length (${contentLengthHeader}) exceeds limit (${maxBytes}) for ${currentUrl}`);
    }

    // Stream body with byte limit enforcement
    const reader = response.body ? response.body.getReader() : null;
    const chunks = [];
    let receivedBytes = 0;

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedBytes += value.byteLength;
        if (receivedBytes > maxBytes) {
          await reader.cancel();
          throw new Error(`Response body exceeded maximum allowed bytes (${maxBytes}) at ${currentUrl}`);
        }
        chunks.push(value);
      }
    }

    const buffer = Buffer.concat(chunks);
    return {
      sourceUrl: rawUrl,
      finalUrl: currentUrl,
      redirectChain,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      contentType: response.headers.get('content-type') || '',
      buffer,
    };
  }

  throw new Error(`Too many redirects (>${maxRedirects}) starting from ${rawUrl}`);
}

