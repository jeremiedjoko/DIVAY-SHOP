"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

type Coupon = {
  id: string;
  code: string;
  discountPct: number | null;
  discountFix: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: number;
};

export default function PromotionsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "pct", value: "", limit: "" });
  const [saving, setSaving] = useState(false);

  async function loadCoupons() {
    const res = await fetch("/api/admin/promotions");
    if (res.ok) setCoupons((await res.json()).coupons);
  }

  useEffect(() => { loadCoupons(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code.toUpperCase(),
        discountPct: form.type === "pct" ? parseInt(form.value) : null,
        discountFix: form.type === "fix" ? Math.round(parseFloat(form.value) * 100) : null,
        usageLimit: form.limit ? parseInt(form.limit) : null,
      }),
    });
    setSaving(false);
    setShowForm(false);
    setForm({ code: "", type: "pct", value: "", limit: "" });
    loadCoupons();
  }

  async function toggleCoupon(id: string, current: number) {
    await fetch(`/api/admin/promotions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: current === 1 ? 0 : 1 }),
    });
    loadCoupons();
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Promotions</h1>
          <p className="text-sm text-stone-400 mt-1">Codes promo et réductions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition"
        >
          <PlusCircle className="h-4 w-4" />
          Créer un code promo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <h2 className="font-serif text-xl mb-4">Nouveau code promo</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Code promo</label>
              <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="EX: DIVAY20" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono uppercase outline-none focus:border-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Type de réduction</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900 bg-white">
                <option value="pct">Pourcentage (%)</option>
                <option value="fix">Montant fixe (USD)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Valeur</label>
              <input required type="number" step={form.type === "pct" ? "1" : "0.01"} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === "pct" ? "20" : "5.00"} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Limite d'utilisation (optionnel)</label>
              <input type="number" value={form.limit} onChange={e => setForm(f => ({ ...f, limit: e.target.value }))} placeholder="Illimité" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900" />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-stone-200 text-sm hover:bg-stone-50 transition">Annuler</button>
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50">
                {saving ? "Création..." : "Créer le code"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        {coupons.length === 0 ? (
          <div className="py-16 text-center text-stone-400 text-sm">Aucun code promo créé.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Réduction</th>
                <th className="px-6 py-4">Utilisations</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-stone-900">{c.code}</td>
                  <td className="px-6 py-4 text-sm text-stone-700">
                    {c.discountPct ? `${c.discountPct}%` : c.discountFix ? `$${(c.discountFix / 100).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    {c.usedCount} / {c.usageLimit ?? "∞"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${c.isActive === 1 ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                      {c.isActive === 1 ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => toggleCoupon(c.id, c.isActive)} className="text-xs font-medium text-stone-500 hover:text-stone-900 transition">
                      {c.isActive === 1 ? "Désactiver" : "Activer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
