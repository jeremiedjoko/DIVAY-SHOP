"use client";

import { useCallback, useEffect, useState } from "react";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { MediaLibraryCard } from "@/components/admin/MediaLibraryCard";
import type { MediaDto } from "@/lib/media/types";

type SectionRow = { sectionKey: string; label: string; mediaId: string | null };
type ServiceRow = { slug: string; title: string; mediaId: string | null };
type GalleryRow = { id: string; caption: string | null; mediaId: string };

export default function AdminMediasPage() {
  const [media, setMedia] = useState<MediaDto[]>([]);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [gallery, setGallery] = useState<GalleryRow[]>([]);
  const [newGalleryMediaId, setNewGalleryMediaId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const [m, s, sv, g] = await Promise.all([
      fetch("/api/admin/media").then((r) => r.json()),
      fetch("/api/admin/site-sections").then((r) => r.json()),
      fetch("/api/admin/services").then((r) => r.json()),
      fetch("/api/admin/gallery").then((r) => r.json()),
    ]);
    setMedia(m.media ?? []);
    setSections(
      (s.sections ?? []).map((x: { sectionKey: string; label: string; mediaId: string | null }) => ({
        sectionKey: x.sectionKey,
        label: x.label,
        mediaId: x.mediaId,
      })),
    );
    setServices(
      (sv.services ?? []).map((x: { slug: string; title: string; mediaId: string | null }) => ({
        slug: x.slug,
        title: x.title,
        mediaId: x.mediaId,
      })),
    );
    setGallery(
      (g.items ?? []).map((x: { id: string; caption: string | null; mediaId: string }) => ({
        id: x.id,
        caption: x.caption,
        mediaId: x.mediaId,
      })),
    );
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function bindSection(sectionKey: string, mediaId: string | null) {
    await fetch("/api/admin/site-sections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionKey, mediaId }),
    });
    void reload();
  }

  async function addGalleryItem() {
    if (!newGalleryMediaId) return;
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId: newGalleryMediaId, sortOrder: gallery.length }),
    });
    setNewGalleryMediaId(null);
    void reload();
  }

  async function removeGalleryItem(id: string) {
    await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    void reload();
  }

  async function bindService(slug: string, mediaId: string | null) {
    await fetch("/api/admin/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, mediaId }),
    });
    void reload();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">Médias & visuels</h1>
        <p className="mt-2 text-sm text-stone-600">
          Téléversez dans les dossiers alignés sur{" "}
          <code className="rounded bg-stone-200 px-1">Divay_Beauty_Assets</code>. Les URLs ne sont
          pas codées en dur : seuls chemin + métadonnées en base. Remplacez les photos stock par
          les vraies photos produits avant la mise en production.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-medium">Nouvel upload</h2>
        <MediaUpload
          onUploaded={() => {
            void reload();
          }}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Bibliothèque ({media.length})</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {media.map((m) => (
            <MediaLibraryCard key={m.id} media={m} onUpdated={() => void reload()} />
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-white p-4">
        <h2 className="text-lg font-medium">Galerie accueil</h2>
        <MediaPicker
          bucket="gallery"
          label="Ajouter une photo à la galerie"
          value={newGalleryMediaId}
          onChange={(id) => setNewGalleryMediaId(id)}
        />
        <button
          type="button"
          disabled={!newGalleryMediaId}
          onClick={() => void addGalleryItem()}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Ajouter à la galerie
        </button>
        <ul className="space-y-2">
          {gallery.map((g) => (
            <li key={g.id} className="flex items-center justify-between text-sm">
              <span className="truncate text-stone-600">{g.mediaId.slice(0, 8)}…</span>
              <button
                type="button"
                className="text-red-600 hover:underline"
                onClick={() => void removeGalleryItem(g.id)}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Sections accueil</h2>
        {sections.map((sec) => (
          <div key={sec.sectionKey} className="rounded-xl border bg-white p-4">
            <p className="text-sm font-medium">{sec.label}</p>
            <p className="text-xs text-stone-400">{sec.sectionKey}</p>
            <div className="mt-2">
              <MediaPicker
                bucket="homepage"
                label="Image"
                value={sec.mediaId}
                onChange={(id) => void bindSection(sec.sectionKey, id)}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Prestations beauté</h2>
        {services.map((svc) => (
          <div key={svc.slug} className="rounded-xl border bg-white p-4">
            <p className="text-sm font-medium">{svc.title}</p>
            <MediaPicker
              bucket="service"
              label="Visuel prestation"
              value={svc.mediaId}
              onChange={(id) => void bindService(svc.slug, id)}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
