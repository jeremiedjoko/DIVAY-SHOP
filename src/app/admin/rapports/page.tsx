"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Données de démonstration — seront remplacées par de vraies données en Phase 4
const demoData = [
  { month: "Avr", revenue: 0 },
  { month: "Mai", revenue: 0 },
  { month: "Juin", revenue: 0 },
  { month: "Juil", revenue: 0 },
  { month: "Août", revenue: 0 },
  { month: "Sep", revenue: 0 },
];

export default function RapportsPage() {
  const [exporting, setExporting] = useState(false);

  async function exportPDF() {
    setExporting(true);
    const res = await fetch("/api/admin/reports/export");
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport-divay-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
    }
    setExporting(false);
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Rapports & Chiffre d'affaires</h1>
          <p className="text-sm text-stone-400 mt-1">Analyse des ventes et performance commerciale</p>
        </div>
        <button
          onClick={exportPDF}
          disabled={exporting}
          className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {exporting ? "Génération..." : "Exporter PDF"}
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CA Total", value: "$0.00", sub: "Toutes périodes" },
          { label: "CA ce mois", value: "$0.00", sub: "Septembre 2026" },
          { label: "Commandes", value: "0", sub: "Phase 4 en cours" },
          { label: "Panier moyen", value: "$0.00", sub: "—" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{k.label}</p>
            <p className="text-3xl font-serif mt-3 text-stone-900">{k.value}</p>
            <p className="text-xs text-stone-400 mt-2">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-6">
          Évolution du chiffre d'affaires (6 derniers mois)
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={demoData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c0476b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#c0476b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ece8" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e7e4e0", fontSize: "12px" }}
              formatter={(v) => [`$${Number(v ?? 0).toFixed(2)}`, "CA"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#c0476b" strokeWidth={2} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-center text-xs text-stone-300 mt-2">
          Le graphique se remplira automatiquement dès les premières commandes (Phase 4 — Checkout)
        </p>
      </div>
    </div>
  );
}
