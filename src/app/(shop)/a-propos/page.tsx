import Link from "next/link";
import { Calendar, Heart, Award, Users, Sparkles, ChevronRight } from "lucide-react";

export const metadata = {
  title: "À propos — Divay Beauty",
  description: "Découvrez l'histoire, les valeurs et l'équipe de Divay Beauty.",
};

export default function AProposPage() {
  return (
    <main className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#fff0f4] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="w-full md:w-1/2">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c0476b]">NOTRE HISTOIRE</p>
              <h1 className="mt-3 font-serif text-5xl text-[#2a1c15]">À propos de</h1>
              <p
                className="text-[#9e3457]"
                style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "52px", lineHeight: 1.1 }}
              >
                Divay Beauty
              </p>
              <p className="mt-6 text-sm leading-relaxed text-stone-600">
                Née d&apos;une passion pour la beauté africaine et le bien-être, Divay Beauty est bien plus qu&apos;un salon — c&apos;est un espace de transformation et de confiance en soi.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-stone-600">
                Fondé à Kinshasa, notre salon s&apos;est rapidement imposé comme une référence en matière de soins beauté professionnels, alliant expertise technique et chaleur humaine.
              </p>
              <Link
                href="/reservation"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]"
              >
                <Calendar className="h-4 w-4" /> Prendre rendez-vous
              </Link>
            </div>
            <div className="w-full md:w-1/2 overflow-hidden rounded-3xl shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/bank/pexels-darkshadephotos-39287202.jpg"
                alt="Divay Beauty Salon"
                className="h-[420px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#f0dde6] bg-white py-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { value: "500+", label: "Clientes satisfaites" },
              { value: "5+", label: "Années d'expérience" },
              { value: "20+", label: "Prestations disponibles" },
              { value: "98%", label: "Taux de satisfaction" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="font-serif text-4xl text-[#c0476b]">{stat.value}</p>
                <p className="mt-1 text-xs text-stone-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c0476b]">NOS VALEURS</p>
          <h2 className="mt-2 font-serif text-4xl text-[#2a1c15]">Ce qui nous distingue</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Award className="h-8 w-8 text-[#c0476b]" />, title: "Excellence", desc: "Nous n'acceptons rien de moins que la perfection dans chacun de nos soins." },
            { icon: <Heart className="h-8 w-8 text-[#c0476b]" />, title: "Bienveillance", desc: "Chaque cliente est accueillie avec chaleur et respect dans un cadre sécurisant." },
            { icon: <Users className="h-8 w-8 text-[#c0476b]" />, title: "Communauté", desc: "Nous célébrons la beauté africaine dans toute sa diversité et sa richesse." },
            { icon: <Sparkles className="h-8 w-8 text-[#c0476b]" />, title: "Innovation", desc: "Nous suivons les dernières tendances beauté pour vous offrir le meilleur." },
          ].map((val, i) => (
            <div key={i} className="flex flex-col items-center rounded-2xl border border-[#f0dde6] bg-white p-8 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f4]">
                {val.icon}
              </div>
              <h3 className="font-serif text-xl text-[#2a1c15]">{val.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-stone-500">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#fff0f4] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c0476b]">NOTRE ÉQUIPE</p>
            <h2 className="mt-2 font-serif text-4xl text-[#2a1c15]">Des expertes à votre service</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { name: "Divay", role: "Fondatrice & Makeup Artist", img: "/bank/pexels-el-gringo-photo-116752370-30412203.jpg" },
              { name: "Carine", role: "Spécialiste Manucure & Nail Art", img: "/bank/pexels-el-gringo-photo-116752370-30412204.jpg" },
              { name: "Aminata", role: "Esthéticienne & Soins visage", img: "/bank/pexels-el-gringo-photo-116752370-30412226.jpg" },
            ].map((member, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-[#f0dde6] shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="font-serif text-xl text-[#2a1c15]">{member.name}</h3>
                <p className="mt-1 text-xs text-[#c0476b]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#c0476b] py-16 text-center text-white">
        <h2 className="font-serif text-3xl">Venez nous rendre visite !</h2>
        <p className="mt-3 text-sm opacity-80">Réservez votre première prestation et rejoignez la famille Divay Beauty.</p>
        <Link
          href="/reservation"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#c0476b] transition hover:bg-[#fff0f4]"
        >
          <Calendar className="h-4 w-4" /> Prendre rendez-vous <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
