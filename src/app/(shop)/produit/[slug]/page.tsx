import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import { ProductDetail } from "@/components/ProductDetail";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} — DIVAY BEAUTY`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ]);
  if (!product) notFound();

  // Produits de la même catégorie, max 3, sauf le produit courant
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return <ProductDetail product={product} related={related} />;
}
