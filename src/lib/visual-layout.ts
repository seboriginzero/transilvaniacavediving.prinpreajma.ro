import visualDataRaw from '@/content/visual-layout-data.json';

export interface ImageDimensions {
  width: number;
  height: number;
  ratio: number;
}

export interface JetpackColItem {
  filename: string;
  width: number;
  height: number;
}

export interface JetpackCol {
  flexBasis: number;
  items: JetpackColItem[];
}

export interface JetpackRow {
  cols: JetpackCol[];
}

export interface JetpackGalleryDef {
  sourceFile: string;
  signature: string;
  firstFile: string;
  count: number;
  rows: JetpackRow[];
}

interface VisualLayoutData {
  dimensionsByFilename: Record<string, ImageDimensions>;
  dimensionsByLocalPath: Record<string, ImageDimensions>;
  jetpackGalleries: JetpackGalleryDef[];
}

const visualData = visualDataRaw as unknown as VisualLayoutData;

export function normalizeFilename(src: string): string {
  if (!src) return '';
  const clean = src.split('?')[0].split('#')[0];
  const parts = clean.split('/');
  const base = (parts[parts.length - 1] || '').toLowerCase();
  if (visualData.dimensionsByFilename[base]) return base;
  const stripped = base.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1');
  if (visualData.dimensionsByFilename[stripped]) return stripped;
  return base;
}

export function getImageDimensions(
  src: string,
  fallbackWidth?: number,
  fallbackHeight?: number
): ImageDimensions {
  if (!src) {
    return { width: fallbackWidth || 1200, height: fallbackHeight || 800, ratio: 1.5 };
  }
  const byPath = visualData.dimensionsByLocalPath[src];
  if (byPath && byPath.width > 0 && byPath.height > 0) {
    return byPath;
  }
  const fname = normalizeFilename(src);
  const byName = visualData.dimensionsByFilename[fname];
  if (byName && byName.width > 0 && byName.height > 0) {
    return byName;
  }
  if (fallbackWidth && fallbackHeight && fallbackWidth > 0 && fallbackHeight > 0) {
    return {
      width: fallbackWidth,
      height: fallbackHeight,
      ratio: Number((fallbackWidth / fallbackHeight).toFixed(5)),
    };
  }
  return { width: 1200, height: 800, ratio: 1.5 };
}

export function isSmallLogoImage(src: string, dims: ImageDimensions): boolean {
  const fname = normalizeFilename(src);
  if (
    fname.includes('fenix_logo') ||
    fname === 'tecline-1.jpg' ||
    fname === 'ammonite.jpg' ||
    fname.includes('kwark_logo') ||
    fname === 'ur-flex-1.jpg' ||
    fname.includes('logo_bauer') ||
    fname === 'ursuit.jpg' ||
    fname === 'sitech.jpg' ||
    fname === 'logo-1.png' ||
    fname === 'logo-corsa-2.jpg'
  ) {
    return true;
  }
  return dims.width <= 420 && dims.height <= 260;
}

export function getAllJetpackGalleries(): JetpackGalleryDef[] {
  return visualData.jetpackGalleries;
}

