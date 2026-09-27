"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LivreurDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.replace("/connexion");
        return;
      }
      const data = await meRes.json();
      const roles = data.roles || [];
      
      if (!roles.includes("LIVREUR") && !roles.includes("SUPER_ADMIN")) {
        router.replace("/");
        return;
      }

      const res = await fetch("/api/livreur/orders");
      if (res.ok) {
        const { orders } = await res.json();
        setOrders(orders);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/livreur/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, trackingNote: newStatus === "DELIVERED" ? "Livré avec succès" : "En cours de livraison" }),
    });
    setOrders((prev) => prev.filter(o => o.id !== id || newStatus !== "DELIVERED"));
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (loading) return <div className="p-10 text-center text-stone-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-stone-100 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-stone-900">Portail Livreur</h1>
            <p className="text-sm text-stone-500">DIVAY BEAUTY — Gestion des expéditions</p>
          </div>
          <button onClick={handleLogout} className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200">
            Déconnexion
          </button>
        </header>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-stone-500 shadow-sm">
              Aucune course en attente. Bon travail !
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rounded-2xl bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-stone-900">{o.orderNumber}</span>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                      {o.status}
                    </span>
                  </div>
                  <p className="font-medium">{o.shippingName}</p>
                  <p className="text-sm text-stone-500">{o.shippingAddress}, {o.shippingCity}</p>
                  <p className="text-sm font-medium text-[#c45c3e] mt-1">📞 {o.shippingPhone}</p>
                  <p className="text-sm text-stone-500 mt-2">Paiement : {o.paymentMethod === 'cod' ? 'À la livraison' : 'Déjà payé'}</p>
                </div>
                
                <div className="flex flex-col gap-2 min-w-[140px]">
                  {o.status !== "SHIPPED" && (
                    <button
                      onClick={() => updateStatus(o.id, "SHIPPED")}
                      className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
                    >
                      Prendre la course
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(o.id, "DELIVERED")}
                    className="rounded-xl bg-[#c45c3e] px-4 py-2 text-sm font-medium text-white hover:bg-[#a84d34]"
                  >
                    Marquer Livré
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
