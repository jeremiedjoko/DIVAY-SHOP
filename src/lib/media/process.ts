import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { IMAGE_VARIANTS, type ImageVariant } from "./constants";
import type { MediaVariants } from "./types";

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function processUploadedImage(
  inputBuffer: Buffer,
  publicDir: string,
  baseName: string,
): Promise<{
  width: number;
  height: number;
  mimeType: string;
  variants: MediaVariants;
}> {
  await ensureDir(publicDir);
  const image = sharp(inputBuffer, { failOn: "none" });
  const meta = await image.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  const variants: MediaVariants = {};
  const originalPath = path.join(publicDir, `${baseName}-original.webp`);
  await sharp(inputBuffer).webp({ quality: 88 }).toFile(originalPath);
  variants.original = toPublicPath(originalPath);

  for (const [key, maxWidth] of Object.entries(IMAGE_VARIANTS) as [ImageVariant, number][]) {
    const out = path.join(publicDir, `${baseName}-${key}.webp`);
    await sharp(inputBuffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    variants[key] = toPublicPath(out);
  }

  return { width, height, mimeType: "image/webp", variants };
}

function toPublicPath(absPath: string): string {
  const normalized = absPath.replace(/\\/g, "/");
  const idx = normalized.indexOf("/public/");
  if (idx === -1) return normalized;
  return normalized.slice(idx + "/public".length);
}

export function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase()
    .slice(0, 80);
}
