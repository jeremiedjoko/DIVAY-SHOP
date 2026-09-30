"use client";

import { useEffect, useState } from "react";
import { formatFC } from "@/lib/services-catalog";

type Client = { id: string; name: string; email: string; phone: string | null; createdAt: string; orders: number; spentFc: number; appointments: number };

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { clients: Client[] }) => setClients(d.clients))
      .catch(() => setError(true));
  }, []);

  const shown = (clients ?? []).filter((c) => `${c.name} ${c.email} ${c.phone ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div className="border-b border-stone-200 pb-6">
        <h1 className="font-serif text-3xl text-stone-900">Clientes</h1>
        <p className="mt-1 text-sm text-stone-400">Vos clientes inscrites, classées par montant dépensé</p>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un nom, un e-mail, un téléphone…"
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-base outline-none focus:border-[#c0476b]" />
      {error && <p className="text-sm text-red-600">Impossible de charger les clientes.</p>}
      {!clients && !error && <p className="text-sm text-stone-400">Chargement…</p>}
      {clients && shown.length === 0 && <p className="rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center text-sm text-stone-400">Aucune cliente trouvée.</p>}
      <ul className="space-y-3">
        {shown.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-stone-900">{c.name}</p>
              <p className="truncate text-xs text-stone-500">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>
              <p className="mt-0.5 text-[11px] text-stone-400">Inscrite le {new Date(c.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#c0476b]">{formatFC(c.spentFc)}</p>
              <p className="text-[11px] text-stone-400">{c.orders} commande(s) · {c.appointments} rendez-vous</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
