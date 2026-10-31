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
});
