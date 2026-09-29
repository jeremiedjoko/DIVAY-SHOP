"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, ChevronRight, CheckCircle2, Sparkles, Heart, Leaf, Flower2, Diamond } from "lucide-react";

const services = [
  { id: "makeup", label: "Maquillage naturel", duration: "45 min", price: "15 000 FC", icon: <Sparkles className="h-5 w-5" /> },
  { id: "makeup-soir", label: "Maquillage soirée", duration: "1h", price: "25 000 FC", icon: <Sparkles className="h-5 w-5" /> },
  { id: "manucure", label: "Manucure classique", duration: "30 min", price: "8 000 FC", icon: <Heart className="h-5 w-5" /> },
  { id: "gel", label: "Pose de vernis gel", duration: "1h", price: "15 000 FC", icon: <Heart className="h-5 w-5" /> },
  { id: "pedicure", label: "Pédicure spa", duration: "1h15", price: "18 000 FC", icon: <Flower2 className="h-5 w-5" /> },
  { id: "visage", label: "Soin hydratant visage", duration: "1h", price: "18 000 FC", icon: <Leaf className="h-5 w-5" /> },
  { id: "nettoyage", label: "Nettoyage de peau", duration: "45 min", price: "12 000 FC", icon: <Leaf className="h-5 w-5" /> },
  { id: "gommage", label: "Gommage corporel", duration: "1h", price: "25 000 FC", icon: <Diamond className="h-5 w-5" /> },
];

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

const today = new Date();
const days: { date: Date; label: string; dayName: string }[] = [];
for (let i = 1; i <= 14; i++) {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  days.push({
    date: d,
    label: d.getDate().toString(),
    dayName: d.toLocaleDateString("fr-FR", { weekday: "short" }),
  });
}

type Step = 1 | 2 | 3 | 4;

