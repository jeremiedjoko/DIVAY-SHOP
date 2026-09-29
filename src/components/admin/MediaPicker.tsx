"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { MediaDto } from "@/lib/media/types";
import type { MediaBucket } from "@/lib/media/constants";

type Props = {
  bucket?: MediaBucket;
  label: string;
  value?: string | null;
  onChange: (mediaId: string | null, media?: MediaDto) => void;
  multi?: boolean;
  values?: string[];
  onMultiChange?: (ids: string[]) => void;
};

export function MediaPicker({
  bucket,
  label,
  value,
  onChange,
  multi = false,
  values = [],
  onMultiChange,
}: Props) {
  const [items, setItems] = useState<MediaDto[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = bucket ? `?bucket=${bucket}` : "";
    void fetch(`/api/admin/media${q}`)
      .then((r) => r.json())
      .then((d: { media: MediaDto[] }) => setItems(d.media ?? []));
  }, [bucket, open]);

  const selected = multi
    ? items.filter((m) => values.includes(m.id))
    : items.filter((m) => m.id === value);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p>
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selected.map((m) => (
            <div key={m.id} className="relative h-16 w-16 overflow-hidden rounded-lg border">
              <Image src={m.primaryUrl} alt={m.altText ?? ""} fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-stone-400">Aucune image sélectionnée</p>
      )}
      <button
        type="button"
        className="text-sm text-[#8b5a4b] hover:underline"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Fermer la bibliothèque" : "Choisir dans la médiathèque"}
      </button>
      {open ? (
        <div className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto rounded-lg border p-2">
          {items.map((m) => {
            const active = multi ? values.includes(m.id) : value === m.id;
            return (
              <button
                key={m.id}
                type="button"
                className={`relative aspect-square overflow-hidden rounded border-2 ${active ? "border-[#8b5a4b]" : "border-transparent"}`}
                onClick={() => {
                  if (multi && onMultiChange) {
                    const next = active ? values.filter((id) => id !== m.id) : [...values, m.id];
                    onMultiChange(next);
                  } else {
                    onChange(m.id, m);
                    setOpen(false);
                  }
                }}
              >
                <Image src={m.primaryUrl} alt="" fill className="object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
