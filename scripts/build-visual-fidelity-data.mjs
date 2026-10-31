import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const PUBLIC_MEDIA = path.join(ROOT, 'public/media');
const RAW_HTML_DIR = path.join(ROOT, 'source-data/raw/html');
const DB_PATH = path.join(ROOT, 'src/content/site-database.json');

// 1. Collect all image files under public/media
function walkFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkFiles(full));
    } else if (/\.(jpe?g|png|webp|gif)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const allMediaFiles = walkFiles(PUBLIC_MEDIA);
console.log(`Scanning dimensions for ${allMediaFiles.length} local media files...`);

const dimsByFilename = {};
const dimsByLocalPath = {};

// Batch sips calls in chunks of 80 files
const chunkSize = 80;
for (let i = 0; i < allMediaFiles.length; i += chunkSize) {
  const chunk = allMediaFiles.slice(i, i + chunkSize);
  const quoted = chunk.map((f) => `"${f}"`).join(' ');
  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight ${quoted}`, {
      maxBuffer: 10 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString();

    let currentFile = null;
    let w = null;
    let h = null;
    for (const line of out.split('\n')) {
      if (line.startsWith('/')) {
        if (currentFile && w && h) {
          const rel = '/media/' + path.relative(PUBLIC_MEDIA, currentFile).replace(/\\/g, '/');
          const base = path.basename(currentFile).toLowerCase();
          dimsByLocalPath[rel] = { width: w, height: h, ratio: Number((w / h).toFixed(5)) };
          dimsByFilename[base] = { width: w, height: h, ratio: Number((w / h).toFixed(5)) };
        }
        currentFile = line.trim().replace(/:$/, '');
        w = null;
        h = null;
      } else {
        const wm = line.match(/pixelWidth:\s*(\d+)/);
        const hm = line.match(/pixelHeight:\s*(\d+)/);
        if (wm) w = parseInt(wm[1], 10);
        if (hm) h = parseInt(hm[1], 10);
      }
    }
    if (currentFile && w && h) {
      const rel = '/media/' + path.relative(PUBLIC_MEDIA, currentFile).replace(/\\/g, '/');
      const base = path.basename(currentFile).toLowerCase();
      dimsByLocalPath[rel] = { width: w, height: h, ratio: Number((w / h).toFixed(5)) };
      dimsByFilename[base] = { width: w, height: h, ratio: Number((w / h).toFixed(5)) };
    }
  } catch (err) {
    // Fallback file-by-file if one file in batch is unusual
    for (const f of chunk) {
      try {
        const out = execSync(`sips -g pixelWidth -g pixelHeight "${f}"`, {
          stdio: ['ignore', 'pipe', 'ignore'],
        }).toString();
        const wm = out.match(/pixelWidth:\s*(\d+)/);
        const hm = out.match(/pixelHeight:\s*(\d+)/);
        if (wm && hm) {
          const w = parseInt(wm[1], 10);
          const h = parseInt(hm[1], 10);
          const rel = '/media/' + path.relative(PUBLIC_MEDIA, f).replace(/\\/g, '/');
          const base = path.basename(f).toLowerCase();
          dimsByLocalPath[rel] = { width: w, height: h, ratio: Number((w / h).toFixed(5)) };
          dimsByFilename[base] = { width: w, height: h, ratio: Number((w / h).toFixed(5)) };
        }
      } catch {}
    }
  }
}

console.log(`Extracted exact dimensions for ${Object.keys(dimsByFilename).length} unique filenames.`);

// 2. Parse raw HTML files to extract exact Jetpack Tiled Gallery rows & columns
// Structure of a Jetpack Tiled Gallery in HTML:
// <div ... class="wp-block-jetpack-tiled-gallery ...">
//   ...
//   <div class="tiled-gallery__row">
//     <div class="tiled-gallery__col" style="flex-basis:50.04635%">
//       <figure class="tiled-gallery__item"><img ... src="..." /></figure>
//       (optional 2nd stacked figure inside same col)
//     </div>
//   </div>
// </div>

function normalizeImgFilename(urlOrPath) {
  if (!urlOrPath) return '';
  const clean = urlOrPath.split('?')[0].split('#')[0];
  let base = path.basename(clean).toLowerCase();
  // Strip WordPress -1024x768 suffix if present
  const stripped = base.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1');
  if (dimsByFilename[base]) return base;
  if (dimsByFilename[stripped]) return stripped;
  return base;
}

const rawHtmlFiles = fs.readdirSync(RAW_HTML_DIR).filter((f) => f.endsWith('.html'));
// Map from a signature of filenames in a gallery (or prefix of filenames) to the exact rows structure
const exactGalleries = [];

for (const htmlFile of rawHtmlFiles) {
  const html = fs.readFileSync(path.join(RAW_HTML_DIR, htmlFile), 'utf8');
  const entryMatch = html.match(/<div class="entry-content">([\s\S]*?)<\/div><!-- \.entry-content -->/);
  const content = entryMatch ? entryMatch[1] : html;

  // Match each tiled-gallery__gallery block
  const galleryRegex = /<div class="tiled-gallery__gallery">([\s\S]*?)<\/div><\/div><\/div>/g;
  let gMatch;
  while ((gMatch = galleryRegex.exec(content)) !== null) {
    const gHtml = gMatch[1];
    // Split by <div class="tiled-gallery__row">
    const rowParts = gHtml.split('<div class="tiled-gallery__row">').slice(1);
    const rows = [];
    const allFilesInGallery = [];

    for (const rHtml of rowParts) {
      const colParts = rHtml.split(/<div class="tiled-gallery__col"/).slice(1);
      const cols = [];
      for (const cHtml of colParts) {
        const fbMatch = cHtml.match(/flex-basis:\s*([0-9.]+)%/);
        const flexBasis = fbMatch ? parseFloat(fbMatch[1]) : null;
        const imgMatches = [...cHtml.matchAll(/<img[^>]+>/g)];
        const items = [];
        for (const im of imgMatches) {
          const tag = im[0];
          const origMatch = tag.match(/data-orig-file="([^"]+)"/);
          const srcMatch = tag.match(/src="([^"]+)"/);
          const rawSrc = origMatch ? origMatch[1] : srcMatch ? srcMatch[1] : '';
          const fname = normalizeImgFilename(rawSrc);
          const sizeMatch = tag.match(/data-orig-size="(\d+),(\d+)"/);
          let w = sizeMatch ? parseInt(sizeMatch[1], 10) : null;
          let h = sizeMatch ? parseInt(sizeMatch[2], 10) : null;
          if ((!w || !h) && dimsByFilename[fname]) {
            w = dimsByFilename[fname].width;
            h = dimsByFilename[fname].height;
          }
          if (fname) {
            items.push({
              filename: fname,
              width: w || 1024,
              height: h || 768,
            });
            allFilesInGallery.push(fname);
          }
        }
        if (items.length > 0) {
          cols.push({
            flexBasis: flexBasis || Number((100 / colParts.length).toFixed(4)),
            items,
          });
        }
      }
      if (cols.length > 0) {
        rows.push({ cols });
      }
    }

    if (rows.length > 0 && allFilesInGallery.length > 0) {
      exactGalleries.push({
        sourceFile: htmlFile,
        signature: allFilesInGallery.join('|'),
        firstFile: allFilesInGallery[0],
        count: allFilesInGallery.length,
        rows,
      });
    }
  }
}

console.log(`Extracted ${exactGalleries.length} exact Jetpack Tiled Galleries from raw HTML.`);

// Deduplicate exactGalleries by signature
const uniqueGalleriesBySig = {};
for (const g of exactGalleries) {
  if (!uniqueGalleriesBySig[g.signature]) {
    uniqueGalleriesBySig[g.signature] = g;
  }
}

// 3. Update site-database.json with exact dimensions for every image
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
let updatedImgs = 0;

for (const list of [db.pages, db.posts, db.archives || []]) {
  for (const page of list) {
    for (const img of page.images || []) {
      const byPath = dimsByLocalPath[img.localPath];
      const byName = dimsByFilename[normalizeImgFilename(img.localPath)];
      const found = byPath || byName;
      if (found) {
        img.width = found.width;
        img.height = found.height;
        updatedImgs++;
      }
    }
  }
}

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
console.log(`Updated ${updatedImgs} image records in src/content/site-database.json with true binary dimensions.`);

// Save src/content/visual-layout-data.json
const visualData = {
  dimensionsByFilename: dimsByFilename,
  dimensionsByLocalPath: dimsByLocalPath,
  jetpackGalleries: Object.values(uniqueGalleriesBySig),
};

fs.writeFileSync(
  path.join(ROOT, 'src/content/visual-layout-data.json'),
  JSON.stringify(visualData, null, 2)
);
console.log('Saved src/content/visual-layout-data.json.');

