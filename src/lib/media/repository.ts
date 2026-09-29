import { db } from "@/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { mediaToDto } from "./resolve";
import type { MediaBucket } from "./constants";
import type { MediaDto, MediaVariants } from "./types";

export async function getMediaById(id: string): Promise<MediaDto | null> {
  const row = await db.query.media.findFirst({ where: eq(media.id, id) });
  return row ? mediaToDto(row) : null;
}

export async function listMedia(bucket?: MediaBucket): Promise<MediaDto[]> {
  const rows = await db.select().from(media);
  const filtered = bucket ? rows.filter((r) => r.bucket === bucket) : rows;
  return filtered
    .sort((a, b) => {
      const ta = a.createdAt?.getTime?.() ?? 0;
      const tb = b.createdAt?.getTime?.() ?? 0;
      return tb - ta;
    })
    .map(mediaToDto);
}

export async function insertMedia(input: {
  bucket: MediaBucket;
  assetFolder: string | null;
  storagePath: string;
  publicBasePath: string;
  altText: string | null;
  focalX: number;
  focalY: number;
  width: number;
  height: number;
  mimeType: string;
  source: string | null;
  sourceUrl: string | null;
  licenseNote: string | null;
  isStock: boolean;
  variants: MediaVariants;
}): Promise<MediaDto> {
  const id = randomUUID();
  const now = new Date();
  await db.insert(media).values({
    id,
    bucket: input.bucket,
    assetFolder: input.assetFolder,
    storagePath: input.storagePath,
    publicBasePath: input.publicBasePath,
    altText: input.altText,
    focalX: input.focalX,
    focalY: input.focalY,
    width: input.width,
    height: input.height,
    mimeType: input.mimeType,
    source: input.source,
    sourceUrl: input.sourceUrl,
    licenseNote: input.licenseNote,
    isStock: input.isStock ? 1 : 0,
    variantsJson: JSON.stringify(input.variants),
    createdAt: now,
    updatedAt: now,
  });
  const created = await getMediaById(id);
  if (!created) throw new Error("Media insert failed");
  return created;
}

export async function updateMediaMeta(
  id: string,
  patch: Partial<{
    altText: string;
    focalX: number;
    focalY: number;
    source: string;
    sourceUrl: string;
    licenseNote: string;
    isStock: boolean;
    variantsJson: string;
    publicBasePath: string;
    storagePath: string;
    width: number;
    height: number;
    mimeType: string;
  }>,
): Promise<MediaDto | null> {
  const data: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.altText !== undefined) data.altText = patch.altText;
  if (patch.focalX !== undefined) data.focalX = patch.focalX;
  if (patch.focalY !== undefined) data.focalY = patch.focalY;
  if (patch.source !== undefined) data.source = patch.source;
  if (patch.sourceUrl !== undefined) data.sourceUrl = patch.sourceUrl;
  if (patch.licenseNote !== undefined) data.licenseNote = patch.licenseNote;
  if (patch.isStock !== undefined) data.isStock = patch.isStock ? 1 : 0;
  if (patch.variantsJson !== undefined) data.variantsJson = patch.variantsJson;
  if (patch.publicBasePath !== undefined) data.publicBasePath = patch.publicBasePath;
  if (patch.storagePath !== undefined) data.storagePath = patch.storagePath;
  if (patch.width !== undefined) data.width = patch.width;
  if (patch.height !== undefined) data.height = patch.height;
  if (patch.mimeType !== undefined) data.mimeType = patch.mimeType;

  await db.update(media).set(data).where(eq(media.id, id));
  return getMediaById(id);
}

export async function deleteMediaRecord(id: string) {
  await db.delete(media).where(eq(media.id, id));
}
