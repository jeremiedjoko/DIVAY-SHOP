import Link from "next/link";
import { BoutiqueClient } from "@/components/BoutiqueClient";
import { getCategories, getProducts } from "@/lib/products";
import { ShoppingBag, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Boutique — Divay Beauty",
  description: "Découvrez nos créations artisanales : sacs en paille, colliers en perles, éventails, stylos personnalisés et bien plus encore.",
};

type Props = { searchParams: Promise<{ cat?: string }> };

export default async function BoutiquePage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <main className="bg-[#fdfbf7]">
      {/* Hero section */}
      <section className="bg-[#2a1c15] py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4799a]">DIVAY BEAUTY</p>
          <h1 className="mt-3 font-serif text-5xl text-white">Notre Boutique</h1>
          <p
            className="mt-1 text-[#d4799a]"
            style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "38px" }}
          >
            Artisanat congolais
          </p>
          <p className="mt-5 text-sm leading-relaxed text-white/70">
            Des créations artisanales uniques — sacs en paille, bijoux en perles,{" "}
            éventails traditionnels, stylos personnalisés et bien plus encore.
          </p>
          {/* Catégories rapides */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/boutique?cat=${encodeURIComponent(c)}`}
                className={`rounded-full px-4 py-1.5 text-[11px] font-semibold border transition ${
                  cat === c
                    ? "bg-[#c0476b] border-[#c0476b] text-white"
                    : "border-white/20 text-white/70 hover:border-[#c0476b] hover:text-white"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grille produits */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            <span className="font-bold text-[#2a1c15]">{products.length}</span> articles disponibles
          </p>
          <Link href="/" className="flex items-center gap-1 text-xs text-[#c0476b] hover:underline">
            <ChevronRight className="h-3 w-3 rotate-180" /> Retour à l&apos;accueil
          </Link>
        </div>
        <BoutiqueClient
          initialProducts={products}
          initialCategories={categories}
          initialCat={cat}
        />
      </section>

      {/* CTA bas de page */}
      <div className="bg-[#fff0f4] py-16 text-center border-t border-[#f0dde6]">
        <ShoppingBag className="mx-auto h-8 w-8 text-[#c0476b] mb-4" strokeWidth={1.5} />
        <h2 className="font-serif text-3xl text-[#2a1c15]">Vous avez un article en tête ?</h2>
        <p className="mt-3 text-sm text-stone-500">
          Contactez-nous pour une commande sur mesure ou une personnalisation spéciale.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]"
        >
          Nous contacter <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
