"use client";

import { FormEvent, useEffect, useState } from "react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type { MediaDto } from "@/lib/media/types";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  published: number;
};

export default function AdminArticlesPage() {
  const [rows, setRows] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverUrl: "",
    published: false,
  });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/articles");
    if (res.ok) {
      const data = (await res.json()) as { articles: Article[] };
      setRows(data.articles);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function reset() {
    setEditing(null);
    setCoverMediaId(null);
    setForm({ title: "", excerpt: "", content: "", coverUrl: "", published: false });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      id: editing?.id,
    };
    await fetch("/api/admin/articles", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    reset();
    void load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/admin/articles?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    void load();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <header>
        <h1 className="font-serif text-3xl">Journal</h1>
        <p className="mt-1 text-sm text-stone-500">
          Rédigez et publiez des articles visibles sur /journal, sans toucher au code.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-white p-6">
        <h2 className="font-medium">{editing ? "Modifier" : "Nouvel article"}</h2>
        <input
          required
          placeholder="Titre"
          className="w-full rounded-xl border px-3 py-2 text-sm"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <input
          placeholder="Extrait (accroche)"
          className="w-full rounded-xl border px-3 py-2 text-sm"
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
        />
        <textarea
          required
          rows={8}
          placeholder="Contenu"
          className="w-full rounded-xl border px-3 py-2 text-sm"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        />
        <MediaPicker
          label="Image de couverture"
          value={coverMediaId}
          onChange={(id, media?: MediaDto) => {
            setCoverMediaId(id);
            setForm((f) => ({ ...f, coverUrl: media?.primaryUrl ?? "" }));
          }}
        />
        {form.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.coverUrl} alt="" className="h-24 rounded-lg object-cover" />
        ) : null}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          />
          Publier immédiatement
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-stone-900 px-5 py-2 text-sm text-white"
          >
            {saving ? "Enregistrement…" : editing ? "Mettre à jour" : "Enregistrer"}
          </button>
          {editing ? (
            <button type="button" onClick={reset} className="rounded-full border px-5 py-2 text-sm">
              Annuler
            </button>
          ) : null}
        </div>
      </form>

      <ul className="space-y-3">
        {rows.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3"
          >
            <div>
              <p className="font-medium">{a.title}</p>
              <p className="text-xs text-stone-400">
                {a.published ? "Publié" : "Brouillon"} · /journal/{a.slug}
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <button
                type="button"
                className="text-[#c0476b]"
                onClick={() => {
                  setEditing(a);
                  setForm({
                    title: a.title,
                    excerpt: a.excerpt ?? "",
                    content: a.content,
                    coverUrl: a.coverUrl ?? "",
                    published: a.published === 1,
                  });
                }}
              >
                Modifier
              </button>
              <button type="button" className="text-red-600" onClick={() => void remove(a.id)}>
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
