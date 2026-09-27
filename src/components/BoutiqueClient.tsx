"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

type SortKey = "default" | "price-asc" | "price-desc";

type Props = {
  initialProducts: Product[];
  initialCategories: string[];
  initialCat?: string;
};

export function BoutiqueClient({ initialProducts, initialCategories, initialCat }: Props) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState(initialCat ?? "");
  const [sort, setSort] = useState<SortKey>("default");

  let filtered = initialProducts.filter((p) => {
    const matchCat = !cat || p.category === cat;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.priceUsdCents - b.priceUsdCents);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.priceUsdCents - a.priceUsdCents);

  return (
    <>
      {/* Barre de recherche + tri */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            🔍
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none transition focus:border-stone-900 sm:w-48"
        >
          <option value="default">Trier par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {/* Filtres catégories */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCat("")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !cat
              ? "bg-stone-900 text-white"
              : "bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-stone-400"
          }`}
        >
          Tout
        </button>
        {initialCategories.map((category) => (
          <button
            key={category}
            onClick={() => setCat(cat === category ? "" : category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              cat === category
                ? "bg-stone-900 text-white"
                : "bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-stone-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Résultat */}
      <p className="mb-5 text-sm text-stone-500">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        {search ? ` pour « ${search} »` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-stone-500">Aucun produit trouvé.</p>
          <button
            onClick={() => { setSearch(""); setCat(""); }}
            className="mt-4 text-sm text-[#c0476b] hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
