import Link from "next/link";
import { Calendar, Sparkles, Heart, Leaf, Flower2, Diamond, Clock, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Nos Services — Divay Beauty",
  description: "Découvrez toutes nos prestations beauté : makeup, manucure, soins du visage et bien-être.",
};

const categories = [
  {
    icon: <Sparkles className="h-8 w-8 text-[#c0476b]" />,
    title: "Makeup & Coiffure",
    desc: "Un maquillage professionnel pour sublimer votre beauté naturelle en toute occasion.",
    services: [
      { name: "Maquillage naturel", duration: "45 min", price: "15 000 FC" },
      { name: "Maquillage soirée", duration: "1h", price: "25 000 FC" },
      { name: "Maquillage mariage", duration: "2h", price: "50 000 FC" },
      { name: "Essai maquillage", duration: "1h30", price: "30 000 FC" },
    ],
    img: "/bank/pexels-eyeboll-studios-3088642-4684193.jpg",
  },
  {
    icon: <Heart className="h-8 w-8 text-[#c0476b]" />,
    title: "Manucure & Nail Art",
    desc: "Des mains parfaites avec nos soins des ongles, poses de gel et nail art créatif.",
    services: [
      { name: "Manucure classique", duration: "30 min", price: "8 000 FC" },
      { name: "Pose de vernis gel", duration: "1h", price: "15 000 FC" },
      { name: "Nail art (par ongle)", duration: "15 min", price: "2 000 FC" },
      { name: "Dépose + repose gel", duration: "1h30", price: "20 000 FC" },
    ],
    img: "/bank/pexels-rdne-7755287.jpg",
  },
  {
    icon: <Flower2 className="h-8 w-8 text-[#c0476b]" />,
    title: "Pédicure & Soins des pieds",
    desc: "Prenez soin de vos pieds avec nos soins de pédicure complets et relaxants.",
    services: [
      { name: "Pédicure classique", duration: "45 min", price: "10 000 FC" },
      { name: "Pédicure spa", duration: "1h15", price: "18 000 FC" },
      { name: "Pose vernis pieds", duration: "20 min", price: "5 000 FC" },
      { name: "Soin gommage pieds", duration: "30 min", price: "8 000 FC" },
    ],
    img: "/bank/OIP.webp",
  },
  {
    icon: <Leaf className="h-8 w-8 text-[#c0476b]" />,
    title: "Soins du visage",
    desc: "Des soins personnalisés pour une peau éclatante, hydratée et purifiée.",
    services: [
      { name: "Nettoyage de peau", duration: "45 min", price: "12 000 FC" },
      { name: "Soin hydratant", duration: "1h", price: "18 000 FC" },
      { name: "Masque purifiant", duration: "30 min", price: "10 000 FC" },
      { name: "Soin anti-taches", duration: "1h", price: "22 000 FC" },
    ],
    img: "/bank/596f4bbc50080-soins-visage-african-lady-togo.jpg",
  },
  {
    icon: <Diamond className="h-8 w-8 text-[#c0476b]" />,
    title: "Épilation & Bien-être",
    desc: "Épilation douce, gommage corporel et soins de bien-être pour vous ressourcer.",
    services: [
      { name: "Épilation sourcils", duration: "15 min", price: "3 000 FC" },
      { name: "Épilation moustache", duration: "10 min", price: "2 000 FC" },
      { name: "Épilation jambes", duration: "45 min", price: "15 000 FC" },
      { name: "Gommage corporel", duration: "1h", price: "25 000 FC" },
    ],
    img: "/bank/pexels-sora-shimazaki-5938278.jpg",
  },
];

export default function PrestationsPage() {
  return (
    <main className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#fff0f4] py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c0476b]">NOS PRESTATIONS</p>
          <h1 className="mt-3 font-serif text-5xl text-[#2a1c15]">Des soins pour chaque envie</h1>
          <p
            className="mt-1 text-[#9e3457]"
            style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "40px" }}
          >
            Votre beauté, notre expertise
          </p>
          <p className="mt-6 text-sm leading-relaxed text-stone-600">
            Chez Divay Beauty, chaque prestation est réalisée avec soin, professionnalisme et des produits de qualité.
          </p>
          <Link
            href="/reservation"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]"
          >
            <Calendar className="h-4 w-4" />
            Prendre rendez-vous
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="space-y-20">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`flex flex-col gap-10 md:flex-row ${i % 2 !== 0 ? "md:flex-row-reverse" : ""} items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-2/5 overflow-hidden rounded-3xl shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.img} alt={cat.title} className="h-[320px] w-full object-cover" />
              </div>

              {/* Content */}
              <div className="w-full md:w-3/5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f4]">
                    {cat.icon}
                  </div>
                  <h2 className="font-serif text-3xl text-[#2a1c15]">{cat.title}</h2>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-stone-600">{cat.desc}</p>

                <div className="divide-y divide-[#f0dde6] rounded-2xl border border-[#f0dde6] bg-white">
                  {cat.services.map((svc, j) => (
                    <div key={j} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-[#2a1c15]">{svc.name}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-stone-500">
                          <Clock className="h-3 w-3" /> {svc.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-[#c0476b]">{svc.price}</span>
                        <Link
                          href="/reservation"
                          className="rounded-full bg-[#c0476b] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]"
                        >
                          Réserver
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#c0476b] py-16 text-center text-white">
        <h2 className="font-serif text-3xl">Prête à vous faire chouchouter ?</h2>
        <p className="mt-3 text-sm opacity-80">Réservez votre soin en quelques clics.</p>
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
