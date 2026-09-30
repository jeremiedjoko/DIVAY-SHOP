import Link from "next/link";
import { Calendar, Sparkles, Heart, Leaf, Flower2, Diamond, ChevronRight, CheckCircle2 } from "lucide-react";

export const revalidate = 3600;

export default async function ShopPage() {
  const services = [
    { title: "Makeup", desc: "Maquillage naturel, soirée, cérémonie, mariage...", img: "/bank/pexels-eyeboll-studios-3088642-4684193.jpg", icon: <Sparkles className="h-5 w-5 text-[#c0476b]" />, slug: "makeup" },
    { title: "Manucure", desc: "Beauté des mains, pose de vernis, gel, nail art...", img: "/bank/pexels-rdne-7755287.jpg", icon: <Heart className="h-5 w-5 text-[#c0476b]" />, slug: "manucure" },
    { title: "Pédicure", desc: "Soin des pieds, pédicure esthétique, finition parfaite...", img: "/bank/OIP.webp", icon: <Flower2 className="h-5 w-5 text-[#c0476b]" />, slug: "pedicure" },
    { title: "Soins du visage", desc: "Nettoyage, hydratation, soins personnalisés...", img: "/bank/596f4bbc50080-soins-visage-african-lady-togo.jpg", icon: <Leaf className="h-5 w-5 text-[#c0476b]" />, slug: "visage" },
    { title: "Bien-être", desc: "Épilation, gommage, modelage et bien plus encore...", img: "/bank/pexels-sora-shimazaki-5938278.jpg", icon: <Diamond className="h-5 w-5 text-[#c0476b]" />, slug: "bien-etre" },
  ];

  const galleryImages = [
    "/bank/pexels-el-gringo-photo-116752370-16052873.jpg",
    "/bank/pexels-babajide-olusanya-2151643024-36331023.jpg",
    "/bank/pexels-darksight-image-736222078-36537457.jpg",
    "/bank/pexels-thekehindeogunsanya-11515392.jpg",
    "/bank/pexels-darkshadephotos-39287202.jpg",
    "/bank/OIP (3).webp",
  ];

  const testimonials = [
    { name: "Aïcha D.", img: "/bank/pexels-el-gringo-photo-116752370-30412203.jpg", quote: "Une expérience magnifique. Le maquillage était exactement comme je le souhaitais !" },
    { name: "Sarah M.", img: "/bank/pexels-el-gringo-photo-116752370-30412204.jpg", quote: "Mes ongles sont toujours parfaits. L'équipe est vraiment au top !" },
    { name: "Jessica K.", img: "/bank/pexels-el-gringo-photo-116752370-30412226.jpg", quote: "Un vrai moment de détente. Les soins du visage sont incroyables. Je recommande à 100% !" },
  ];

  return (
    <div className="flex flex-col bg-[#fdfbf7]">

      {/* ─── HERO ────────────────────────────────────────────────── */}
      <section className="relative flex h-[600px] lg:h-[88vh] w-full items-center justify-end overflow-hidden px-6 lg:px-24">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bank/hero-beaute-new.jpg"
            alt="Divay Beauty"
            className="absolute inset-0 h-full w-full object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 w-full max-w-xl text-white">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#d4799a]">
            SOINS DE BEAUTÉ &amp; BIEN-ÊTRE
          </p>
          <h1 className="font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
            Révélez votre
          </h1>
          <p
            className="leading-none text-[#f2ebe5]"
            style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "clamp(52px, 8vw, 90px)" }}
          >
            beauté naturelle
          </p>
          <p className="mt-6 text-sm font-light leading-relaxed text-white/85 max-w-md">
            Des soins professionnels pensés pour vous faire sentir belle, confiante et élégante.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-[11px] font-semibold text-white/90">
            {[
              { icon: <Sparkles className="h-3 w-3 text-[#d4799a]" />, label: "Makeup" },
              { icon: <Heart className="h-3 w-3 text-[#d4799a]" />, label: "Manucure & Pédicure" },
              { icon: <Leaf className="h-3 w-3 text-[#d4799a]" />, label: "Soins du visage" },
              { icon: <Flower2 className="h-3 w-3 text-[#d4799a]" />, label: "Beauté & Bien-être" },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2 rounded-full bg-black/40 border border-white/30 px-4 py-1.5 backdrop-blur-sm">
                {item.icon} {item.label}
              </span>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]"
            >
              <Calendar className="h-4 w-4" />
              Prendre rendez-vous
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PRESTATIONS ─────────────────────────────────────────── */}
      <section className="bg-[#fdfbf7] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c0476b]">NOS PRESTATIONS</p>
              <h2 className="mt-2 font-serif text-4xl text-[#2a1c15]">Des soins pour chaque envie</h2>
              <p style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "38px", color: "#9e3457" }}>
                Votre beauté, notre expertise
              </p>
            </div>
            <Link href="/prestations" className="hidden sm:flex text-xs font-bold text-[#c0476b] hover:underline items-center gap-1">
              Voir tous les services <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-5">
            {services.map((s, i) => (
              <div key={i} className="group flex flex-col rounded-[1.5rem] border border-[#f0dde6] bg-white pb-6 shadow-sm transition hover:shadow-lg">
                <div className="relative h-44 w-full overflow-hidden rounded-t-[1.5rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="relative -mt-6 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#fff0f4] shadow-sm">
                    {s.icon}
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center px-3 pt-4 text-center">
                  <h3 className="font-serif text-lg font-bold text-[#2a1c15]">{s.title}</h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-stone-500 px-2">{s.desc}</p>
                  <Link href={`/reservation?categorie=${s.slug}`} className="mt-auto pt-5">
                    <span className="rounded-full bg-[#c0476b] px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]">
                      Découvrir →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES ─────────────────────────────────────────── */}
      <div className="border-y border-[#f0dde6] bg-[#fff7f9] py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center text-[#2a1c15]">
            {[
              { icon: <Diamond className="h-8 w-8 text-[#c0476b]" strokeWidth={1.5} />, title: "Professionnalisme", desc: "Des experts à votre service\npour un résultat impeccable." },
              { icon: <Leaf className="h-8 w-8 text-[#c0476b]" strokeWidth={1.5} />, title: "Produits de qualité", desc: "Des produits sélectionnés\npour votre peau et vos ongles." },
              { icon: <Heart className="h-8 w-8 text-[#c0476b]" strokeWidth={1.5} />, title: "Soins personnalisés", desc: "Chaque cliente est unique,\nchaque soin est adapté." },
              { icon: <Flower2 className="h-8 w-8 text-[#c0476b]" strokeWidth={1.5} />, title: "Cadre élégant", desc: "Un espace dédié à votre\nbien-être et à votre beauté." },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                {b.icon}
                <h4 className="text-sm font-bold">{b.title}</h4>
                <p className="text-[10px] text-stone-500 whitespace-pre-line">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── GALERIE ─────────────────────────────────────────────── */}
      <section className="bg-[#fdfbf7] py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c0476b]">NOTRE GALERIE</p>
              <h2 className="mt-2 font-serif text-4xl text-[#2a1c15]">Nos plus belles réalisations</h2>
              <p style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "34px", color: "#9e3457" }}>
                La beauté en images
              </p>
            </div>
            <Link href="/galerie" className="hidden sm:flex text-xs font-bold text-[#c0476b] hover:underline items-center gap-1">
              Voir toute la galerie <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex w-full gap-4">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4] flex-1 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Galerie ${idx + 1}`} className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOUTIQUE TEASER ──────────────────────────────────────── */}
      <section className="bg-[#2a1c15] py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Texte gauche */}
            <div className="w-full md:w-1/2 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4799a]">NOTRE BOUTIQUE</p>
              <h2 className="mt-3 font-serif text-4xl lg:text-5xl text-white leading-tight">
                Des créations<br />artisanales uniques
              </h2>
              <p
                className="text-[#d4799a] mt-1"
                style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "32px", lineHeight: 1.2 }}
              >
                Faites au Congo, avec amour
              </p>
              <p className="mt-6 text-sm leading-relaxed text-white/70">
                Découvrez notre sélection d&apos;articles artisanaux : sacs en paille, colliers et sacs en perles, éventails traditionnels, stylos personnalisés et bien plus encore.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Sacs en paille", "Colliers en perles", "Éventails", "Sacs en perles", "Stylos personnalisés"].map((tag) => (
                  <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-[10px] text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-10 flex items-center gap-4">
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]"
                >
                  Découvrir la boutique <ChevronRight className="h-4 w-4" />
                </Link>
                <Link href="/boutique" className="text-xs text-white/60 hover:text-white transition underline underline-offset-4">
                  Voir tous les articles
                </Link>
              </div>
            </div>
            {/* Grille produits aperçu */}
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-3">
              {[
                { img: "/bank/pexels-taiyesalawu-36436443.jpg", name: "Sac en paille", price: "8 500 FC" },
                { img: "/bank/pexels-taiyesalawu-36453198.jpg", name: "Collier en perles", price: "5 000 FC" },
                { img: "/bank/pexels-taiyesalawu-36497919.jpg", name: "Éventail traditionnel", price: "3 500 FC" },
                { img: "/bank/pexels-taiyesalawu-36436447.jpg", name: "Sac en perles", price: "12 000 FC" },
              ].map((p, i) => (
                <Link key={i} href="/boutique" className="group relative overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3">
                    <p className="text-xs font-bold text-white">{p.name}</p>
                    <p className="text-[10px] text-[#d4799a] font-semibold">{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TÉMOIGNAGES ─────────────────────────────────────────── */}
      <section className="bg-[#fff7f9] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c0476b]">TÉMOIGNAGES</p>
            <h2 className="mt-2 font-serif text-4xl text-[#2a1c15]">Ce que nos clientes disent</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="flex flex-col rounded-xl bg-white p-8 shadow-sm border border-[#f0dde6]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-[#f0dde6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.img} alt={t.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2a1c15]">{t.name}</h4>
                    <div className="text-[#c0476b] text-xs">★★★★★</div>
                  </div>
                </div>
                <p className="text-xs italic text-stone-600">&quot;{t.quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOOKING BANNER ───────────────────────────────────────── */}
      <section className="bg-[#1a0a12] text-[#f2ebe5]">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-stretch">
          <div className="w-full md:w-1/3 h-[300px] md:h-auto relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bank/OIP (1).webp"
              alt="Moment beauté"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a0a12] hidden md:block" />
          </div>
          <div className="w-full md:w-1/3 px-8 py-12 md:py-16 text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4799a]">PRENEZ RENDEZ-VOUS</p>
            <h2 className="mt-2 font-serif text-3xl text-white">Votre moment beauté<br />commence ici.</h2>
            <p className="mt-3 text-xs text-white/70 font-light">Choisissez votre prestation, votre date et votre heure.</p>
            <Link href="/reservation" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]">
              <Calendar className="h-4 w-4" /> Réserver mon rendez-vous →
            </Link>
          </div>
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center gap-8 px-8 py-12 border-t md:border-t-0 md:border-l border-white/10">
            {[
              { n: "1", label: "Choisissez votre\nservice", icon: null },
              { n: null, label: "Sélectionnez\nla date", icon: <Calendar className="h-4 w-4" /> },
              { n: null, label: "Confirmez votre\nrendez-vous", icon: <CheckCircle2 className="h-4 w-4" /> },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#d4799a] font-bold">
                  {step.icon ?? step.n}
                </div>
                <p className="text-[10px] text-white/60 whitespace-pre-line">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
