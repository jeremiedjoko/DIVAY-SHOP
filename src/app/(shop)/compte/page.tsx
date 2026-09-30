"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/types";
import { formatMoney } from "@/lib/currency";
import { ORDER_TIMELINE, ORDER_STATUS_LABELS, timelineIndex } from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";

type AuthUser = { id: string; name: string; email: string; phone?: string; createdAt: string };

type Appointment = {
  id: string; reference: string; serviceName: string; priceFc: number;
  date: string; time: string; status: string;
};

const APPT_LABEL: Record<string, string> = { PENDING: "En attente de confirmation", CONFIRMED: "Confirmé", DONE: "Réalisé", CANCELLED: "Annulé" };
const APPT_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800", CONFIRMED: "bg-green-100 text-green-800",
  DONE: "bg-blue-100 text-blue-800", CANCELLED: "bg-stone-100 text-stone-500",
};

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
      const apptRes = await fetch("/api/account/reservations");
      if (apptRes.ok) {
        const apptData = (await apptRes.json()) as { reservations: Appointment[] };
        setAppointments(apptData.reservations);
      }
      setLoading(false);
    }
    void load();
  }, [router]);

  async function cancelAppointment(id: string) {
    if (!window.confirm("Annuler ce rendez-vous ?")) return;
    const res = await fetch("/api/account/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a)));
  }

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

      {/* Résumé */}
      <section className="mt-8 grid grid-cols-3 gap-3">
        {[
          { label: "Commandes", value: String(orders.filter((o) => o.status !== "cancelled").length) },
          { label: "Total dépensé", value: formatMoney(orders.filter((o) => ["paid", "processing", "shipped", "delivered"].includes(o.status)).reduce((s, o) => s + (o.totalMinor ?? o.totalCents), 0)) },
          { label: "Rendez-vous", value: String(appointments.filter((a) => a.status !== "CANCELLED").length) },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-stone-200 bg-white p-4 text-center">
            <p className="font-serif text-lg text-[#c0476b] sm:text-2xl">{k.value}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">{k.label}</p>
          </div>
        ))}
      </section>

      {/* Commandes */}
      <section id="commandes" className="mt-8 scroll-mt-28">
        <h2 className="font-serif text-xl text-stone-900">
          Mes commandes ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <p className="text-stone-500">Aucune commande pour l&apos;instant.</p>
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
                        {order.orderNumber ?? `#${order.id.slice(0, 8).toUpperCase()}`}
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
                       {formatMoney(order.totalMinor ?? order.totalCents)}
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
                          {formatMoney((line.unitMinor ?? line.priceCents) * line.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {status === "cancelled" ? (
                    <p className="mx-5 my-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">Cette commande a été annulée.</p>
                  ) : (
                    <ol className="mx-5 my-4 flex items-start" aria-label="Suivi de la commande">
                      {ORDER_TIMELINE.map((step, i) => {
                        const reached = i <= timelineIndex(status as OrderStatus);
                        return (
                          <li key={step} className="flex flex-1 flex-col items-center text-center">
                            <div className="flex w-full items-center">
                              <span className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : reached ? "bg-[#c0476b]" : "bg-stone-200"}`} />
                              <span className={`h-3 w-3 shrink-0 rounded-full ${reached ? "bg-[#c0476b]" : "bg-stone-200"}`} />
                              <span className={`h-0.5 flex-1 ${i === ORDER_TIMELINE.length - 1 ? "opacity-0" : i < timelineIndex(status as OrderStatus) ? "bg-[#c0476b]" : "bg-stone-200"}`} />
                            </div>
                            <span className={`mt-1.5 text-[9px] leading-tight sm:text-[10px] ${reached ? "font-semibold text-[#c0476b]" : "text-stone-400"}`}>
                              {ORDER_STATUS_LABELS[step]}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  )}

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

      {/* Rendez-vous */}
      <section id="rendez-vous" className="mt-10 scroll-mt-28">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-stone-900">Mes rendez-vous ({appointments.length})</h2>
          <Link href="/reservation" className="text-xs font-semibold text-[#c0476b] hover:underline">Prendre rendez-vous →</Link>
        </div>
        {appointments.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <p className="text-stone-500">Aucun rendez-vous pour l&apos;instant.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {appointments.map((a) => {
              const upcoming = a.date > new Date().toISOString().slice(0, 10) && (a.status === "PENDING" || a.status === "CONFIRMED");
              return (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4">
                  <div>
                    <p className="text-sm font-bold text-stone-900">{a.serviceName}</p>
                    <p className="text-xs text-[#c0476b]">
                      {new Date(`${a.date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {a.time}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-stone-400">{a.reference}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${APPT_COLOR[a.status]}`}>{APPT_LABEL[a.status]}</span>
                    {upcoming && (
                      <button onClick={() => cancelAppointment(a.id)} className="text-xs font-semibold text-stone-400 underline hover:text-red-600">Annuler</button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
