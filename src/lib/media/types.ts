import type { ImageVariant } from "./constants";

export type MediaVariants = Partial<Record<ImageVariant | "original", string>>;

export type MediaRecord = {
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
};

export type MediaDto = Omit<MediaRecord, "variantsJson"> & {
  variants: MediaVariants;
  primaryUrl: string;
};
