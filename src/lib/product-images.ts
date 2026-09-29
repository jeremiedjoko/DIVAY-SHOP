import { db } from "@/db";
import { productImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getMediaById } from "@/lib/media/repository";

export async function applyProductImages(
  productId: string,
  opts: {
    mainMediaId?: string | null;
    galleryMediaIds?: string[];
    legacyImageUrl?: string | null;
  },
) {
  await db.delete(productImages).where(eq(productImages.productId, productId));
  let order = 0;

  if (opts.mainMediaId) {
    const m = await getMediaById(opts.mainMediaId);
    await db.insert(productImages).values({
      id: randomUUID(),
      productId,
      mediaId: opts.mainMediaId,
      url: m?.primaryUrl ?? null,
      altText: m?.altText ?? null,
      isMain: 1,
      order: order++,
    });
  } else if (opts.legacyImageUrl) {
    await db.insert(productImages).values({
      id: randomUUID(),
      productId,
      url: opts.legacyImageUrl,
      isMain: 1,
      order: order++,
    });
  }

  for (const mediaId of opts.galleryMediaIds ?? []) {
    if (mediaId === opts.mainMediaId) continue;
    const m = await getMediaById(mediaId);
    await db.insert(productImages).values({
      id: randomUUID(),
      productId,
      mediaId,
      url: m?.primaryUrl ?? null,
      altText: m?.altText ?? null,
      isMain: 0,
      order: order++,
    });
  }
}
