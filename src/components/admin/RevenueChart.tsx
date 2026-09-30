"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SHORT = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

export type ChartMonth = { month: number; shopFc: number; servicesFc: number };

export default function RevenueChart({ months }: { months: ChartMonth[] }) {
  const data = months.map((m) => ({ name: SHORT[m.month - 1], Boutique: m.shopFc, Prestations: m.servicesFc }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} width={56}
            tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)} k` : String(v))} />
          <Tooltip formatter={(v) => `${Number(v).toLocaleString("fr-FR")} FC`} cursor={{ fill: "#fff0f4" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Boutique" stackId="a" fill="#c0476b" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Prestations" stackId="a" fill="#e8a5bb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
