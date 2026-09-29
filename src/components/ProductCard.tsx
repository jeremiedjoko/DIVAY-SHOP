import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/produit/${product.slug}`} className="relative aspect-[4/5] overflow-hidden">
        <Image unoptimized
          src={product.image}
          alt={product.imageAlt ?? product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          style={
            product.imageFocal
              ? { objectPosition: `${product.imageFocal.x}% ${product.imageFocal.y}%` }
              : undefined
          }
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-500">{product.category}</p>
          <Link href={`/produit/${product.slug}`}>
            <h3 className="font-serif text-lg text-stone-900 hover:underline">{product.name}</h3>
          </Link>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-stone-900">
            {formatPrice(product.priceCents)}
          </span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
