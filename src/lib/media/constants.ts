export const MEDIA_BUCKETS = ["product", "service", "homepage", "gallery"] as const;
export type MediaBucket = (typeof MEDIA_BUCKETS)[number];

/** Aligné sur le dossier Divay_Beauty_Assets sur le bureau. */
export const ASSET_FOLDERS = [
  "00_REFERENCE_MAQUETTE",
  "01_HERO",
  "02_MAKEUP",
  "03_MANUCURE_PEDICURE",
  "04_SOINS_VISAGE",
  "05_SACS_PAGNE",
  "06_SACS_PERLES",
  "07_EVENTAILS_PAGNE",
  "08_PERLES_PERLAGE",
  "09_STYLOS_BIJOUX_ACCESSOIRES",
  "10_GALERIE",
  "11_ICONS_LOGO",
  "12_PLACEHOLDERS",
] as const;

export type AssetFolder = (typeof ASSET_FOLDERS)[number];

export const IMAGE_VARIANTS = {
  sm: 480,
  md: 800,
  lg: 1200,
  xl: 1920,
} as const;

export type ImageVariant = keyof typeof IMAGE_VARIANTS;

export const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

export function bucketForAssetFolder(folder: AssetFolder): MediaBucket {
  if (folder === "01_HERO") return "homepage";
  if (folder.startsWith("02_") || folder.startsWith("03_") || folder.startsWith("04_")) {
    return "service";
  }
  if (folder === "10_GALERIE") return "gallery";
  if (folder === "00_REFERENCE_MAQUETTE" || folder === "11_ICONS_LOGO" || folder === "12_PLACEHOLDERS") {
    return "homepage";
  }
  return "product";
}

export function isForbiddenUnsplashPlus(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.includes("plus.unsplash.com") || lower.includes("unsplash.com/plus");
}