export default function ReservationPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const service = services.find((s) => s.id === selectedService);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setStep(4);
  }

  return (
    <main className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="bg-[#fff0f4] py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c0476b]">RÉSERVATION EN LIGNE</p>
          <h1 className="mt-3 font-serif text-4xl text-[#2a1c15]">Prendre rendez-vous</h1>
          <p
            className="mt-1 text-[#9e3457]"
            style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "38px" }}
          >
            En quelques clics
          </p>
        </div>
      </section>

      {/* Steps indicator */}
      <div className="border-b border-[#f0dde6] bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-0 px-4 py-4">
          {[
            { n: 1, label: "Service" },
            { n: 2, label: "Date & Heure" },
            { n: 3, label: "Vos infos" },
            { n: 4, label: "Confirmation" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                    step >= s.n ? "bg-[#c0476b] text-white" : "border border-[#f0dde6] bg-white text-stone-400"
                  }`}
                >
                  {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                </div>
                <span className={`mt-1 text-[10px] font-semibold ${step >= s.n ? "text-[#c0476b]" : "text-stone-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < 3 && <div className={`mx-2 mb-4 h-px w-12 ${step > s.n ? "bg-[#c0476b]" : "bg-[#f0dde6]"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">

        {/* STEP 1: Choisir service */}
        {step === 1 && (
          <div>
            <h2 className="mb-6 font-serif text-2xl text-[#2a1c15]">Choisissez votre prestation</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${
                    selectedService === s.id
                      ? "border-[#c0476b] bg-[#fff0f4] shadow-md"
                      : "border-[#f0dde6] bg-white hover:border-[#c0476b]/50"
                  }`}
                >
                  <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${selectedService === s.id ? "bg-[#c0476b] text-white" : "bg-[#fff0f4] text-[#c0476b]"}`}>
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#2a1c15]">{s.label}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-stone-500">
                      <Clock className="h-3 w-3" /> {s.duration}
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#c0476b]">{s.price}</p>
                  </div>
                  {selectedService === s.id && <CheckCircle2 className="h-5 w-5 shrink-0 text-[#c0476b]" />}
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Date & Heure */}
        {step === 2 && (
          <div>
            <h2 className="mb-6 font-serif text-2xl text-[#2a1c15]">Choisissez la date et l&apos;heure</h2>

            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Date</p>
            <div className="flex gap-2 overflow-x-auto pb-3">
              {days.map((d) => {
                const key = d.date.toISOString().split("T")[0];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDay(key)}
                    className={`flex shrink-0 flex-col items-center rounded-2xl border px-4 py-3 transition ${
                      selectedDay === key
                        ? "border-[#c0476b] bg-[#c0476b] text-white"
                        : "border-[#f0dde6] bg-white text-[#2a1c15] hover:border-[#c0476b]/50"
                    }`}
                  >
                    <span className="text-[10px] font-semibold uppercase">{d.dayName}</span>
                    <span className="text-xl font-bold">{d.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="mb-3 mt-8 text-[10px] font-bold uppercase tracking-wider text-stone-400">Heure</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                    selectedTime === t
                      ? "border-[#c0476b] bg-[#c0476b] text-white"
                      : "border-[#f0dde6] bg-white text-[#2a1c15] hover:border-[#c0476b]/50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-xs font-semibold text-stone-400 hover:text-[#c0476b]">
                ← Retour
              </button>
              <button
                disabled={!selectedDay || !selectedTime}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Vos infos */}
        {step === 3 && (
          <div>
            <h2 className="mb-2 font-serif text-2xl text-[#2a1c15]">Vos informations</h2>

            {/* Récapitulatif */}
            <div className="mb-6 rounded-2xl border border-[#f0dde6] bg-[#fff0f4] p-4 text-xs">
              <p className="font-bold text-[#c0476b]">Récapitulatif de votre réservation</p>
              <p className="mt-1 text-stone-600">
                <span className="font-semibold">Service :</span> {service?.label}
              </p>
              <p className="text-stone-600">
                <span className="font-semibold">Date :</span>{" "}
                {selectedDay ? new Date(selectedDay).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "—"}
              </p>
              <p className="text-stone-600">
                <span className="font-semibold">Heure :</span> {selectedTime}
              </p>
              <p className="text-stone-600">
                <span className="font-semibold">Prix :</span> {service?.price}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-400">Nom complet *</label>
                <input
                  required
                  type="text"
                  placeholder="Marie Dupont"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-[#f0dde6] px-4 py-3 text-sm outline-none focus:border-[#c0476b] focus:ring-1 focus:ring-[#c0476b]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-400">Téléphone / WhatsApp *</label>
                <input
                  required
                  type="tel"
                  placeholder="+243 ..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-[#f0dde6] px-4 py-3 text-sm outline-none focus:border-[#c0476b] focus:ring-1 focus:ring-[#c0476b]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-400">Email (optionnel)</label>
                <input
                  type="email"
                  placeholder="marie@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-[#f0dde6] px-4 py-3 text-sm outline-none focus:border-[#c0476b] focus:ring-1 focus:ring-[#c0476b]"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)} className="text-xs font-semibold text-stone-400 hover:text-[#c0476b]">
                  ← Retour
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]"
                >
                  <Calendar className="h-4 w-4" /> Confirmer le rendez-vous
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: Confirmation */}
        {step === 4 && submitted && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f4]">
              <CheckCircle2 className="h-10 w-10 text-[#c0476b]" />
            </div>
            <h2 className="font-serif text-3xl text-[#2a1c15]">Rendez-vous confirmé !</h2>
            <p
              className="mt-1 text-[#9e3457]"
              style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "32px" }}
            >
              À très bientôt {form.name} !
            </p>
            <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-[#f0dde6] bg-[#fff0f4] p-6 text-sm">
              <p><span className="font-bold text-[#c0476b]">Service :</span> {service?.label}</p>
              <p className="mt-1"><span className="font-bold text-[#c0476b]">Date :</span>{" "}
                {selectedDay ? new Date(selectedDay).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "—"}
              </p>
              <p className="mt-1"><span className="font-bold text-[#c0476b]">Heure :</span> {selectedTime}</p>
              <p className="mt-1"><span className="font-bold text-[#c0476b]">Prix :</span> {service?.price}</p>
            </div>
            <p className="mt-5 text-xs text-stone-500">
              Nous vous contacterons au <strong>{form.phone}</strong> pour confirmer votre rendez-vous.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/"
                className="rounded-full border border-[#f0dde6] bg-white px-6 py-3 text-xs font-bold text-[#2a1c15] hover:border-[#c0476b]"
              >
                Retour à l&apos;accueil
              </Link>
              <button
                onClick={() => { setStep(1); setSelectedService(null); setSelectedDay(null); setSelectedTime(null); setSubmitted(false); }}
                className="rounded-full bg-[#c0476b] px-6 py-3 text-xs font-bold text-white hover:bg-[#9e3457]"
              >
                Nouveau rendez-vous
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
