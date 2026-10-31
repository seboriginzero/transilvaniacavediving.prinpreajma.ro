import test from 'node:test';
import assert from 'node:assert/strict';
import { isPrivateOrReservedIp, validateSafeUrl } from '../src/security.mjs';
import { normalizeUrl, extractPageRecord } from '../src/extractor.mjs';

test('SSRF Protection - blocks private, loopback, link-local, and reserved IPs', () => {
  assert.equal(isPrivateOrReservedIp('127.0.0.1'), true);
  assert.equal(isPrivateOrReservedIp('10.0.0.1'), true);
  assert.equal(isPrivateOrReservedIp('172.16.0.5'), true);
  assert.equal(isPrivateOrReservedIp('172.31.255.255'), true);
  assert.equal(isPrivateOrReservedIp('192.168.1.1'), true);
  assert.equal(isPrivateOrReservedIp('169.254.169.254'), true);
  assert.equal(isPrivateOrReservedIp('0.0.0.0'), true);
  assert.equal(isPrivateOrReservedIp('::1'), true);
  assert.equal(isPrivateOrReservedIp('fe80::1'), true);
  assert.equal(isPrivateOrReservedIp('fc00::1'), true);
  assert.equal(isPrivateOrReservedIp('::ffff:127.0.0.1'), true);
  // Public IPs should pass
  assert.equal(isPrivateOrReservedIp('192.0.78.24'), false);
  assert.equal(isPrivateOrReservedIp('8.8.8.8'), false);
});

test('SSRF Protection - rejects non-HTTP schemes, IP literals, and unapproved hosts', async () => {
  const allowed = ['transilvaniacavediving.com'];
  const fakeDns = new Map([['transilvaniacavediving.com', ['192.0.78.24']]]);

  const ftpRes = await validateSafeUrl('ftp://transilvaniacavediving.com/file', allowed, fakeDns);
  assert.equal(ftpRes.valid, false);

  const fileRes = await validateSafeUrl('file:///etc/passwd', allowed, fakeDns);
  assert.equal(fileRes.valid, false);

  const ipRes = await validateSafeUrl('http://127.0.0.1/admin', allowed, fakeDns);
  assert.equal(ipRes.valid, false);

  const evilHostRes = await validateSafeUrl('https://evil.example.com/', allowed, fakeDns);
  assert.equal(evilHostRes.valid, false);

  const validRes = await validateSafeUrl('https://transilvaniacavediving.com/grota-ursului/', allowed, fakeDns);
  assert.equal(validRes.valid, true);
});

test('URL normalization canonicalizes domain and strips excluded params', () => {
  const norm = normalizeUrl(
    'http://www.transilvaniacavediving.com/grota-ursului/?replytocom=12&share=facebook#section',
    'https://transilvaniacavediving.com',
    ['replytocom', 'share']
  );
  assert.equal(norm, 'https://transilvaniacavediving.com/grota-ursului/');
});

test('HTML Extractor preserves Romanian diacritics, headings, prices, and safety warnings', () => {
  const sampleHtml = `
    <!DOCTYPE html>
    <html lang="ro-RO">
    <head>
      <title>Grota Ursului – Moneasa | Transilvania Cave Diving</title>
      <meta name="description" content="Explorare speologică în Grota Ursului din Moneasa.">
      <link rel="canonical" href="https://transilvaniacavediving.com/grota-ursului/">
    </head>
    <body>
      <article class="entry-content">
        <h1>Grota Ursului – Moneasa</h1>
        <p>Descoperită în anul 1986, peștera oferă formațiuni carstice spectaculoase.</p>
        <h2>Informații de vizitare și siguranță</h2>
        <p>Atenție: Echipamentul speologic și casca de protecție sunt obligatorii.</p>
        <p>Tarif istoric: 50 lei / persoană. Telefon: 0744 123 456.</p>
      </article>
    </body>
    </html>
  `;
  const rec = extractPageRecord(
    sampleHtml,
    'https://transilvaniacavediving.com/grota-ursului/',
    'https://transilvaniacavediving.com/grota-ursului/',
    { excludedQueryParams: [] }
  );
  assert.equal(rec.language, 'ro');
  assert.equal(rec.headings.length, 2);
  assert.ok(rec.body_markdown.includes('Descoperită în anul 1986'));
  assert.ok(rec.prices.length >= 1);
  assert.ok(rec.safety_warnings.length >= 1);
  assert.ok(rec.contact_information.length >= 1);
  assert.ok(rec.historical_dates.length >= 1);
});

