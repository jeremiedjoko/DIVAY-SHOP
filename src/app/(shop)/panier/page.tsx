"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { CartTotal } from "@/components/CartTotal";
import { useCart } from "@/store/cart";

export default function PanierPage() {
  const router = useRouter();
  const { items, setQuantity, removeItem, itemCount } = useCart();

  if (itemCount() === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-28 text-center sm:px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f4]">
            <ShoppingBag className="h-9 w-9 text-[#c0476b]" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl text-[#2a1c15]">Votre panier est vide</h1>
          <p className="text-stone-500">Découvrez notre boutique artisanale.</p>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]"
          >
            Découvrir la boutique <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fdfbf7] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-4xl text-[#2a1c15]">Mon Panier</h1>
        <p className="mt-1 text-sm text-stone-500">{itemCount()} article{itemCount() > 1 ? "s" : ""}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Liste articles */}
          <div className="lg:col-span-2">
            <ul className="divide-y divide-[#f0dde6] rounded-2xl border border-[#f0dde6] bg-white overflow-hidden">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 p-4 sm:p-5">
                  {/* Image */}
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#fff0f4]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/produit/${item.slug}`} className="font-serif text-base font-semibold text-[#2a1c15] hover:text-[#c0476b] transition">
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="shrink-0 text-stone-300 hover:text-red-500 transition"
                        aria-label="Retirer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantité */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#f0dde6] text-[#2a1c15] hover:border-[#c0476b] transition"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          aria-label="Diminuer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#f0dde6] text-[#2a1c15] hover:border-[#c0476b] transition"
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          aria-label="Augmenter"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {/* Prix ligne */}
                      <span className="font-bold text-[#c0476b]">
                        {((item.priceCents * item.quantity) / 100).toLocaleString("fr-FR")} FC
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Link href="/boutique" className="mt-4 inline-flex items-center gap-1 text-xs text-stone-400 hover:text-[#c0476b] transition">
              ← Continuer mes achats
            </Link>
          </div>

          {/* Récap commande */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[#f0dde6] bg-white p-6 sticky top-24">
              <h2 className="font-serif text-xl text-[#2a1c15]">Récapitulatif</h2>
              <div className="mt-4 space-y-3 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <CartTotal />
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Livraison</span>
                  <span>À calculer</span>
                </div>
              </div>
              <div className="my-4 border-t border-[#f0dde6]" />
              <div className="flex justify-between font-bold text-[#2a1c15]">
                <span>Total</span>
                <CartTotal />
              </div>
              <Link
                href="/commande"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#c0476b] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457] w-full"
              >
                Passer commande <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
