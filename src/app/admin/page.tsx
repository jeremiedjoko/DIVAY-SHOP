"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    const res = await fetch("/api/admin/products");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = (await res.json()) as { products: Product[] };
    setProducts(data.products);
    setAuthed(true);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: fd.get("password") }),
    });
    if (!res.ok) {
      setError("Mot de passe incorrect.");
      return;
    }
    await loadProducts();
  }

  if (authed === null) {
    return <main className="mx-auto max-w-lg px-4 py-20 text-center text-stone-500">Chargement…</main>;
  }

  if (!authed) {
    return (
      <main className="mx-auto max-w-sm px-4 py-20">
        <h1 className="font-serif text-2xl">Espace vendeuse</h1>
        <form onSubmit={login} className="mt-6 space-y-4">
          <input
            name="password"
            type="password"
            placeholder="Mot de passe admin"
            required
            className="w-full rounded-xl border border-stone-300 px-3 py-2"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-full bg-stone-900 py-2 text-white">
            Connexion
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Produits ({products.length})</h1>
      <p className="mt-2 text-sm text-stone-500">
        Gestion réservée à la vendeuse. Les prix sont revérifiés côté serveur à chaque commande.
      </p>
      <ul className="mt-8 space-y-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3"
          >
            <span className="font-medium">{p.name}</span>
            <span className="text-sm text-stone-500">
              {formatPrice(p.priceCents)} · stock {p.stock}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-stone-500">
        Pour ajouter ou modifier des produits via l&apos;API, utilisez POST/PUT sur{" "}
        <code className="rounded bg-stone-100 px-1">/api/admin/products</code> une fois connectée,
        ou éditez <code className="rounded bg-stone-100 px-1">data/products.json</code>.
      </p>
    </main>
  );
}
