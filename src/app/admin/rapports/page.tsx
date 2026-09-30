"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { formatFC } from "@/lib/services-catalog";

const RevenueChart = dynamic(() => import("@/components/admin/RevenueChart"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-stone-100" />,
});

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

type Ranked = { name: string; qty: number; revenueFc: number };
type Stats = {
  year: number;
  years: number[];
  months: { month: number; shopFc: number; servicesFc: number; totalFc: number; orders: number; appointments: number }[];
  totals: { shopFc: number; servicesFc: number; totalFc: number; orders: number; appointments: number };
  topProducts: Ranked[];
  topServices: Ranked[];
};

export default function RapportsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/stats?year=${year}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { stats: Stats }) => active && (setStats(d.stats), setError(false)))
      .catch(() => active && setError(true));
    return () => { active = false; };
  }, [year]);

  const avgBasket = stats && stats.totals.orders > 0 ? Math.round(stats.totals.shopFc / stats.totals.orders) : 0;
  const best = stats ? [...stats.months].sort((a, b) => b.totalFc - a.totalFc)[0] : null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Rapports & chiffre d&apos;affaires</h1>
          <p className="mt-1 text-sm text-stone-400">Boutique + prestations réalisées, par mois et par année</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm" aria-label="Année">
            {(stats?.years ?? [year]).map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm" aria-label="Mois du rapport">
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <a
            href={`/api/admin/reports/export?year=${year}&month=${month}`}
            className="flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <Download className="h-4 w-4" /> Rapport PDF
          </a>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">Impossible de charger les statistiques.</p>}
      {!stats && !error && <p className="text-sm text-stone-400">Chargement…</p>}

      {stats && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: `CA ${stats.year}`, value: formatFC(stats.totals.totalFc), sub: "Boutique + prestations" },
              { label: "Boutique", value: formatFC(stats.totals.shopFc), sub: `${stats.totals.orders} commande(s)` },
              { label: "Prestations", value: formatFC(stats.totals.servicesFc), sub: `${stats.totals.appointments} rendez-vous réalisé(s)` },
              { label: "Panier moyen", value: formatFC(avgBasket), sub: best && best.totalFc > 0 ? `Meilleur mois : ${MONTHS[best.month - 1]}` : "—" },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">{k.label}</p>
                <p className="mt-3 font-serif text-2xl text-stone-900">{k.value}</p>
                <p className="mt-2 text-xs text-stone-400">{k.sub}</p>
              </div>
            ))}
          </div>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-serif text-xl text-stone-900">Évolution mensuelle {stats.year}</h2>
            <RevenueChart months={stats.months} />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {[{ title: "Produits les plus vendus", rows: stats.topProducts, unit: "vendu(s)" }, { title: "Prestations les plus réalisées", rows: stats.topServices, unit: "fois" }].map((b) => (
              <section key={b.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 font-serif text-xl text-stone-900">{b.title}</h2>
                {b.rows.length === 0 && <p className="py-4 text-sm text-stone-400">Pas encore de données.</p>}
                <ul className="divide-y divide-stone-100">
                  {b.rows.map((r) => (
                    <li key={r.name} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-800">{r.name}</p>
                        <p className="text-xs text-stone-400">{r.qty} {b.unit}</p>
                      </div>
                      <span className="text-sm font-bold text-[#c0476b]">{formatFC(r.revenueFc)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <section className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left text-[11px] uppercase tracking-wider text-stone-400">
                  <th className="px-5 py-3">Mois</th><th className="px-3 py-3 text-right">Boutique</th><th className="px-3 py-3 text-right">Prestations</th><th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.months.map((m) => (
                  <tr key={m.month} className="border-b border-stone-50 last:border-0">
                    <td className="px-5 py-3 font-medium text-stone-700">{MONTHS[m.month - 1]}</td>
                    <td className="px-3 py-3 text-right text-stone-600">{formatFC(m.shopFc)}</td>
                    <td className="px-3 py-3 text-right text-stone-600">{formatFC(m.servicesFc)}</td>
                    <td className="px-5 py-3 text-right font-bold text-stone-900">{formatFC(m.totalFc)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <p className="text-xs text-stone-400">Le CA compte les commandes payées, en préparation, expédiées ou livrées, et les rendez-vous marqués « réalisé ».</p>
        </>
      )}
    </div>
  );
}
