import Link from "next/link";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata = {
  title: "Journal — Divay Beauty",
  description: "Conseils beauté, coulisses du salon et actualités Divay Beauty.",
};

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const posts = await db
    .select()
    .from(articles)
    .where(eq(articles.published, 1))
    .orderBy(desc(articles.createdAt));

  return (
    <main className="bg-[#fdfbf7]">
      <section className="bg-[#fff0f4] py-20 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c0476b]">JOURNAL</p>
        <h1 className="mt-3 font-serif text-5xl text-[#2a1c15]">Le journal Divay</h1>
        <p
          className="mt-1 text-[#9e3457]"
          style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "36px" }}
        >
          Inspiration & conseils
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#f0dde6] bg-white p-12 text-center text-stone-500">
            Les premiers articles arrivent bientôt.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className="group overflow-hidden rounded-3xl border border-[#f0dde6] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 bg-[#fff0f4]">
                  {post.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-serif text-[#c0476b]">
                      Divay Beauty
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-[#2a1c15] group-hover:text-[#c0476b]">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{post.excerpt}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
