import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { requireAdminSession } from "@/lib/admin-api";
import { deleteMediaRecord, getMediaById, updateMediaMeta } from "@/lib/media/repository";
import {
  ALLOWED_MIME,
  isForbiddenUnsplashPlus,
} from "@/lib/media/constants";
import { processUploadedImage } from "@/lib/media/process";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const media = await getMediaById(id);
  if (!media) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json({ media });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();

  if (body.sourceUrl && isForbiddenUnsplashPlus(String(body.sourceUrl))) {
    return NextResponse.json({ error: "Unsplash+ interdit." }, { status: 400 });
  }

  const updated = await updateMediaMeta(id, {
    altText: body.altText,
    focalX: body.focalX,
    focalY: body.focalY,
    source: body.source,
    sourceUrl: body.sourceUrl,
    licenseNote: body.licenseNote,
    isStock: body.isStock,
  });
  if (!updated) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json({ media: updated });
}

/** Remplace le fichier binaire sans changer l’identifiant média. */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await getMediaById(id);
  if (!existing) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

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
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "Format non autorisé." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicDir = path.join(process.cwd(), "public", "media", existing.bucket, id);
  await fs.rm(publicDir, { recursive: true, force: true });
  const { width, height, variants } = await processUploadedImage(buffer, publicDir, "img");
  const primaryUrl = variants.lg ?? variants.md ?? variants.original ?? existing.publicBasePath;

  const storagePath = path.join(process.cwd(), existing.storagePath);
  await fs.writeFile(storagePath, buffer);

  const updated = await updateMediaMeta(id, {
    width,
    height,
    mimeType: file.type,
    publicBasePath: primaryUrl,
    variantsJson: JSON.stringify(variants),
  });
  return NextResponse.json({ media: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await getMediaById(id);
  if (!existing) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  try {
    await fs.rm(path.join(process.cwd(), "public", "media", existing.bucket, id), {
      recursive: true,
      force: true,
    });
  } catch {
    /* ignore */
  }
  await deleteMediaRecord(id);
  return NextResponse.json({ ok: true });
}
