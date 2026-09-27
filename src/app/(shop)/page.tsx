import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <main className="overflow-x-hidden">

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center bg-[#0f0e0d] overflow-hidden">
        {/* Fond dégradé ambiance */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[#c45c3e]/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-900/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <p className="inline-block rounded-full border border-[#c45c3e]/30 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#c45c3e]">
              DIVAY BEAUTY — Kinshasa
            </p>
            <h1 className="font-serif text-5xl leading-[1.1] text-white sm:text-6xl lg:text-7xl">
              L&apos;art de{" "}
              <em className="not-italic text-[#c45c3e]">sublimer</em>{" "}
              votre beauté
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-stone-400">
              Cosmétiques de prestige. Livraison express à Kinshasa. Une expérience d&apos;achat à la hauteur de vos exigences.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/boutique"
                className="rounded-full bg-[#c45c3e] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#c45c3e]/20 transition hover:bg-[#b04d32] hover:shadow-[#c45c3e]/30"
              >
                Découvrir la collection
              </Link>
              <Link
                href="/suivi"
                className="rounded-full border border-stone-700 px-8 py-3.5 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Suivre ma commande
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-10 border-t border-stone-800 pt-8">
              {[
                { stat: "100%", label: "Authenticité" },
                { stat: "24h", label: "Livraison" },
                { stat: "7j/7", label: "Service client" },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{stat}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card avantages */}
          <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8 backdrop-blur-sm">
            <p className="font-serif text-lg text-white mb-7">Ce qui nous distingue</p>
            <ul className="space-y-7">
              {[
                {
                  icon: (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  ),
                  title: "Paiement sécurisé",
                  desc: "Par carte ou à la réception de votre commande.",
                },
                {
                  icon: (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      <polyline strokeLinecap="round" strokeLinejoin="round" points="3.27 6.96 12 12.01 20.73 6.96"/>
                    </svg>
                  ),
                  title: "Livraison Premium",
                  desc: "Expédition soignée partout à Kinshasa sous 24h.",
                },
                {
                  icon: (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <polygon strokeLinecap="round" strokeLinejoin="round" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ),
                  title: "Qualité certifiée",
                  desc: "Marques prestigieuses et cosmétiques 100% authentiques.",
                },
                {
                  icon: (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  ),
                  title: "À votre écoute",
                  desc: "Une équipe disponible 7j/7 pour vous accompagner.",
                },
              ].map(({ icon, title, desc }) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 shrink-0 rounded-xl bg-stone-800 p-2.5 text-[#c45c3e]">
                    {icon}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-sm text-stone-500 mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── RUBAN DÉFILANT ─────────────────────────────────── */}
      <section className="border-y border-stone-800 bg-[#0f0e0d] overflow-hidden">
        <div className="flex animate-marquee items-center gap-16 py-4 text-xs font-semibold uppercase tracking-[0.2em] whitespace-nowrap text-stone-500">
          {[
            "Livraison Kinshasa 24h",
            "Authenticité garantie",
            "Paiement à la livraison",
            "Emballage premium",
            "Service client 7j/7",
            "Collection exclusive",
            "Livraison Kinshasa 24h",
            "Authenticité garantie",
            "Paiement à la livraison",
            "Emballage premium",
          ].map((t, i) => (
            <span key={i} className="flex items-center gap-16">
              {t}
              <span className="text-[#c45c3e] text-base">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ─── COUPS DE CŒUR ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c45c3e]">
              Sélection
            </p>
            <h2 className="mt-2 font-serif text-4xl text-stone-900">Coups de cœur</h2>
            <p className="mt-2 text-stone-500">Les favoris de nos clientes les plus exigeantes</p>
          </div>
          <Link href="/boutique" className="shrink-0 text-sm font-medium text-stone-700 hover:text-[#c45c3e] transition">
            Tout voir →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── TÉMOIGNAGES ────────────────────────────────────── */}
      <section className="border-y border-stone-100 bg-stone-50/70 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c0476b]">
              Témoignages
            </p>
            <h2 className="mt-2 font-serif text-4xl text-stone-900">L'avis de nos clientes</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                name: "Grâce M.",
                role: "Cliente Premium",
                text: "La palette nude est incroyable. Les couleurs tiennent toute la journée. Livraison d'une rapidité exemplaire et emballage extrêmement soigné.",
              },
              {
                name: "Christelle K.",
                role: "Kinshasa",
                text: "J'ai commandé le sérum vitamine C et ma peau est transformée. Un service irréprochable et des produits authentiques de très haute qualité.",
              },
              {
                name: "Nadège B.",
                role: "Professionnelle de la beauté",
                text: "La flexibilité du paiement à la livraison est un atout majeur. Une équipe toujours disponible, réactive et très professionnelle.",
              },
            ].map(({ name, role, text }) => (
              <div
                key={name}
                className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm transition hover:shadow-md"
              >
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-stone-600 italic">"{text}"</p>
                <div className="mt-6 border-t border-stone-100 pt-5">
                  <p className="font-semibold text-stone-900">{name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#0f0e0d] px-8 py-16 text-center text-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-64 w-64 rounded-full bg-[#c45c3e]/15 blur-[80px]" />
          </div>
          <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-[#c45c3e]">
            Collection 2025
          </p>
          <h2 className="relative mt-3 font-serif text-4xl sm:text-5xl">
            Votre beauté mérite l&apos;excellence
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-stone-400">
            Découvrez notre collection exclusive et vivez une expérience d&apos;achat pensée dans les moindres détails.
          </p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/boutique"
              className="rounded-full bg-[#c45c3e] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#c45c3e]/20 transition hover:bg-[#b04d32]"
            >
              Accéder au catalogue
            </Link>
            <Link
              href="/inscription"
              className="rounded-full border border-stone-700 px-8 py-3.5 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Créer mon compte
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
