"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CalendarDays, Download, Package, ShoppingBag, Tag, TrendingUp, Wallet } from "lucide-react";
import { formatFC } from "@/lib/services-catalog";

const RevenueChart = dynamic(() => import("@/components/admin/RevenueChart"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-stone-100" />,
});

type Stats = {
  year: number;
  months: { month: number; shopFc: number; servicesFc: number; totalFc: number; orders: number; appointments: number }[];
  totals: { shopFc: number; servicesFc: number; totalFc: number; orders: number; appointments: number };
};
type Snapshot = {
  pendingOrders: number;
  toShip: number;
  pendingAppointments: number;
  upcomingAppointments: { id: string; reference: string; name: string; serviceName: string; date: string; time: string; status: string }[];
  recentOrders: { id: string; orderNumber: string; name: string; totalFc: number; status: string; createdAt: string }[];
};

const ORDER_LABEL: Record<string, string> = {
  PENDING: "En attente", PAID: "Payée", PROCESSING: "En préparation", SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée",
};

export default function AdminDashboard() {
  const [data, setData] = useState<{ stats: Stats; snapshot: Snapshot } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="p-8 text-sm text-red-600">Impossible de charger le tableau de bord.</p>;
  if (!data) return <div className="p-8 text-sm text-stone-400">Chargement…</div>;

  const { stats, snapshot } = data;
  const curMonth = new Date().getMonth() + 1;
  const m = stats.months[curMonth - 1];
  const now = new Date();
  const monthLabel = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const kpis = [
    { label: `CA ${monthLabel}`, value: formatFC(m.totalFc), sub: `${m.orders} commande(s) · ${m.appointments} rendez-vous réalisé(s)`, icon: TrendingUp },
    { label: `CA ${stats.year}`, value: formatFC(stats.totals.totalFc), sub: `Boutique ${formatFC(stats.totals.shopFc)}`, icon: Wallet },
    { label: "Commandes à traiter", value: String(snapshot.pendingOrders + snapshot.toShip), sub: `${snapshot.pendingOrders} en attente · ${snapshot.toShip} à préparer`, icon: ShoppingBag },
    { label: "Rendez-vous à confirmer", value: String(snapshot.pendingAppointments), sub: `${snapshot.upcomingAppointments.length} à venir`, icon: CalendarDays },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-stone-400">Vue d&apos;ensemble de votre activité</p>
        </div>
        <a
          href={`/api/admin/reports/export?year=${now.getFullYear()}&month=${curMonth}`}
          className="flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          <Download className="h-4 w-4" /> Rapport PDF du mois
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">{k.label}</p>
              <k.icon className="h-4 w-4 text-[#c0476b]" />
            </div>
            <p className="mt-3 font-serif text-2xl text-stone-900">{k.value}</p>
            <p className="mt-2 text-xs text-stone-400">{k.sub}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-stone-900">Chiffre d&apos;affaires {stats.year}</h2>
          <Link href="/admin/rapports" className="text-xs font-semibold text-[#c0476b] hover:underline">Voir les rapports →</Link>
        </div>
        <RevenueChart months={stats.months} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl text-stone-900">Prochains rendez-vous</h2>
            <Link href="/admin/reservations" className="text-xs font-semibold text-[#c0476b] hover:underline">Tout voir →</Link>
          </div>
          {snapshot.upcomingAppointments.length === 0 && <p className="py-4 text-sm text-stone-400">Aucun rendez-vous à venir.</p>}
          <ul className="divide-y divide-stone-100">
            {snapshot.upcomingAppointments.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stone-800">{a.name} · {a.serviceName}</p>
                  <p className="text-xs text-stone-400">{new Date(`${a.date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })} à {a.time}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${a.status === "CONFIRMED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                  {a.status === "CONFIRMED" ? "Confirmé" : "À confirmer"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl text-stone-900">Dernières commandes</h2>
            <Link href="/admin/commandes" className="text-xs font-semibold text-[#c0476b] hover:underline">Tout voir →</Link>
          </div>
          {snapshot.recentOrders.length === 0 && <p className="py-4 text-sm text-stone-400">Aucune commande pour le moment.</p>}
          <ul className="divide-y divide-stone-100">
            {snapshot.recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stone-800">{o.orderNumber} · {o.name}</p>
                  <p className="text-xs text-stone-400">{ORDER_LABEL[o.status] ?? o.status}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-[#c0476b]">{formatFC(o.totalFc)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { href: "/admin/catalogue", label: "Ajouter un produit", icon: Package },
          { href: "/admin/promotions", label: "Créer une promotion", icon: Tag },
          { href: "/admin/reservations", label: "Gérer les rendez-vous", icon: CalendarDays },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#c0476b]">
            <a.icon className="h-5 w-5 text-[#c0476b]" /> {a.label}
          </Link>
        ))}
      </section>
    </div>
  );
}
