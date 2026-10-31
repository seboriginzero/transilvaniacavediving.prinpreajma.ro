import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

describe('Site Database, Visual Fidelity & Content Migration Unit Tests', () => {
  test('site-database.json contains all 17 primary pages and 36 historical posts', async () => {
    const dbPath = path.join(PROJECT_ROOT, 'src/content/site-database.json');
    const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));

    assert.equal(db.pages.length, 17);
    assert.equal(db.posts.length, 36);
    assert.equal(db.company.cif, '39749631');
    assert.equal(db.company.regCom, 'J02/1309/2018');
  });

  test('visual-layout-data.json contains exact dimensions for all 578 unique images and all 56 Jetpack galleries', async () => {
    const layoutPath = path.join(PROJECT_ROOT, 'src/content/visual-layout-data.json');
    const layout = JSON.parse(await fs.readFile(layoutPath, 'utf8'));

    const filenames = Object.keys(layout.dimensionsByFilename);
    assert.ok(filenames.length >= 578, `Expected >= 578 image dimensions, got ${filenames.length}`);

    for (const [fname, dims] of Object.entries(layout.dimensionsByFilename)) {
      assert.ok(dims.width > 0, `Invalid width for ${fname}`);
      assert.ok(dims.height > 0, `Invalid height for ${fname}`);
      assert.ok(dims.ratio > 0, `Invalid ratio for ${fname}`);
    }

    assert.equal(layout.jetpackGalleries.length, 56, 'All 56 Jetpack Tiled Galleries from raw HTML must be preserved');

    // Verify grota.jpg banner has exact 10000x3489 aspect ratio (~2.866)
    const grotaDims = layout.dimensionsByFilename['grota.jpg'];
    assert.ok(grotaDims, 'grota.jpg must exist in dimensionsByFilename');
    assert.equal(grotaDims.width, 10000);
    assert.equal(grotaDims.height, 3489);
  });

  test('Every image referenced in site-database.json exists on disk in public/ with positive dimensions', async () => {
    const dbPath = path.join(PROJECT_ROOT, 'src/content/site-database.json');
    const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));

    for (const page of [...db.pages, ...db.posts]) {
      for (const img of page.images || []) {
        const diskPath = path.join(PROJECT_ROOT, 'public', img.localPath);
        assert.ok(
          fsSync.existsSync(diskPath),
          `Missing local image file on disk: ${img.localPath} (referenced in ${page.path})`
        );
        assert.ok(img.width > 0 && img.height > 0, `Invalid dimensions for ${img.localPath}`);
      }
    }
  });

  test('All mandatory reports exist and are non-empty', async () => {
    const reports = [
      'crawl-report.md',
      'content-inventory.csv',
      'source-urls.csv',
      'media-inventory.csv',
      'missing-assets.csv',
      'content-completeness.md',
      'historical-content-review.md',
      'factual-validation.md',
      'seo-audit.md',
      'redirect-map.csv',
      'metadata-inventory.csv',
      'internal-links-report.csv',
    ];

    for (const r of reports) {
      const p = path.join(PROJECT_ROOT, 'reports', r);
      const stat = await fs.stat(p);
      assert.ok(stat.size > 0, `Report ${r} is empty`);
    }
  });

  test('Zero dead internal links across EquipmentShowcase.tsx and site-database.json', async () => {
    const dbPath = path.join(PROJECT_ROOT, 'src/content/site-database.json');
    const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));

    const validRoutes = new Set([
      '/',
      '/descopera',
      '/aventuri',
      '/servicii',
      '/istorie-si-patrimoniu',
      '/jurnal',
      '/blog',
      '/magazin',
      '/contact',
      '/cave-diving',
    ]);
    for (const p of db.pages) validRoutes.add(p.path);
    for (const p of db.posts) {
      validRoutes.add(p.path);
      validRoutes.add(decodeURIComponent(p.path));
      validRoutes.add(`/jurnal/${p.slug}`);
      validRoutes.add(`/jurnal/${decodeURIComponent(p.slug)}`);
    }
    for (const a of db.archives) {
      validRoutes.add(a.path);
      validRoutes.add(decodeURIComponent(a.path));
    }

    const showcasePath = path.join(PROJECT_ROOT, 'src/components/EquipmentShowcase.tsx');
    const showcaseContent = await fs.readFile(showcasePath, 'utf8');
    const articleRegex = /articlePath:\s*['"]([^'"]+)['"]/g;
    let match;
    let checkedCount = 0;
    while ((match = articleRegex.exec(showcaseContent)) !== null) {
      const target = match[1].split('#')[0];
      checkedCount++;
      assert.ok(
        validRoutes.has(target) || validRoutes.has(decodeURIComponent(target)),
        `Dead articlePath in EquipmentShowcase.tsx: ${target}`
      );
    }
    assert.ok(checkedCount >= 20, `Expected at least 20 articlePath links, checked ${checkedCount}`);
  });

  test('Zero repetitive placeholder text or WordPress footer boilerplate in site-database.json', async () => {
    const dbPath = path.join(PROJECT_ROOT, 'src/content/site-database.json');
    const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));

    for (const rec of [...db.pages, ...db.posts]) {
      const md = rec.bodyMarkdown || '';
      assert.ok(
        !md.includes('Imagine arhivă Transilvania Cave Diving'),
        `Repetitive placeholder alt text found in ${rec.path}`
      );
      assert.ok(
        !/^[ \t]*[-*]\s*!\[/m.test(md),
        `List-wrapped markdown image found in ${rec.path}`
      );
      assert.ok(
        !/like loading/i.test(md),
        `WordPress Like Loading boilerplate found in ${rec.path}`
      );
      assert.ok(
        !/^#{1,6}\s*related\s*$/im.test(md),
        `Empty Related heading found in ${rec.path}`
      );
      assert.ok(
        !/(posted|published)\s+by\s*\[transilvaniacavediving\]/i.test(md),
        `WordPress Posted by footer boilerplate found in ${rec.path}`
      );
    }
  });

  test('All Romanian text across site-database.json uses "și" instead of "&" or "&amp;"', async () => {
    const dbPath = path.join(PROJECT_ROOT, 'src/content/site-database.json');
    const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));

    const nonRoSlugs = new Set([
      'bat-cave',
      'the-mill-karst-system',
      'denever-barlang',
      'a-malom-karsztrendszere',
      'hose-holders-for-111-7-liter-aluminum-cylinders-and-other-cylinders-with-a-diameter-of-140-mm',
    ]);

    for (const rec of [...db.pages, ...db.posts]) {
      if (nonRoSlugs.has(rec.slug)) continue;
      assert.ok(
        !rec.categoryLabel.includes(' & ') && !rec.categoryLabel.includes('&amp;'),
        `Found & in categoryLabel of ${rec.path}: ${rec.categoryLabel}`
      );
      assert.ok(
        !rec.bodyMarkdown.includes(' & ') && !rec.bodyMarkdown.includes('&amp;'),
        `Found & in bodyMarkdown of ${rec.path}`
      );
    }

    for (const nav of db.navigation) {
      assert.ok(!nav.label.includes(' & '), `Found & in nav label: ${nav.label}`);
      if (nav.children) {
        for (const child of nav.children) {
          assert.ok(!child.label.includes(' & '), `Found & in child nav label: ${child.label}`);
          if (child.badge) {
            assert.ok(!child.badge.includes(' & '), `Found & in child nav badge: ${child.badge}`);
          }
        }
      }
    }
  });

  test('All official Facebook pages and links are present in Footer.tsx and site-database.json', async () => {
    const dbPath = path.join(PROJECT_ROOT, 'src/content/site-database.json');
    const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));
    assert.strictEqual(db.company.facebookUrl, 'https://www.facebook.com/cavedivingromania');

    const footerPath = path.join(PROJECT_ROOT, 'src/components/Footer.tsx');
    const footerContent = await fs.readFile(footerPath, 'utf8');

    const requiredFbUrls = [
      'https://www.facebook.com/cavedivingromania',
      'https://www.facebook.com/Pe%C8%99tera-Grota-Ursului-Moneasa-108508321317590',
      'https://www.facebook.com/Belvedere-Moneasa-105856912164648',
      'https://www.facebook.com/share/1WHBh6Nj2z/',
      'https://www.facebook.com/profile.php?id=100083662944867',
      'https://www.facebook.com/profile.php?id=61575535798320',
      'https://www.facebook.com/isvernacavediving',
      'https://www.facebook.com/molnarjanoscave',
      'https://www.facebook.com/minediving',
      'https://www.facebook.com/MakitaRomaniaSRL/',
    ];

    for (const fbUrl of requiredFbUrls) {
      assert.ok(footerContent.includes(fbUrl), `Missing Facebook URL in Footer.tsx: ${fbUrl}`);
    }
  });
});
