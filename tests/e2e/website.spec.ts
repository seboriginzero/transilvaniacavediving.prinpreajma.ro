import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 375, height: 812, name: 'Mobile (375px)' },
  { width: 768, height: 1024, name: 'Tablet (768px)' },
  { width: 1024, height: 768, name: 'Laptop (1024px)' },
  { width: 1440, height: 900, name: 'Desktop (1440px)' },
  { width: 1920, height: 1080, name: 'Wide Desktop (1920px)' },
];

test.describe('Transilvania Cave Diving — End-to-End & Visual Fidelity Verification Suite', () => {
  for (const vp of VIEWPORTS) {
    test(`Responsive layout & zero horizontal overflow at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const res = await page.goto('/');
      expect(res?.status()).toBe(200);

      await expect(page.locator('h1')).toContainText('Transilvania Cave Diving');

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow).toBe(false);
    });
  }

  test('CRITICAL: Banner on /grota-ursului, /via-ferrata-cetate-dezna, and /visit-isverna is 100% visible and uncropped', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const bannerPages = [
      { path: '/grota-ursului', bannerFile: 'grota.jpg', expectedRatio: 10000 / 3489 },
      { path: '/via-ferrata-cetate-dezna', bannerFile: 'graphic1.jpg', expectedRatio: 10000 / 3529 },
      { path: '/visit-isverna', bannerFile: 'visit.jpg', expectedRatio: 750 / 269 },
    ];

    for (const bp of bannerPages) {
      await page.goto(bp.path, { waitUntil: 'networkidle' });

      const bannerImg = page
        .locator(`.wp-block-jetpack-tiled-gallery img[src*="${bp.bannerFile}"]`)
        .first();
      await bannerImg.scrollIntoViewIfNeeded();
      await expect(bannerImg).toBeVisible();

      const metrics = await bannerImg.evaluate((el: HTMLImageElement) => {
        const imgRect = el.getBoundingClientRect();
        const fig = el.closest('figure');
        const figRect = fig ? fig.getBoundingClientRect() : imgRect;
        return {
          complete: el.complete,
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
          renderedWidth: imgRect.width,
          renderedHeight: imgRect.height,
          figWidth: figRect.width,
          figHeight: figRect.height,
        };
      });

      expect(metrics.complete, `Banner ${bp.bannerFile} on ${bp.path} should load`).toBe(true);
      expect(metrics.naturalWidth).toBeGreaterThan(0);
      expect(metrics.naturalHeight).toBeGreaterThan(0);

      const naturalRatio = metrics.naturalWidth / metrics.naturalHeight;
      const renderedRatio = metrics.renderedWidth / metrics.renderedHeight;
      const ratioDiff = Math.abs(renderedRatio - naturalRatio) / naturalRatio;

      // Rendered aspect ratio must match intrinsic aspect ratio within 2% (0% cropped!)
      expect(
        ratioDiff,
        `Banner ${bp.bannerFile} on ${bp.path} is cropped! renderedRatio=${renderedRatio.toFixed(3)}, naturalRatio=${naturalRatio.toFixed(3)}`
      ).toBeLessThan(0.02);

      // Parent figure must not clip the banner horizontally or vertically
      expect(metrics.figWidth).toBeGreaterThanOrEqual(metrics.renderedWidth - 2);
      expect(metrics.figHeight).toBeGreaterThanOrEqual(metrics.renderedHeight - 2);
    }
  });

  test('CRITICAL: Original Jetpack Tiled Gallery structure & zero image cropping on Homepage and /grota-ursului', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Check Homepage 5-image intro Jetpack Tiled Gallery
    await page.goto('/', { waitUntil: 'networkidle' });
    const homeFirstGallery = page.locator('.wp-block-jetpack-tiled-gallery').first();
    await homeFirstGallery.scrollIntoViewIfNeeded();

    const homeRowsCount = await homeFirstGallery.locator('.tiled-gallery__row').count();
    expect(homeRowsCount).toBe(2); // Row 0 (3 cols) + Row 1 (2 cols), exact match to home.html

    const row0Cols = await homeFirstGallery
      .locator('.tiled-gallery__row')
      .nth(0)
      .locator('.tiled-gallery__col')
      .count();
    const row1Cols = await homeFirstGallery
      .locator('.tiled-gallery__row')
      .nth(1)
      .locator('.tiled-gallery__col')
      .count();
    expect(row0Cols).toBe(3);
    expect(row1Cols).toBe(2);

    // Verify all 5 images in homepage intro mosaic are uncropped and columns in each row align horizontally
    const homeRowAlignment = await homeFirstGallery.evaluate((galleryEl) => {
      const rows = Array.from(galleryEl.querySelectorAll('.tiled-gallery__row'));
      return rows.map((row) => {
        const cols = Array.from(row.querySelectorAll('.tiled-gallery__col'));
        const rects = cols.map((c) => c.getBoundingClientRect());
        const imgs = Array.from(row.querySelectorAll('img')) as HTMLImageElement[];
        const imgRatios = imgs.map((im) => {
          const r = im.getBoundingClientRect();
          const nat = im.naturalWidth / im.naturalHeight;
          const ren = r.width / r.height;
          return Math.abs(ren - nat) / nat;
        });
        return {
          topDiff: Math.max(...rects.map((r) => r.top)) - Math.min(...rects.map((r) => r.top)),
          heightDiff:
            Math.max(...rects.map((r) => r.height)) - Math.min(...rects.map((r) => r.height)),
          maxRatioError: Math.max(...imgRatios),
        };
      });
    });

    for (const rStat of homeRowAlignment) {
      expect(rStat.topDiff, 'Columns in a tiled row must sit side-by-side at the same top Y').toBeLessThan(2);
      expect(rStat.heightDiff, 'Columns in a tiled row must have matching proportional heights').toBeLessThan(6);
      expect(rStat.maxRatioError, 'Every image in the tiled row must be 100% uncropped').toBeLessThan(0.02);
    }

    // 2. Check /grota-ursului galleries
    await page.goto('/grota-ursului', { waitUntil: 'load' });
    // Force eager loading on all gallery images in the page so headless Chromium decodes every one
    await page.evaluate(async () => {
      const imgs = Array.from(
        document.querySelectorAll('.wp-block-jetpack-tiled-gallery img.tiled-mosaic-img')
      ) as HTMLImageElement[];
      for (const im of imgs) {
        im.loading = 'eager';
        im.scrollIntoView({ behavior: 'instant', block: 'center' });
        if (!im.complete) {
          await new Promise<void>((resolve) => {
            im.addEventListener('load', () => resolve(), { once: true });
            im.addEventListener('error', () => resolve(), { once: true });
            setTimeout(resolve, 2500);
          });
        }
      }
      window.scrollTo(0, 0);
    });

    const grotaGalleriesAudit = await page.evaluate(() => {
      const imgs = Array.from(
        document.querySelectorAll('.wp-block-jetpack-tiled-gallery img.tiled-mosaic-img')
      ) as HTMLImageElement[];
      const cropped: string[] = [];
      const broken: string[] = [];

      for (const im of imgs) {
        if (!im.complete || im.naturalWidth === 0) {
          broken.push(im.src);
          continue;
        }
        const rect = im.getBoundingClientRect();
        const natRatio = im.naturalWidth / im.naturalHeight;
        const renRatio = rect.width / rect.height;
        if (Math.abs(renRatio - natRatio) / natRatio > 0.025) {
          cropped.push(`${im.src} (rendered=${renRatio.toFixed(2)}, natural=${natRatio.toFixed(2)})`);
        }
      }
      return { total: imgs.length, broken, cropped };
    });

    expect(grotaGalleriesAudit.total).toBeGreaterThan(30);
    expect(grotaGalleriesAudit.broken).toEqual([]);
    expect(grotaGalleriesAudit.cropped).toEqual([]);
  });

  test('CRITICAL: /magazin professional equipment showcase renders all 9 brands, category filters, and uncropped product galleries', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/magazin', { waitUntil: 'networkidle' });

    const expectedBrandIds = [
      '#brand-fenix',
      '#brand-tecline',
      '#brand-ammonite-system',
      '#brand-kwark',
      '#brand-ur-flex',
      '#brand-bauer-kompressoren',
      '#brand-ursuit',
      '#brand-si-tech',
      '#brand-shearwater',
    ];

    for (const id of expectedBrandIds) {
      await expect(page.locator(id)).toBeVisible();
    }

    // Test interactive category filter
    const lightingTab = page.locator('button', { hasText: 'Iluminat Speo & Subacvatic' });
    await lightingTab.click();
    await expect(page.locator('#brand-fenix')).toBeVisible();
    await expect(page.locator('#brand-ammonite-system')).toBeVisible();
    await expect(page.locator('#brand-bauer-kompressoren')).toHaveCount(0);

    // Reset filter to all 9 brands
    const allTab = page.locator('button', { hasText: 'Toate Echipamentele (9 Branduri)' });
    await allTab.click();
    await expect(page.locator('#brand-bauer-kompressoren')).toBeVisible();

    // Verify every single "Fișa tehnică completă" and internal link on /magazin resolves with HTTP 200 (0 dead links)
    const internalHrefs = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href^="/"]')) as HTMLAnchorElement[];
      return Array.from(new Set(anchors.map((a) => a.getAttribute('href') || '').filter(Boolean)));
    });

    expect(internalHrefs.length).toBeGreaterThan(25);

    for (const href of internalHrefs) {
      const cleanPath = href.split('#')[0];
      if (!cleanPath) continue;
      const res = await page.request.get(cleanPath);
      expect(res.status(), `Internal link ${href} on /magazin returned ${res.status()}`).toBe(200);
      const body = await res.text();
      expect(body).not.toContain('Pagină negăsită în arhiva speologică');
      expect(body).not.toContain('Articol negăsit');
    }
  });

  test('Language selector buttons (RO / EN / HU) are visible in Header and switch multilingual pages', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/pestera-liliecilor');

    const langGroup = page.locator('header [role="group"][aria-label*="Selectează limba"]').first();
    await expect(langGroup).toBeVisible();
    await expect(langGroup.locator('a', { hasText: 'RO' })).toBeVisible();
    await expect(langGroup.locator('a', { hasText: 'EN' })).toBeVisible();
    await expect(langGroup.locator('a', { hasText: 'HU' })).toBeVisible();

    await langGroup.locator('a', { hasText: 'EN' }).click();
    await expect(page).toHaveURL(/\/bat-cave/);
    await expect(page.locator('h1')).toContainText(/Bat cave/i);
  });

  test('Mobile navigation drawer opens and closes via Escape key at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const toggleBtn = page.locator('button[aria-controls="mobile-navigation-drawer"]');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();

    const drawer = page.locator('#mobile-navigation-drawer');
    await expect(drawer).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
  });

  test('All primary destination, heritage, service, and multilingual pages render with HTTP 200 and JSON-LD', async ({
    page,
  }) => {
    const routesToVerify = [
      { path: '/grota-ursului', expectedText: 'Grota Ursului' },
      { path: '/pestera-liliecilor', expectedText: '11487.01' },
      { path: '/bat-cave', expectedText: 'Bat Cave' },
      { path: '/denever-barlang', expectedText: 'Denevér' },
      { path: '/pestera-uscata-de-la-moara', expectedText: 'ROSCI0042' },
      { path: '/the-mill-karst-system', expectedText: 'Mill Karst' },
      { path: '/a-malom-karsztrendszere', expectedText: 'Malom' },
      { path: '/via-ferrata-cetate-dezna', expectedText: 'Cetatea Dezna' },
      { path: '/belvedere-moneasa', expectedText: 'Belvedere' },
      { path: '/moneasa-adventure', expectedText: 'Școala Altfel' },
      { path: '/statiunea-moneasa', expectedText: '1597' },
      { path: '/czaran-gyula', expectedText: 'Czárán Gyula' },
      { path: '/visit-isverna', expectedText: 'Black Sump' },
      { path: '/cave-diving', expectedText: 'IANTD' },
      { path: '/servicii', expectedText: 'Descoperă Peșterile din România' },
      { path: '/blog', expectedText: 'Descoperă Peșterile din România' },
      { path: '/magazin', expectedText: 'O.U.G. nr. 34/2014' },
      { path: '/jurnal', expectedText: 'Jurnal de Explorare' },
      { path: '/contact', expectedText: '39749631' },
    ];

    for (const item of routesToVerify) {
      const response = await page.goto(item.path);
      expect(response?.status(), `Route ${item.path} should return 200`).toBe(200);
      await expect(page.locator('main')).toContainText(item.expectedText);

      const jsonLdCount = await page.locator('script[type="application/ld+json"]').count();
      expect(jsonLdCount).toBeGreaterThan(0);
    }
  });

  test('Interactive TiledMosaicGallery lightbox opens and closes via keyboard on /grota-ursului', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/grota-ursului');

    const firstGalleryBtn = page.locator('.wp-block-jetpack-tiled-gallery figure button').first();
    await expect(firstGalleryBtn).toBeVisible();
    await firstGalleryBtn.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('Article /2025/01/26/fenix-hm75r-lanterna-frontala-1600-lumeni-223-metri renders gallery images and specs table with zero repetitive text', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/2025/01/26/fenix-hm75r-lanterna-frontala-1600-lumeni-223-metri');

    const bodyText = await page.locator('main').innerText();
    expect(bodyText).not.toContain('!Imagine arhivă Transilvania Cave Diving');
    expect(bodyText).not.toContain('Imagine arhivă Transilvania Cave Diving');
    expect(bodyText).not.toContain('Like Loading');
    expect(bodyText).not.toContain('Posted by');

    // Verify the 19 gallery photos at the top of the article render as real images
    const galleryImages = page.locator('.wp-block-jetpack-tiled-gallery img');
    expect(await galleryImages.count()).toBeGreaterThanOrEqual(19);

    // Verify the specification table renders as a proper HTML <table>
    const specTable = page.locator('main table');
    await expect(specTable).toBeVisible();
    await expect(specTable).toContainText('HM75R');
    await expect(specTable).toContainText('1600 lumeni');
  });

  test('Contact form validates inputs and submits cleanly to /api/contact', async ({ page }) => {
    await page.goto('/contact');

    await page.fill('#contact-name', 'Test Speolog');
    await page.fill('#contact-email', 'speolog@example.com');
    await page.fill('#contact-phone', '+40 770 846 001');
    await page.fill(
      '#contact-message',
      'Solicitare de test pentru programare grup organizat la Peștera Grota Ursului.'
    );

    await page.click('button[type="submit"]');
    const statusBox = page.locator('div[role="status"]');
    await expect(statusBox).toBeVisible();
    await expect(statusBox).toContainText('Mulțumim, Test Speolog');
  });

  test('Legacy chronological article routes and redirects resolve properly', async ({ page }) => {
    const postRes = await page.goto('/2021/07/26/curs-ow-side-mount-diver-iantd');
    expect(postRes?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Curs OW side mount diver – IANTD');

    await page.goto('/shop');
    expect(page.url()).toContain('/magazin');
  });

  test('404 page renders helpful navigation and HTTP 404 status', async ({ page }) => {
    const res = await page.goto('/pagina-inexistenta-xyz-404');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('404');
  });
});
