"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PlusCircle, Pencil, Eye, EyeOff, Star, Search } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  priceMinor: number;
  isActive: number;
  isFeatured: number;
  inventory?: { quantity: number } | null;
  images?: { url: string }[];
};

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", image: "", featured: false });
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    const res = await fetch("/api/admin/catalogue");
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
    }
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, []);

  async function toggleActive(id: string, current: number) {
    await fetch(`/api/admin/catalogue/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: current === 1 ? 0 : 1 }),
    });
    loadProducts();
  }

  async function toggleFeatured(id: string, current: number) {
    await fetch(`/api/admin/catalogue/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: current === 1 ? 0 : 1 }),
    });
    loadProducts();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      priceMinor: Math.round(parseFloat(form.price) * 100),
      stock: parseInt(form.stock),
      image: form.image,
      isFeatured: form.featured ? 1 : 0,
    };
    if (editProduct) {
      await fetch(`/api/admin/catalogue/${editProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/catalogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setShowForm(false);
    setEditProduct(null);
    setForm({ name: "", description: "", price: "", stock: "", image: "", featured: false });
    loadProducts();
  }

  function openEdit(p: Product) {
    setEditProduct(p);
    setForm({
      name: p.name,
      description: "",
      price: (p.priceMinor / 100).toFixed(2),
      stock: String(p.inventory?.quantity ?? 0),
      image: p.images?.[0]?.url ?? "",
      featured: p.isFeatured === 1,
    });
    setShowForm(true);
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Catalogue produits</h1>
          <p className="text-sm text-stone-400 mt-1">{products.length} produit{products.length > 1 ? "s" : ""} au total</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditProduct(null); setForm({ name: "", description: "", price: "", stock: "", image: "", featured: false }); }}
          className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition"
        >
          <PlusCircle className="h-4 w-4" />
          Ajouter un produit
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-stone-900 transition"
        />
      </div>

      {/* Form Drawer */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h2 className="font-serif text-xl mb-4">{editProduct ? "Modifier le produit" : "Nouveau produit"}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Nom</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Prix (USD)</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Stock</label>
              <input required type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">URL Image</label>
              <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900 resize-none" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 rounded" />
              <label htmlFor="featured" className="text-sm text-stone-700">Mettre en vedette sur la page d'accueil</label>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-stone-200 text-sm font-medium hover:bg-stone-50 transition">Annuler</button>
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50">
                {saving ? "Enregistrement..." : editProduct ? "Mettre à jour" : "Publier"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-20 text-stone-400">Chargement...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-stone-100 bg-stone-50">
                <tr className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                  <th className="px-6 py-4">Produit</th>
                  <th className="px-6 py-4">Prix</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.url ? (
                          <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded-lg object-cover bg-stone-100" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-stone-100" />
                        )}
                        <div>
                          <p className="font-medium text-stone-900 text-sm">{p.name}</p>
                          {p.isFeatured === 1 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> Vedette
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-700">${(p.priceMinor / 100).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        (p.inventory?.quantity ?? 0) === 0
                          ? "bg-red-100 text-red-700"
                          : (p.inventory?.quantity ?? 0) <= 5
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {p.inventory?.quantity ?? 0} unités
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.isActive === 1 ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                      }`}>
                        {p.isActive === 1 ? "En ligne" : "Hors ligne"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(p)} title="Modifier" className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => toggleActive(p.id, p.isActive)} title={p.isActive === 1 ? "Désactiver" : "Activer"} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition">
                          {p.isActive === 1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button onClick={() => toggleFeatured(p.id, p.isFeatured)} title={p.isFeatured === 1 ? "Retirer la vedette" : "Mettre en vedette"} className={`p-2 rounded-lg hover:bg-amber-50 transition ${p.isFeatured === 1 ? "text-amber-500" : "text-stone-400 hover:text-amber-500"}`}>
                          <Star className={`h-4 w-4 ${p.isFeatured === 1 ? "fill-amber-500" : ""}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
