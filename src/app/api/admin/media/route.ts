import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { listMedia } from "@/lib/media/repository";
import type { MediaBucket } from "@/lib/media/constants";
import { MEDIA_BUCKETS } from "@/lib/media/constants";

export async function GET(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bucket = new URL(req.url).searchParams.get("bucket") as MediaBucket | null;
  if (bucket && !MEDIA_BUCKETS.includes(bucket)) {
    return NextResponse.json({ error: "Bucket invalide." }, { status: 400 });
  }
  const items = await listMedia(bucket ?? undefined);
  return NextResponse.json({ media: items });
}
