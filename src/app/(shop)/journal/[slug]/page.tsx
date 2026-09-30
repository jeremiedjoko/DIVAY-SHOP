import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.published, 1)),
  });
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.published, 1)),
  });
  if (!post) notFound();

  return (
    <main className="bg-[#fdfbf7]">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/journal" className="text-sm text-[#c0476b] hover:underline">
          ← Retour au journal
        </Link>
        <p className="mt-6 text-[10px] uppercase tracking-widest text-stone-400">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""}{" "}
          · {post.authorName}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[#2a1c15]">{post.title}</h1>
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverUrl}
            alt={post.title}
            className="mt-8 h-80 w-full rounded-3xl object-cover"
          />
        ) : null}
        <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-stone-700">
          {post.content}
        </div>
      </article>
    </main>
  );
}
