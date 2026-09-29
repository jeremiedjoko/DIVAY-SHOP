"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Crosshair } from "lucide-react";
import {
  ASSET_FOLDERS,
  MEDIA_BUCKETS,
  bucketForAssetFolder,
  type AssetFolder,
  type MediaBucket,
} from "@/lib/media/constants";
import type { MediaDto } from "@/lib/media/types";

type Props = {
  defaultBucket?: MediaBucket;
  defaultFolder?: AssetFolder;
  onUploaded: (media: MediaDto) => void;
};

export function MediaUpload({ defaultBucket = "product", defaultFolder, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [focal, setFocal] = useState({ x: 50, y: 50 });
  const [bucket, setBucket] = useState<MediaBucket>(defaultBucket);
  const [assetFolder, setAssetFolder] = useState<AssetFolder | "">(defaultFolder ?? "");
  const [altText, setAltText] = useState("");
  const [source, setSource] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [licenseNote, setLicenseNote] = useState("");
  const [isStock, setIsStock] = useState(true);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const onPickFile = (file: File | null) => {
    if (!file) return;
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const onPreviewClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setFocal({ x, y });
  }, []);

  async function submit() {
    if (!pendingFile) {
      setError("Choisissez un fichier.");
      return;
    }
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", pendingFile);
    fd.append("bucket", bucket);
    if (assetFolder) fd.append("assetFolder", assetFolder);
    fd.append("altText", altText);
    fd.append("source", source);
    fd.append("sourceUrl", sourceUrl);
    fd.append("licenseNote", licenseNote);
    fd.append("isStock", isStock ? "1" : "0");
    fd.append("focalX", String(focal.x));
    fd.append("focalY", String(focal.y));

    const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
    const data = (await res.json()) as { media?: MediaDto; error?: string };
    setUploading(false);
    if (!res.ok || !data.media) {
      setError(data.error ?? "Échec de l’upload.");
      return;
    }
    onUploaded(data.media);
    setPendingFile(null);
    setPreview(null);
    setAltText("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-4">
      <div className="flex flex-wrap gap-3">
        <label className="text-xs font-medium text-stone-600">
          Bucket
          <select
            className="mt-1 block w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
            value={bucket}
            onChange={(e) => setBucket(e.target.value as MediaBucket)}
          >
            {MEDIA_BUCKETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-stone-600 min-w-[200px] flex-1">
          Dossier assets
          <select
            className="mt-1 block w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
            value={assetFolder}
            onChange={(e) => {
              const v = e.target.value as AssetFolder | "";
              setAssetFolder(v);
              if (v) setBucket(bucketForAssetFolder(v));
            }}
          >
            <option value="">—</option>
            {ASSET_FOLDERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className="relative aspect-video max-h-56 cursor-crosshair overflow-hidden rounded-lg bg-stone-100"
        onClick={preview ? onPreviewClick : undefined}
        role={preview ? "button" : undefined}
        tabIndex={preview ? 0 : undefined}
        onKeyDown={() => {}}
        aria-label="Cliquez pour définir le point focal"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" style={{ objectPosition: `${focal.x}% ${focal.y}%` }} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-500">
            Aperçu — choisissez un fichier
          </div>
        )}
        {preview ? (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white">
            <Crosshair className="h-3 w-3" /> Focal {focal.x}%, {focal.y}%
          </span>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="text-sm"
        onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
      />

      <input
        placeholder="Texte alternatif (accessibilité)"
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
      />

      <div className="grid gap-2 sm:grid-cols-2">
        <input
          placeholder="Source (unsplash, pexels, original…)"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          placeholder="URL source (pas Unsplash+)"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
      </div>
      <textarea
        placeholder="Note de licence / crédits"
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        rows={2}
        value={licenseNote}
        onChange={(e) => setLicenseNote(e.target.value)}
      />
      <label className="flex items-center gap-2 text-sm text-stone-600">
        <input type="checkbox" checked={isStock} onChange={(e) => setIsStock(e.target.checked)} />
        Image stock (à remplacer par une photo Divay avant prod produit)
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        disabled={uploading}
        onClick={() => void submit()}
        className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Envoi…" : "Téléverser"}
      </button>
    </div>
  );
}
