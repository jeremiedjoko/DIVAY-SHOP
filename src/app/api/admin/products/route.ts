import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { buildProduct, getProducts, saveProducts } from "@/lib/products";

const productInput = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  priceCents: z.number().int().min(100).max(1_000_000),
  category: z.string().min(2).max(60),
  image: z.string().url(),
  featured: z.boolean(),
  stock: z.number().int().min(0).max(9999),
  slug: z.string().optional(),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = productInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données produit invalides." }, { status: 400 });
  }

  const products = await getProducts();
  const product = buildProduct(parsed.data);
  if (products.some((p) => p.slug === product.slug)) {
    return NextResponse.json({ error: "Ce slug existe déjà." }, { status: 409 });
  }
  products.push(product);
  await saveProducts(products);
  return NextResponse.json({ product }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const updateSchema = productInput.extend({ id: z.string().min(1) });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const products = await getProducts();
  const index = products.findIndex((p) => p.id === parsed.data.id);
  if (index === -1) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  const { id, slug: slugInput, ...rest } = parsed.data;
  const slug = slugInput?.trim() || products[index].slug;
  products[index] = { ...rest, id, slug };
  await saveProducts(products);
  return NextResponse.json({ product: products[index] });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID requis." }, { status: 400 });
  }

  const products = await getProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }
  await saveProducts(next);
  return NextResponse.json({ ok: true });
}
