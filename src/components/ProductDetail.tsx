"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Price } from "@/components/Price";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/types";

type Props = { product: Product; related: Product[] };

export function ProductDetail({ product, related }: Props) {
  const router = useRouter();
  const { setCheckoutSession } = useCart();

  const stockStatus =
    product.stock === 0
      ? { label: "Rupture de stock", cls: "bg-red-100 text-red-700" }
      : product.stock <= 3
        ? { label: `Dernières pièces — ${product.stock} restantes`, cls: "bg-amber-100 text-amber-700" }
        : { label: `En stock (${product.stock} disponibles)`, cls: "bg-green-100 text-green-700" };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Fil d'Ariane */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="hover:text-stone-800">Accueil</Link>
        <span>›</span>
        <Link href="/boutique" className="hover:text-stone-800">Boutique</Link>
        <span>›</span>
        <Link href={`/boutique?cat=${encodeURIComponent(product.category)}`} className="hover:text-stone-800">
          {product.category}
        </Link>
        <span>›</span>
        <span className="text-stone-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <span className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white">
                Rupture de stock
              </span>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c0476b]">
              {product.category}
            </p>
            <h1 className="mt-2 font-serif text-4xl text-stone-900">{product.name}</h1>
            <p className="mt-4 text-3xl font-bold text-stone-900">
              <Price priceUsdCents={product.priceCents} />
            </p>
          </div>

          {/* Badge stock */}
          <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${stockStatus.cls}`}>
            {stockStatus.label}
          </span>

          {/* Description */}
          <p className="leading-relaxed text-stone-600">{product.description}</p>

          {/* Boutons */}
          {product.stock > 0 ? (
            <div className="flex flex-col gap-3">
              {/* Acheter maintenant — va direct au checkout sans toucher le panier */}
              <button
                onClick={() => {
                  setCheckoutSession([{
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    priceCents: product.priceCents,
                    image: product.image,
                    quantity: 1,
                  }]);
                  router.push("/commande?mode=express");
                }}
                className="w-full rounded-full bg-[#c0476b] py-3 text-sm font-semibold text-white hover:bg-[#9e3457] transition"
              >
                Acheter maintenant
              </button>
              {/* Ajouter au panier — comportement classique */}
              <AddToCartButton product={product} />
            </div>
          ) : (
            <button disabled className="w-full rounded-full bg-stone-200 py-3 text-sm font-semibold text-stone-400 cursor-not-allowed">
              Indisponible
            </button>
          )}

          {/* Garanties */}
          <div className="space-y-3 border-t border-stone-100 pt-5">
            {[
              { text: "Livraison express à Kinshasa sous 24h" },
              { text: "Paiement sécurisé en ligne ou à la livraison" },
              { text: "Produit authentique — satisfaction garantie" },
            ].map(({ text }) => (
              <p key={text} className="flex items-center gap-3 text-sm text-stone-500">
                <svg className="h-4 w-4 shrink-0 text-[#c0476b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                {text}
              </p>
            ))}
          </div>

          {/* Partager */}
          <div className="flex items-center gap-3 border-t border-stone-100 pt-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Partager</span>
            <a
              href={`https://wa.me/?text=Regarde ce produit sur DIVAY BEAUTY : ${product.name} — ${typeof window !== "undefined" ? window.location.href : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-xs font-medium text-stone-600 hover:border-stone-400 hover:text-stone-900 transition"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
            <button
              onClick={() => navigator.clipboard?.writeText(typeof window !== "undefined" ? window.location.href : "")}
              className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-xs font-medium text-stone-600 hover:border-stone-400 hover:text-stone-900 transition"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              Copier le lien
            </button>
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl text-stone-900">Vous aimerez aussi</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
