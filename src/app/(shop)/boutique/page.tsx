import { BoutiqueClient } from "@/components/BoutiqueClient";
import { getCategories, getProducts } from "@/lib/products";

export const metadata = { title: "Boutique" };

type Props = { searchParams: Promise<{ cat?: string }> };

export default async function BoutiquePage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c45c3e]">
          DIVAY BEAUTY
        </p>
        <h1 className="mt-1 font-serif text-4xl text-stone-900">Boutique</h1>
        <p className="mt-2 text-stone-500">
          Cosmétiques & soins beauté — livrés à Kinshasa
        </p>
      </header>

      <BoutiqueClient
        initialProducts={products}
        initialCategories={categories}
        initialCat={cat}
      />
    </main>
  );
}
