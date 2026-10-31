import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

async function main() {
  console.log('=== RUNNING AUTOMATED CONTENT COMPLETENESS VERIFICATION ===');

  const dbPath = path.join(PROJECT_ROOT, 'src/content/site-database.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));

  // 1. Verify all 17 primary pages exist
  const requiredPagePaths = [
    '/',
    '/blog',
    '/grota-ursului',
    '/pestera-liliecilor',
    '/bat-cave',
    '/denever-barlang',
    '/pestera-uscata-de-la-moara',
    '/the-mill-karst-system',
    '/a-malom-karsztrendszere',
    '/via-ferrata-cetate-dezna',
    '/belvedere-moneasa',
    '/moneasa-adventure',
    '/statiunea-moneasa',
    '/czaran-gyula',
    '/visit-isverna',
    '/magazin',
    '/contact',
  ];

  for (const reqPath of requiredPagePaths) {
    const found = db.pages.find((p) => p.path === reqPath);
    assert.ok(found, `Missing required primary page in site-database.json: ${reqPath}`);
    assert.ok(found.bodyMarkdown.length > 20 || found.images.length > 0, `Page ${reqPath} has empty content`);
  }
  console.log(`  [PASS] All ${requiredPagePaths.length} primary pages verified.`);

  // 2. Verify all 36 blog/archive articles exist
  assert.equal(db.posts.length, 36, `Expected 36 historical blog posts, found ${db.posts.length}`);
  for (const post of db.posts) {
    assert.ok(post.path.startsWith('/20'), `Invalid chronological post path: ${post.path}`);
    assert.ok(post.slug, `Missing slug for post: ${post.path}`);
    assert.ok(post.cleanTitle, `Missing title for post: ${post.path}`);
  }
  console.log(`  [PASS] All ${db.posts.length} historical & editorial articles verified.`);

  // 3. Verify zero hotlinked external images in compiled database
  for (const item of [...db.pages, ...db.posts]) {
    for (const img of item.images) {
      assert.ok(
        img.localPath.startsWith('/media/'),
        `External hotlinked image found in ${item.path}: ${img.localPath}`
      );
      const diskPath = path.join(PROJECT_ROOT, 'public', img.localPath);
      const stat = await fs.stat(diskPath);
      assert.ok(stat.size > 0, `Empty media file on disk: ${diskPath}`);
    }
  }
  console.log('  [PASS] 100% of page and article images resolve to non-empty local files in public/media/.');

  // 4. Verify critical factual, scientific, historical, and legal details are preserved
  const grota = db.pages.find((p) => p.path === '/grota-ursului');
  assert.ok(grota.bodyMarkdown.includes('11:00-16:00'), 'Grota Ursului schedule missing');
  assert.ok(grota.bodyMarkdown.includes('20 lei'), 'Grota Ursului adult price missing');
  assert.ok(grota.bodyMarkdown.includes('10 lei'), 'Grota Ursului child price missing');
  assert.ok(grota.bodyMarkdown.includes('Ursus spelaeus'), 'Grota Ursului Ursus spelaeus reference missing');
  assert.ok(grota.bodyMarkdown.includes('aragonit'), 'Grota Ursului aragonite reference missing');

  const liliecilor = db.pages.find((p) => p.path === '/pestera-liliecilor');
  assert.ok(liliecilor.bodyMarkdown.includes('11487.01'), 'Peștera Liliecilor RAN code 11487.01 missing');
  assert.ok(liliecilor.bodyMarkdown.includes('Rhinolophus ferrumequinum'), 'Bat species scientific name missing');

  const moara = db.pages.find((p) => p.path === '/pestera-uscata-de-la-moara');
  assert.ok(moara.bodyMarkdown.includes('ROSCI0042'), 'Natura 2000 ROSCI0042 code missing');
  assert.ok(moara.bodyMarkdown.includes('Comisia Patrimoniului Speologic'), 'Comisia Patrimoniului Speologic permit warning missing');
  assert.ok(moara.safetyWarnings.some((w) => w.includes('Clasa A')), 'Class A protection warning missing');

  const dezna = db.pages.find((p) => p.path === '/via-ferrata-cetate-dezna');
  assert.ok(dezna.bodyMarkdown.includes('600m') || dezna.bodyMarkdown.includes('600 m'), 'Via Ferrata length missing');
  assert.ok(dezna.bodyMarkdown.includes('SALVAMONT'), 'Salvamont emergency warning missing');

  const isverna = db.pages.find((p) => p.path === '/visit-isverna');
  assert.ok(isverna.bodyMarkdown.includes('Black Sump'), 'Isverna Black Sump specification missing');
  assert.ok(isverna.bodyMarkdown.includes('Cristi Mitrofan'), 'Isverna photo credit Cristi Mitrofan missing');

  const moneasa = db.pages.find((p) => p.path === '/statiunea-moneasa');
  assert.ok(moneasa.bodyMarkdown.includes('1597'), 'Moneasa 1597 historical date missing');
  assert.ok(moneasa.bodyMarkdown.includes('Wenckheim'), 'Moneasa Wenckheim historical narrative missing');

  const czaran = db.pages.find((p) => p.path === '/czaran-gyula');
  assert.ok(czaran.bodyMarkdown.includes('1847'), 'Czárán Gyula birth year 1847 missing');
  assert.ok(czaran.bodyMarkdown.includes('1906'), 'Czárán Gyula death year 1906 missing');

  const contact = db.pages.find((p) => p.path === '/contact');
  assert.ok(contact.bodyMarkdown.includes('39749631'), 'Company CIF 39749631 missing');
  assert.ok(contact.bodyMarkdown.includes('J02/1309/2018'), 'Company Reg. Com. J02/1309/2018 missing');
  assert.ok(contact.bodyMarkdown.includes('770 846 001'), 'Company phone +40 770 846 001 missing');

  console.log('  [PASS] All critical scientific, historical, safety, and legal facts verified.');
  console.log('=== CONTENT COMPLETENESS VERIFICATION: 100% PASSED ===');
}

main().catch((err) => {
  console.error('Completeness verification failed:', err);
  process.exit(1);
});
