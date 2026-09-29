import Link from "next/link";
import { Calendar, Check, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Tarifs — Divay Beauty",
  description: "Tous les tarifs de nos prestations beauté : makeup, manucure, soins du visage et bien-être.",
};

const pricingCategories = [
  {
    title: "Makeup & Coiffure",
    emoji: "💄",
    items: [
      { name: "Maquillage naturel", price: "15 000 FC", duration: "45 min" },
      { name: "Maquillage soirée", price: "25 000 FC", duration: "1h" },
      { name: "Maquillage mariage", price: "50 000 FC", duration: "2h" },
      { name: "Essai maquillage", price: "30 000 FC", duration: "1h30" },
    ],
  },
  {
    title: "Manucure & Nail Art",
    emoji: "💅",
    items: [
      { name: "Manucure classique", price: "8 000 FC", duration: "30 min" },
      { name: "Pose de vernis gel", price: "15 000 FC", duration: "1h" },
      { name: "Nail art (par ongle)", price: "2 000 FC", duration: "15 min" },
      { name: "Dépose + repose gel", price: "20 000 FC", duration: "1h30" },
    ],
  },
  {
    title: "Pédicure",
    emoji: "🦶",
    items: [
      { name: "Pédicure classique", price: "10 000 FC", duration: "45 min" },
      { name: "Pédicure spa", price: "18 000 FC", duration: "1h15" },
      { name: "Pose vernis pieds", price: "5 000 FC", duration: "20 min" },
      { name: "Gommage pieds", price: "8 000 FC", duration: "30 min" },
    ],
  },
  {
    title: "Soins du visage",
    emoji: "✨",
    items: [
      { name: "Nettoyage de peau", price: "12 000 FC", duration: "45 min" },
      { name: "Soin hydratant", price: "18 000 FC", duration: "1h" },
      { name: "Masque purifiant", price: "10 000 FC", duration: "30 min" },
      { name: "Soin anti-taches", price: "22 000 FC", duration: "1h" },
    ],
  },
  {
    title: "Épilation & Bien-être",
    emoji: "🌸",
    items: [
      { name: "Épilation sourcils", price: "3 000 FC", duration: "15 min" },
      { name: "Épilation moustache", price: "2 000 FC", duration: "10 min" },
      { name: "Épilation jambes", price: "15 000 FC", duration: "45 min" },
      { name: "Gommage corporel", price: "25 000 FC", duration: "1h" },
    ],
  },
];

const packages = [
  {
    slug: "detente",
    name: "Forfait Détente",
    price: "35 000 FC",
    desc: "Un moment de pur bien-être",
    highlight: false,
    features: ["Manucure classique", "Pédicure classique", "Masque visage", "Vernis offert"],
  },
  {
    slug: "glamour",
    name: "Forfait Glamour",
    price: "65 000 FC",
    desc: "Pour briller en toute occasion",
    highlight: true,
    features: ["Maquillage soirée", "Pose gel mains", "Pédicure spa", "Soin hydratant visage"],
  },
  {
    slug: "mariee",
    name: "Forfait Mariée",
    price: "120 000 FC",
    desc: "Le grand jour mérite le meilleur",
    highlight: false,
    features: ["Maquillage mariage", "Essai maquillage inclus", "Pose gel mains", "Pédicure spa", "Soin visage complet"],
  },
];

export default function TarifsPage() {
  return (
    <main className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="bg-[#fff0f4] py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c0476b]">NOS TARIFS</p>
          <h1 className="mt-3 font-serif text-5xl text-[#2a1c15]">Nos prix</h1>
          <p
            className="mt-1 text-[#9e3457]"
            style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "40px" }}
          >
            Transparents et accessibles
          </p>
          <p className="mt-5 text-sm text-stone-600">
            Tous nos tarifs sont en Francs Congolais (FC). Des forfaits avantageux sont disponibles.
          </p>
        </div>
      </section>

      {/* Forfaits */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c0476b]">FORFAITS</p>
          <h2 className="mt-2 font-serif text-4xl text-[#2a1c15]">Nos formules tout-en-un</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-3xl p-8 ${
                pkg.highlight
                  ? "bg-[#c0476b] text-white shadow-2xl scale-105"
                  : "border border-[#f0dde6] bg-white text-[#2a1c15]"
              }`}
            >
              {pkg.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#9e3457] px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Populaire
                </span>
              )}
              <h3 className={`font-serif text-2xl ${pkg.highlight ? "text-white" : "text-[#2a1c15]"}`}>
                {pkg.name}
              </h3>
              <p className={`mt-1 text-xs ${pkg.highlight ? "text-white/70" : "text-stone-500"}`}>{pkg.desc}</p>
              <p className={`mt-4 text-3xl font-bold ${pkg.highlight ? "text-white" : "text-[#c0476b]"}`}>
                {pkg.price}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${pkg.highlight ? "text-white" : "text-[#c0476b]"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/reservation?forfait=${pkg.slug}`}
                className={`mt-8 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition ${
                  pkg.highlight
                    ? "bg-white text-[#c0476b] hover:bg-[#fff0f4]"
                    : "bg-[#c0476b] text-white hover:bg-[#9e3457]"
                }`}
              >
                <Calendar className="h-4 w-4" /> Réserver ce forfait
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Tarif détaillé */}
      <section className="bg-[#fff0f4] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c0476b]">TARIF À LA CARTE</p>
            <h2 className="mt-2 font-serif text-4xl text-[#2a1c15]">Toutes nos prestations</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pricingCategories.map((cat, i) => (
              <div key={i} className="rounded-2xl border border-[#f0dde6] bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2 font-serif text-xl text-[#2a1c15]">
                  <span>{cat.emoji}</span> {cat.title}
                </h3>
                <div className="space-y-3">
                  {cat.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between border-b border-[#f9edf1] pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-xs font-semibold text-[#2a1c15]">{item.name}</p>
                        <p className="text-[10px] text-stone-400">{item.duration}</p>
                      </div>
                      <span className="text-sm font-bold text-[#c0476b]">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#c0476b] py-16 text-center text-white">
        <h2 className="font-serif text-3xl">Prenez rendez-vous dès maintenant</h2>
        <p className="mt-3 text-sm opacity-80">Réservez votre soin en quelques clics, c&apos;est rapide et gratuit.</p>
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
