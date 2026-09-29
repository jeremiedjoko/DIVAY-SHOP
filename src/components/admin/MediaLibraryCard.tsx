"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import type { MediaDto } from "@/lib/media/types";

type Props = {
  media: MediaDto;
  onUpdated: () => void;
};

export function MediaLibraryCard({ media, onUpdated }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [altText, setAltText] = useState(media.altText ?? "");

  async function replaceFile(file: File) {
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/admin/media/${media.id}`, { method: "PUT", body: fd });
    setBusy(false);
    if (res.ok) onUpdated();
  }

  async function saveMeta() {
    setBusy(true);
    await fetch(`/api/admin/media/${media.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ altText }),
    });
    setBusy(false);
    onUpdated();
  }

  return (
    <div className="rounded-lg border bg-white p-2 text-[10px] space-y-2">
      <div className="relative aspect-square overflow-hidden rounded">
        <Image src={media.primaryUrl} alt={media.altText ?? ""} fill className="object-cover" />
      </div>
      <p className="truncate font-medium">{media.bucket}</p>
      <p className="truncate text-stone-500">{media.assetFolder ?? "—"}</p>
      {media.isStock ? (
        <span className="text-amber-600">stock — remplacer avant prod produit</span>
      ) : (
        <span className="text-green-700">original Divay</span>
      )}
      {media.source ? <p className="truncate">src: {media.source}</p> : null}
      <input
        className="w-full rounded border px-1 py-0.5 text-[10px]"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        placeholder="Alt text"
      />
      <div className="flex gap-1">
        <button
          type="button"
          disabled={busy}
          onClick={() => void saveMeta()}
          className="flex-1 rounded bg-stone-100 py-1 hover:bg-stone-200 disabled:opacity-50"
        >
          Alt
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-0.5 rounded bg-stone-900 px-2 py-1 text-white disabled:opacity-50"
          title="Remplacer le fichier sans changer l’ID"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void replaceFile(f);
        }}
      />
    </div>
  );
}
