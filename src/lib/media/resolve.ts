import type { MediaDto, MediaVariants } from "./types";
import type { ImageVariant } from "./constants";

export function parseVariants(json: string): MediaVariants {
  try {
    return JSON.parse(json) as MediaVariants;
  } catch {
    return {};
  }
}

export function mediaToDto(row: {
  id: string;
  bucket: string;
  assetFolder: string | null;
  storagePath: string;
  publicBasePath: string;
  altText: string | null;
  focalX: number;
  focalY: number;
  width: number | null;
  height: number | null;
  mimeType: string | null;
  source: string | null;
  sourceUrl: string | null;
  licenseNote: string | null;
  isStock: number;
  variantsJson: string;
}): MediaDto {
  const variants = parseVariants(row.variantsJson);
  const primaryUrl =
    variants.lg ?? variants.md ?? variants.xl ?? variants.sm ?? variants.original ?? row.publicBasePath;
  return { ...row, variants, primaryUrl };
}

export function pickVariantUrl(
  dto: MediaDto | null | undefined,
  preferred: ImageVariant = "md",
): string | null {
  if (!dto) return null;
  const order: ImageVariant[] = [preferred, "lg", "md", "xl", "sm"];
  for (const key of order) {
    const url = dto.variants[key];
    if (url) return url;
  }
  return dto.variants.original ?? dto.primaryUrl ?? null;
}

export function focalStyle(focalX: number, focalY: number): { objectPosition: string } {
  return { objectPosition: `${focalX}% ${focalY}%` };
}
