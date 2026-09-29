import Link from "next/link";
import { Phone, MapPin, Mail, Clock, MessageCircle, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Contact — Divay Beauty",
  description: "Contactez Divay Beauty pour toute question ou information.",
};

export default function ContactPage() {
  return (
    <main className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="bg-[#fff0f4] py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c0476b]">CONTACT</p>
          <h1 className="mt-3 font-serif text-5xl text-[#2a1c15]">Nous contacter</h1>
          <p
            className="mt-1 text-[#9e3457]"
            style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "40px" }}
          >
            Nous sommes là pour vous
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2">

          {/* Infos contact */}
          <div className="space-y-8">
            <h2 className="font-serif text-3xl text-[#2a1c15]">Nos coordonnées</h2>

            {[
              { icon: <Phone className="h-5 w-5 text-[#c0476b]" />, label: "Téléphone", value: "+243 87 123 45 67", link: "tel:+243871234567" },
              { icon: <MessageCircle className="h-5 w-5 text-[#c0476b]" />, label: "WhatsApp", value: "+243 87 123 45 67", link: "https://wa.me/243871234567" },
              { icon: <Mail className="h-5 w-5 text-[#c0476b]" />, label: "Email", value: "contact@divaybeauty.com", link: "mailto:contact@divaybeauty.com" },
              { icon: <MapPin className="h-5 w-5 text-[#c0476b]" />, label: "Adresse", value: "Kinshasa, République Démocratique du Congo", link: null },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0f4]">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{item.label}</p>
                  {item.link ? (
                    <a href={item.link} className="mt-1 text-sm font-semibold text-[#2a1c15] hover:text-[#c0476b] transition">
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-[#2a1c15]">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Horaires */}
            <div className="rounded-2xl border border-[#f0dde6] bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#c0476b]" />
                <h3 className="font-serif text-xl text-[#2a1c15]">Horaires d&apos;ouverture</h3>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { day: "Lundi — Vendredi", hours: "8h00 — 20h00" },
                  { day: "Samedi", hours: "8h00 — 20h00" },
                  { day: "Dimanche", hours: "9h00 — 16h00" },
                ].map((h, i) => (
                  <div key={i} className="flex justify-between border-b border-[#f9edf1] pb-2 last:border-0 last:pb-0">
                    <span className="text-stone-600">{h.day}</span>
                    <span className="font-bold text-[#c0476b]">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Suivez-nous</p>
              <div className="flex gap-3">
                {[
                  { label: "Instagram", icon: "📷" },
                  { label: "Facebook", icon: "📘" },
                  { label: "TikTok", icon: "🎵" },
                  { label: "WhatsApp", icon: "💬" },
                ].map((sn, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f0dde6] bg-white text-lg shadow-sm transition hover:border-[#c0476b]"
                    title={sn.label}
                  >
                    {sn.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="rounded-3xl border border-[#f0dde6] bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-serif text-3xl text-[#2a1c15]">Envoyez-nous un message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-500">Prénom</label>
                  <input type="text" placeholder="Marie" className="w-full rounded-xl border border-[#f0dde6] px-4 py-3 text-sm outline-none focus:border-[#c0476b] focus:ring-1 focus:ring-[#c0476b]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-500">Nom</label>
                  <input type="text" placeholder="Dupont" className="w-full rounded-xl border border-[#f0dde6] px-4 py-3 text-sm outline-none focus:border-[#c0476b] focus:ring-1 focus:ring-[#c0476b]" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-500">Email</label>
                <input type="email" placeholder="marie@email.com" className="w-full rounded-xl border border-[#f0dde6] px-4 py-3 text-sm outline-none focus:border-[#c0476b] focus:ring-1 focus:ring-[#c0476b]" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-500">Téléphone</label>
                <input type="tel" placeholder="+243 ..." className="w-full rounded-xl border border-[#f0dde6] px-4 py-3 text-sm outline-none focus:border-[#c0476b] focus:ring-1 focus:ring-[#c0476b]" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-500">Message</label>
                <textarea rows={5} placeholder="Votre message..." className="w-full resize-none rounded-xl border border-[#f0dde6] px-4 py-3 text-sm outline-none focus:border-[#c0476b] focus:ring-1 focus:ring-[#c0476b]" />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[#c0476b] py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]"
              >
                Envoyer le message →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA reservation */}
      <div className="bg-[#c0476b] py-16 text-center text-white">
        <h2 className="font-serif text-3xl">Prête à vous faire chouchouter ?</h2>
        <p className="mt-3 text-sm opacity-80">Réservez directement votre prestation en ligne.</p>
        <Link
          href="/reservation"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#c0476b] transition hover:bg-[#fff0f4]"
        >
          Prendre rendez-vous <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
