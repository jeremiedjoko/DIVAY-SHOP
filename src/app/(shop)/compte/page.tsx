"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/types";
import { formatMoney } from "@/lib/currency";

type AuthUser = { id: string; name: string; email: string; phone?: string; createdAt: string };

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

export default function ComptePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.replace("/connexion");
        return;
      }
      const meData = (await meRes.json()) as { user: AuthUser; roles?: string[] };

      const roles: string[] = meData.roles ?? [];
      if (roles.includes("SUPER_ADMIN") || roles.includes("VENDEUSE")) {
        router.replace("/admin");
        return;
      }

      setUser(meData.user);

      const ordersRes = await fetch("/api/account/orders");
      if (ordersRes.ok) {
        const ordersData = (await ordersRes.json()) as { orders: Order[] };
        setOrders(ordersData.orders);
      }
      setLoading(false);
    }
    void load();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center text-stone-500">
        Chargement…
      </main>
    );
  }

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c0476b]">
            Mon espace
          </p>
          <h1 className="mt-1 font-serif text-3xl text-stone-900">
            Bonjour, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-stone-500">Membre depuis {memberSince}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 transition hover:border-red-300 hover:text-red-600"
        >
          Déconnexion
        </button>
      </div>

      {/* Profil */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-serif text-xl text-stone-900">Informations</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Nom", value: user.name },
            { label: "E-mail", value: user.email },
            { label: "Téléphone", value: user.phone ?? "Non renseigné" },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {label}
              </dt>
              <dd className="mt-1 text-sm text-stone-700">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Commandes */}
      <section className="mt-8">
        <h2 className="font-serif text-xl text-stone-900">
          Mes commandes ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <p className="text-stone-500">Aucune commande pour l'instant.</p>
            <Link
              href="/boutique"
              className="mt-4 inline-block rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.map((order) => {
              const status = (order.status ?? "pending").toLowerCase();
              const statusLabel = STATUS_LABEL[status] ?? status;
              const statusClass = STATUS_COLOR[status] ?? "bg-stone-100 text-stone-700";
              const orderDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              const paymentLabel =
                order.paymentMethod === "card" ? "Carte bancaire" : "Paiement à la livraison";

              return (
                <li
                  key={order.id}
                  className="rounded-2xl border border-stone-200 bg-white overflow-hidden"
                >
                  {/* En-tête de commande */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-stone-50/60 px-5 py-3">
                    <div>
                      <p className="font-mono text-xs font-semibold text-stone-500">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-400">
                        {orderDate} · {paymentLabel}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                        {statusLabel}
                      </span>
                      <span className="text-sm font-bold text-stone-900">
                        {formatMoney(order.totalMinor, order.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Articles */}
                  <ul className="divide-y divide-stone-100 px-5">
                    {order.lines.map((line, i) => (
                      <li key={i} className="flex items-center justify-between py-3 text-sm">
                        <span className="text-stone-700">
                          <span className="font-medium">{line.name}</span>
                          <span className="ml-2 text-stone-400">×{line.quantity}</span>
                        </span>
                        <span className="font-semibold text-stone-900">
                          {formatMoney(line.unitMinor * line.quantity, order.currency)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {order.trackingNote && (
                    <p className="mx-5 mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                      📦 {order.trackingNote}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
