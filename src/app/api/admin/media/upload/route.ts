import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requireAdminSession } from "@/lib/admin-api";
import {
  ALLOWED_MIME,
  ASSET_FOLDERS,
  MEDIA_BUCKETS,
  bucketForAssetFolder,
  isForbiddenUnsplashPlus,
  type AssetFolder,
  type MediaBucket,
} from "@/lib/media/constants";
import { insertMedia } from "@/lib/media/repository";
import { processUploadedImage, sanitizeFilename } from "@/lib/media/process";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "FormData invalide." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier requis." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 12 Mo)." }, { status: 400 });
  }

  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_MIME.has(mime)) {
    return NextResponse.json({ error: "Format non autorisé." }, { status: 400 });
  }

  const assetFolderRaw = String(form.get("assetFolder") ?? "");
  const assetFolder = ASSET_FOLDERS.includes(assetFolderRaw as AssetFolder)
    ? (assetFolderRaw as AssetFolder)
    : null;

  let bucket = String(form.get("bucket") ?? "") as MediaBucket;
  if (!MEDIA_BUCKETS.includes(bucket)) {
    bucket = assetFolder ? bucketForAssetFolder(assetFolder) : "product";
  }

  const altText = String(form.get("altText") ?? "").trim() || null;
  const source = String(form.get("source") ?? "").trim() || null;
  const sourceUrl = String(form.get("sourceUrl") ?? "").trim() || null;
  const licenseNote = String(form.get("licenseNote") ?? "").trim() || null;
  const isStock = form.get("isStock") === "1" || form.get("isStock") === "true";
  const focalX = clampPercent(Number(form.get("focalX") ?? 50));
  const focalY = clampPercent(Number(form.get("focalY") ?? 50));

  if (sourceUrl && isForbiddenUnsplashPlus(sourceUrl)) {
    return NextResponse.json(
      { error: "Unsplash+ est interdit. Utilisez une image gratuite (licence Unsplash/Pexels/Pixabay)." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mediaId = randomUUID();
  const safeName = sanitizeFilename(file.name || "upload.webp");
  const folderSegment = assetFolder ?? bucket;
  const originalsDir = path.join(process.cwd(), "storage", "originals", bucket, folderSegment);
  await fs.mkdir(originalsDir, { recursive: true });
  const storagePath = path.join(originalsDir, `${mediaId}-${safeName}`);
  await fs.writeFile(storagePath, buffer);

  const publicDir = path.join(process.cwd(), "public", "media", bucket, mediaId);
  const { width, height, variants } = await processUploadedImage(buffer, publicDir, "img");
  const primaryUrl = variants.lg ?? variants.md ?? variants.original ?? `/media/${bucket}/${mediaId}/img-original.webp`;

  const record = await insertMedia({
    bucket,
    assetFolder,
    storagePath: path.relative(process.cwd(), storagePath).replace(/\\/g, "/"),
    publicBasePath: primaryUrl,
    altText,
    focalX,
    focalY,
    width,
    height,
    mimeType: mime,
    source,
    sourceUrl,
    licenseNote,
    isStock,
    variants,
  });

  return NextResponse.json({ media: record }, { status: 201 });
}

function clampPercent(n: number): number {
  if (Number.isNaN(n)) return 50;
  return Math.min(100, Math.max(0, Math.round(n)));
}
