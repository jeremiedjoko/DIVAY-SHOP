"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { CartTotal } from "@/components/CartTotal";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";

type PaymentMethod = "card" | "cod";

// ─── Composant interne qui utilise useSearchParams ─────────────────────────
function CommandeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExpress = searchParams.get("mode") === "express";

  const { items: cartItems, itemCount, clear, checkoutSession, setCheckoutSession } = useCart();
  const currency = useCurrency((s) => s.currency);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // En mode express : utiliser la session ; sinon, tout le panier
  const items = isExpress && checkoutSession ? checkoutSession : cartItems;

  if (!isExpress && itemCount() === 0) {
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-stone-600">Panier vide.</p>
        <Link href="/boutique" className="mt-4 inline-block text-[#c0476b] hover:underline">
          Retour boutique
        </Link>
      </main>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const customer = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      city: String(form.get("city") ?? ""),
      postalCode: String(form.get("postalCode") ?? ""),
      paymentMethod: payment,
    };
    const couponCode = String(form.get("couponCode") ?? "").trim();
    const payload = { items, customer, currency, couponCode };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { orderId?: string; url?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Commande impossible.");
      }

      // En mode express : vider seulement la session, le panier reste intact
      if (isExpress) {
        setCheckoutSession(null);
      } else {
        clear();
      }

      if (payment === "card" && data.url) {
        window.location.href = data.url;
      } else {
        router.push(`/commande/succes?order=${data.orderId}&mode=${payment}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl text-stone-900">Commande</h1>
      {isExpress && (
        <p className="mt-1 text-sm font-medium text-[#c0476b] uppercase tracking-wide">
          Achat direct — {items.length} article{items.length > 1 ? "s" : ""}
        </p>
      )}
      <p className="mt-2 text-stone-600">
        Total ({currency === "USD" ? "dollars" : "francs congolais"}) : <CartTotal overrideItems={isExpress ? items : undefined} />
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <fieldset className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
          <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Coordonnées
          </legend>
          {(
            [
              ["name", "Nom complet", "text"],
              ["email", "E-mail", "email"],
              ["phone", "Téléphone", "tel"],
              ["address", "Adresse", "text"],
              ["postalCode", "Code postal / commune", "text"],
              ["city", "Ville", "text"],
            ] as const
          ).map(([id, label, type]) => (
            <label key={id} className="block text-sm">
              <span className="text-stone-600">{label}</span>
              <input
                name={id}
                type={type}
                required
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none ring-stone-900 focus:ring-2"
              />
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
          <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Code Promo
          </legend>
          <label className="block text-sm">
            <span className="text-stone-600">Code de réduction (Optionnel)</span>
            <input
              name="couponCode"
              type="text"
              placeholder="Ex: DIVAY20"
              className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 uppercase outline-none ring-stone-900 focus:ring-2"
            />
          </label>
        </fieldset>

        <fieldset className="space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
          <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Paiement
          </legend>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 p-4 transition has-[:checked]:border-stone-900 has-[:checked]:bg-stone-50">
            <input
              type="radio"
              name="payment"
              checked={payment === "card"}
              onChange={() => setPayment("card")}
              className="mt-1"
            />
            <span>
              <span className="font-medium">Carte bancaire</span>
              <span className="block text-sm text-stone-400 mt-0.5">
                Paiement en ligne rapide et sécurisé.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 p-4 transition has-[:checked]:border-stone-900 has-[:checked]:bg-stone-50">
            <input
              type="radio"
              name="payment"
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
              className="mt-1"
            />
            <span>
              <span className="font-medium">Paiement à la livraison</span>
              <span className="block text-sm text-stone-400 mt-0.5">
                Réglez à la réception de votre commande.
              </span>
            </span>
          </label>
        </fieldset>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-stone-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? "Patientez…"
            : payment === "card"
              ? "Payer en ligne"
              : "Confirmer la commande"}
        </button>
      </form>
    </main>
  );
}

// ─── Page exportée — enveloppe dans Suspense (requis par useSearchParams) ──
export default function CommandePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-400">Chargement…</div>}>
      <CommandeForm />
    </Suspense>
  );
}
