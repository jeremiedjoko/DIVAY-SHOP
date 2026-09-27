"use client";

import { useState } from "react";
import type { Order } from "@/lib/types";
import { ORDER_STATUS_LABELS, ORDER_TIMELINE, timelineIndex } from "@/lib/order-status";
import { formatMoney } from "@/lib/currency";

export default function SuiviClient({ initialOrder = "" }: { initialOrder?: string }) {
  const [orderId, setOrderId] = useState(initialOrder);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders/track?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`
      );
      if (res.status === 404 || res.status === 400) {
        setError("Commande introuvable. Vérifiez le numéro et l'e-mail.");
        return;
      }
      if (!res.ok) {
        setError("Erreur serveur. Réessayez.");
        return;
      }
      const data = (await res.json()) as { order: Order };
      setOrder(data.order);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const statusIdx = order ? timelineIndex(order.status) : -1;

  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c0476b]">
          DIVAY BEAUTY
        </p>
        <h1 className="mt-2 font-serif text-3xl text-stone-900">
          Suivi de commande
        </h1>
        <p className="mt-2 text-stone-500">
          Entrez votre numéro de commande et l'e-mail utilisé lors de la commande.
        </p>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-stone-700">Numéro de commande</span>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              placeholder="ex. DIV-ABC12345…"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-900/10 font-mono text-sm uppercase"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-stone-700">E-mail de commande</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-900/10"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-stone-900 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
          >
            {loading ? "Recherche…" : "Suivre ma commande"}
          </button>
        </form>

        {order && (
          <div className="mt-8 space-y-6 border-t border-stone-100 pt-6">
            {/* Statut */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-stone-500">Statut</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {ORDER_STATUS_LABELS[order.status.toLowerCase() as keyof typeof ORDER_STATUS_LABELS] || order.status}
                </span>
              </div>

              {/* Timeline */}
              {order.status !== "cancelled" && (
                <div className="mt-4 flex items-center gap-0">
                  {ORDER_TIMELINE.map((step, i) => (
                    <div key={step} className="flex flex-1 flex-col items-center">
                      <div className="flex w-full items-center">
                        {i > 0 && (
                          <div
                            className={`h-0.5 flex-1 ${
                              i <= statusIdx ? "bg-[#c0476b]" : "bg-stone-200"
                            }`}
                          />
                        )}
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            i < statusIdx
                              ? "bg-[#c0476b] text-white"
                              : i === statusIdx
                                ? "bg-stone-900 text-white"
                                : "bg-stone-200 text-stone-500"
                          }`}
                        >
                          {i < statusIdx ? "✓" : i + 1}
                        </div>
                        {i < ORDER_TIMELINE.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 ${
                              i < statusIdx ? "bg-[#c0476b]" : "bg-stone-200"
                            }`}
                          />
                        )}
                      </div>
                      <p className="mt-1 text-center text-[10px] text-stone-500 leading-tight px-0.5">
                        {ORDER_STATUS_LABELS[step]}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {order.trackingNote && (
                <p className="mt-3 rounded-lg bg-stone-50 px-4 py-2 text-sm text-stone-600">
                  Note : {order.trackingNote}
                </p>
              )}
            </div>

            {/* Infos commande */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Numéro</span>
                <span className="font-mono text-xs text-stone-700 break-all max-w-[60%] text-right">
                  {order.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Paiement</span>
                <span>
                  {order.paymentMethod === "card" ? "Carte bancaire" : "À la livraison"}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatMoney(order.totalMinor, order.currency)}</span>
              </div>
            </div>

            {/* Articles */}
            <div>
              <p className="mb-2 text-sm font-medium text-stone-700">Articles commandés</p>
              <ul className="space-y-2">
                {order.lines.map((line, i) => (
                  <li key={i} className="flex justify-between text-sm text-stone-600">
                    <span>
                      {line.name}{" "}
                      <span className="text-stone-400">×{line.quantity}</span>
                    </span>
                    <span>{formatMoney(line.unitMinor * line.quantity, order.currency)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
