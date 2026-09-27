"use client";

import { useEffect, useState } from "react";
import { FileDown, Search, ChevronDown } from "lucide-react";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalMinor: number;
  currency: string;
  createdAt: string;
  user?: { name: string; email: string } | null;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  PROCESSING: "En préparation",
  SHIPPED: "Expédié",
  DELIVERED: "Livré",
  CANCELLED: "Annulé",
  REFUNDED: "Remboursé",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-stone-100 text-stone-500",
};

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(r => r.ok ? r.json() : { orders: [] })
      .then(d => { setOrders(d.orders); setLoading(false); });
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  async function downloadReceipt(orderId: string) {
    const res = await fetch(`/api/admin/orders/${orderId}/receipt`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quittance-${orderId.slice(0, 8)}.pdf`;
    a.click();
  }

  const filtered = orders.filter(o =>
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-stone-200 pb-6">
        <h1 className="font-serif text-3xl text-stone-900">Commandes</h1>
        <p className="text-sm text-stone-400 mt-1">{orders.length} commande{orders.length > 1 ? "s" : ""} au total</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par numéro ou client..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-stone-900 transition"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-400">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-20 text-center">
          <p className="text-stone-400 text-sm">Aucune commande pour le moment.</p>
          <p className="text-stone-300 text-xs mt-1">Elles apparaîtront ici dès que le checkout sera actif (Phase 4).</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-stone-100 bg-stone-50">
                <tr className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                  <th className="px-6 py-4">Commande</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-stone-700">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-stone-900">{order.user?.name ?? "—"}</p>
                      <p className="text-xs text-stone-400">{order.user?.email ?? ""}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-stone-900">
                      ${(order.totalMinor / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status] ?? "bg-stone-100 text-stone-500"}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => downloadReceipt(order.id)}
                          title="Télécharger la quittance PDF"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          Quittance
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
