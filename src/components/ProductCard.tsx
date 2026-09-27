import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";
import { Price } from "./Price";

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock === 0;
  const isLow = product.stock > 0 && product.stock <= 3;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/produit/${product.slug}`} className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition duration-500 group-hover:scale-105 ${isOutOfStock ? "opacity-60 grayscale" : ""}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isOutOfStock && (
            <span className="rounded-full bg-red-700/90 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              Rupture
            </span>
          )}
          {isLow && (
            <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              Dernières pièces
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c0476b]">
            {product.category}
          </p>
          <Link href={`/produit/${product.slug}`}>
            <h3 className="mt-0.5 font-serif text-lg text-stone-900 hover:underline leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-base font-bold text-stone-900">
            <Price priceUsdCents={product.priceUsdCents} />
          </span>
          {isOutOfStock ? (
            <span className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-400">
              Indisponible
            </span>
          ) : (
            <AddToCartButton product={product} compact />
          )}
        </div>
      </div>
    </article>
  );
}
