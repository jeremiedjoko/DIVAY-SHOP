"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Price } from "@/components/Price";
import { CartTotal } from "@/components/CartTotal";
import { useCart } from "@/store/cart";

export default function PanierPage() {
  const router = useRouter();
  const { items, setQuantity, removeItem, itemCount, setCheckoutSession } = useCart();

  // Commande Express d'un seul article depuis le panier
  function orderSingle(productId: string) {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    setCheckoutSession([item]);
    router.push("/commande?mode=express");
  }

  if (itemCount() === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl">Votre panier est vide</h1>
        <p className="mt-3 text-stone-600">Découvrez la sélection DIVAY BEAUTY.</p>
        <Link
          href="/boutique"
          className="mt-8 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Parcourir la boutique
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl text-stone-900">Panier</h1>
      <ul className="mt-8 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
        {items.map((item) => (
          <li key={item.productId} className="flex flex-wrap gap-4 p-4 sm:flex-nowrap sm:items-center">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/produit/${item.slug}`} className="font-medium hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-stone-500">
                <Price priceUsdCents={item.priceUsdCents} />
              </p>
            </div>

            {/* Quantité */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-8 w-8 rounded-full border border-stone-300"
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                aria-label="Diminuer"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                className="h-8 w-8 rounded-full border border-stone-300"
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                aria-label="Augmenter"
              >
                +
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Commander cet article uniquement */}
              <button
                type="button"
                onClick={() => orderSingle(item.productId)}
                className="rounded-full bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-700 transition"
              >
                Commander
              </button>
              <button
                type="button"
                className="text-sm text-stone-400 hover:text-red-500 transition"
                onClick={() => removeItem(item.productId)}
              >
                Retirer
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-end gap-4">
        <p className="text-xl font-semibold">
          Total : <CartTotal />
        </p>
        {/* Commander TOUT le panier */}
        <Link
          href="/commande"
          onClick={() => setCheckoutSession(null)}
          className="rounded-full bg-[#c0476b] px-8 py-3 text-sm font-semibold text-white hover:bg-[#9e3457] transition"
        >
          Tout commander
        </Link>
      </div>
    </main>
  );
}
