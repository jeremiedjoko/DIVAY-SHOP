"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { formatFC } from "@/lib/services-catalog";

type Appt = {
  id: string; reference: string; serviceName: string; priceFc: number; date: string; time: string;
  name: string; phone: string; email: string | null; notes: string | null; status: string;
};

const STATUS_LABEL: Record<string, string> = { PENDING: "À confirmer", CONFIRMED: "Confirmé", DONE: "Réalisé", CANCELLED: "Annulé" };
const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800", CONFIRMED: "bg-green-100 text-green-800",
  DONE: "bg-blue-100 text-blue-800", CANCELLED: "bg-stone-100 text-stone-500",
};
const TABS = [
  { key: "todo", label: "À traiter" },
  { key: "upcoming", label: "À venir" },
  { key: "past", label: "Passés" },
  { key: "all", label: "Tous" },
] as const;

export default function AdminReservationsPage() {
  const [items, setItems] = useState<Appt[] | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("todo");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/reservations")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { reservations: Appt[] }) => setItems(d.reservations))
      .catch(() => setError(true));
  }, []);

  async function setStatus(id: string, status: string) {
    setItems((prev) => prev?.map((a) => (a.id === id ? { ...a, status } : a)) ?? prev);
    const res = await fetch("/api/admin/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) setError(true);
  }

  const today = new Date().toISOString().slice(0, 10);
  const list = useMemo(() => {
    const all = items ?? [];
    const filtered = all.filter((a) => {
      if (tab === "todo") return a.status === "PENDING";
      if (tab === "upcoming") return a.date >= today && (a.status === "PENDING" || a.status === "CONFIRMED");
      if (tab === "past") return a.date < today || a.status === "DONE";
      return true;
    });
    // Chronologique pour ce qui vient, antéchronologique pour le passé
    return filtered.sort((a, b) => (tab === "past" ? (b.date + b.time).localeCompare(a.date + a.time) : (a.date + a.time).localeCompare(b.date + b.time)));
  }, [items, tab, today]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div className="border-b border-stone-200 pb-6">
        <h1 className="font-serif text-3xl text-stone-900">Rendez-vous</h1>
        <p className="mt-1 text-sm text-stone-400">Confirmez, contactez et suivez les réservations de vos clientes</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${tab === t.key ? "border-[#c0476b] bg-[#c0476b] text-white" : "border-stone-200 bg-white text-stone-600"}`}>
            {t.label}
            {t.key === "todo" && items && items.filter((a) => a.status === "PENDING").length > 0 && ` (${items.filter((a) => a.status === "PENDING").length})`}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">Une erreur est survenue. Rechargez la page.</p>}
      {!items && !error && <p className="text-sm text-stone-400">Chargement…</p>}
      {items && list.length === 0 && <p className="rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center text-sm text-stone-400">Aucun rendez-vous dans cette catégorie.</p>}

      <ul className="space-y-3">
        {list.map((a) => {
          const digits = a.phone.replace(/[^\d]/g, "");
          return (
            <li key={a.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-stone-900">{a.serviceName} <span className="font-normal text-stone-400">· {formatFC(a.priceFc)}</span></p>
                  <p className="mt-0.5 text-sm text-[#c0476b]">
                    {new Date(`${a.date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {a.time}
                  </p>
                  <p className="mt-1 text-sm text-stone-700">{a.name} · {a.phone}</p>
                  {a.notes && <p className="mt-1 text-xs italic text-stone-500">« {a.notes} »</p>}
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-300">{a.reference}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${STATUS_COLOR[a.status]}`}>{STATUS_LABEL[a.status]}</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={`https://wa.me/${digits}?text=${encodeURIComponent(`Bonjour ${a.name}, c'est Divay Beauty au sujet de votre rendez-vous « ${a.serviceName} » le ${a.date} à ${a.time}.`)}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700">
                  <Phone className="h-3.5 w-3.5" /> Appeler
                </a>
                <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value)} aria-label="Changer le statut"
                  className="ml-auto rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700">
                  {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
