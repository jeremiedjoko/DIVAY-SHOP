import { NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { getSession } from "@/lib/session";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { slugify } from "@/lib/format";
import { z } from "zod";

async function checkAdmin() {
  const session = await getSession();
  return session?.roles?.includes("SUPER_ADMIN") || session?.roles?.includes("VENDEUSE");
}

const articleSchema = z.object({
  title: z.string().min(3).max(160),
  excerpt: z.string().max(400).optional().nullable(),
  content: z.string().min(20).max(50000),
  coverUrl: z.string().max(500).optional().nullable(),
  published: z.boolean().optional(),
});

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.select().from(articles).orderBy(desc(articles.createdAt));
  return NextResponse.json({ articles: rows });
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = articleSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Article incomplet." }, { status: 400 });
  }

  const id = randomUUID();
  let slug = slugify(parsed.data.title);
  const existing = await db.select().from(articles).where(eq(articles.slug, slug));
  if (existing.length) slug = `${slug}-${id.slice(0, 6)}`;

  const now = new Date();
  await db.insert(articles).values({
    id,
    slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt ?? null,
    content: parsed.data.content,
    coverUrl: parsed.data.coverUrl || null,
    published: parsed.data.published ? 1 : 0,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ article: { id, slug } }, { status: 201 });
}

export async function PUT(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = articleSchema.extend({ id: z.string().min(1) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }
  await db
    .update(articles)
    .set({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt ?? null,
      content: parsed.data.content,
      coverUrl: parsed.data.coverUrl || null,
      published: parsed.data.published ? 1 : 0,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, parsed.data.id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis." }, { status: 400 });
  await db.delete(articles).where(eq(articles.id, id));
  return NextResponse.json({ ok: true });
}
