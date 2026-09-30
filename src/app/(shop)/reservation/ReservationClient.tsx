"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { CATEGORIES, SERVICES, formatFC, getService } from "@/lib/services-catalog";

type Step = 1 | 2 | 3 | 4;
type Day = { iso: string; label: string; dayName: string; month: string };

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function ReservationClient({
  initialService,
  initialCategory,
}: {
  initialService?: string;
  initialCategory?: string;
}) {
  // Service déjà choisi en amont → on saute directement au choix de la date
  const [step, setStep] = useState<Step>(initialService ? 2 : 1);
  const [selectedService, setSelectedService] = useState<string | null>(initialService ?? null);
  const [category, setCategory] = useState<string>(initialCategory ?? "all");
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [taken, setTaken] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const service = getService(selectedService);

  // Les jours sont calculés côté client (fuseau de la cliente, pas de décalage serveur)
  useEffect(() => {
    const list: Day[] = [];
    const now = new Date();
    for (let i = 1; i <= 21; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      list.push({
        iso: toISO(d),
        label: String(d.getDate()),
        dayName: d.toLocaleDateString("fr-FR", { weekday: "short" }),
        month: d.toLocaleDateString("fr-FR", { month: "short" }),
      });
    }
    queueMicrotask(() => setDays(list));
  }, []);

  // Préremplit les infos si la cliente est connectée
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { user?: { name?: string; phone?: string; email?: string } } | null) => {
        if (data?.user) {
          setForm((f) => ({
            ...f,
            name: f.name || data.user?.name || "",
            phone: f.phone || data.user?.phone || "",
            email: f.email || data.user?.email || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Choix d'un jour : charge les créneaux libres (dans le gestionnaire, pas dans un effet)
  function pickDay(iso: string) {
    setSelectedDay(iso);
    setSelectedTime(null);
    setLoadingSlots(true);
    setError(null);
    fetch(`/api/reservations/availability?date=${iso}`)
      .then((r) => r.json())
      .then((data: { slots: string[]; taken: string[] }) => {
        setSlots(data.slots);
        setTaken(data.taken);
      })
      .catch(() => setError("Impossible de charger les horaires. Réessayez."))
      .finally(() => setLoadingSlots(false));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!service || !selectedDay || !selectedTime) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: service.slug,
          date: selectedDay,
          time: selectedTime,
          ...form,
        }),
      });
      const data = (await res.json()) as { reference?: string; error?: string };
      if (!res.ok || !data.reference) {
        if (res.status === 409 && selectedDay) {
          setStep(2);
          pickDay(selectedDay); // rafraîchit les créneaux disponibles
        }
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setReference(data.reference);
      setStep(4);
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(1);
    setSelectedService(null);
    setSelectedDay(null);
    setSelectedTime(null);
    setReference(null);
    setError(null);
  }

  const dateLabel = selectedDay
    ? new Date(`${selectedDay}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    : "—";

  function icsHref() {
    if (!service || !selectedDay || !selectedTime) return "#";
    const start = new Date(`${selectedDay}T${selectedTime}:00`);
    const end = new Date(start.getTime() + service.durationMin * 60000);
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
      `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
      `SUMMARY:${service.name} — Divay Beauty`, `DESCRIPTION:Réf. ${reference ?? ""}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  }

  const visibleServices = SERVICES.filter((s) => category === "all" || s.category === category);

  return (
    <main className="bg-[#fdfbf7]">
      <section className="bg-[#fff0f4] py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c0476b]">RÉSERVATION EN LIGNE</p>
          <h1 className="mt-3 font-serif text-4xl text-[#2a1c15]">Prendre rendez-vous</h1>
          <p className="mt-1 text-[#9e3457]" style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "34px" }}>
            En quelques clics
          </p>
        </div>
      </section>

      <div className="border-b border-[#f0dde6] bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-center px-2 py-4">
          {[
            { n: 1, label: "Service" },
            { n: 2, label: "Date & Heure" },
            { n: 3, label: "Vos infos" },
            { n: 4, label: "Confirmation" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${step >= s.n ? "bg-[#c0476b] text-white" : "border border-[#f0dde6] bg-white text-stone-400"}`}>
                  {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                </div>
                <span className={`mt-1 text-[10px] font-semibold ${step >= s.n ? "text-[#c0476b]" : "text-stone-400"}`}>{s.label}</span>
              </div>
              {i < 3 && <div className={`mx-1.5 mb-4 h-px w-6 sm:mx-2 sm:w-12 ${step > s.n ? "bg-[#c0476b]" : "bg-[#f0dde6]"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {error && step !== 4 && (
          <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>
        )}

        {/* ÉTAPE 1 — Prestation */}
        {step === 1 && (
          <div>
            <h2 className="mb-5 font-serif text-2xl text-[#2a1c15]">Choisissez votre prestation</h2>
            <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
              {[{ slug: "all", title: "Toutes", emoji: "" }, ...CATEGORIES].map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${category === c.slug ? "border-[#c0476b] bg-[#c0476b] text-white" : "border-[#f0dde6] bg-white text-stone-600 hover:border-[#c0476b]/50"}`}
                >
                  {c.emoji} {c.title}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleServices.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => setSelectedService(s.slug)}
                  className={`rounded-2xl border p-4 text-left transition ${selectedService === s.slug ? "border-[#c0476b] bg-[#fff0f4] shadow-md" : "border-[#f0dde6] bg-white hover:border-[#c0476b]/50"}`}
                >
                  <p className="text-sm font-bold text-[#2a1c15]">{s.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-stone-500"><Clock className="h-3 w-3" /> {s.duration}</p>
                  <p className="mt-1 text-xs font-bold text-[#c0476b]">{formatFC(s.price)}</p>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuer <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 — Date et heure */}
        {step === 2 && service && (
          <div>
            <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[#f0dde6] bg-[#fff0f4] px-4 py-3">
              <div>
                <p className="text-sm font-bold text-[#2a1c15]">{service.name}</p>
                <p className="text-[11px] text-stone-500">{service.duration} · {formatFC(service.price)}</p>
              </div>
              <button onClick={() => setStep(1)} className="shrink-0 text-[11px] font-semibold text-[#c0476b] underline">Changer</button>
            </div>

            <h2 className="mb-4 font-serif text-2xl text-[#2a1c15]">Choisissez une date</h2>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
              {days.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => pickDay(d.iso)}
                  className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-3 transition ${selectedDay === d.iso ? "border-[#c0476b] bg-[#c0476b] text-white" : "border-[#f0dde6] bg-white hover:border-[#c0476b]/50"}`}
                >
                  <span className="text-[10px] uppercase opacity-80">{d.dayName}</span>
                  <span className="text-lg font-bold">{d.label}</span>
                  <span className="text-[10px] opacity-80">{d.month}</span>
                </button>
              ))}
            </div>

            {selectedDay && (
              <div className="mt-8">
                <h3 className="mb-3 font-serif text-xl text-[#2a1c15]">Choisissez une heure</h3>
                {loadingSlots ? (
                  <p className="flex items-center gap-2 text-xs text-stone-500"><Loader2 className="h-4 w-4 animate-spin" /> Chargement des horaires…</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((t) => {
                      const isTaken = taken.includes(t);
                      return (
                        <button
                          key={t}
                          disabled={isTaken}
                          onClick={() => setSelectedTime(t)}
                          className={`rounded-xl border py-3 text-sm font-semibold transition ${isTaken ? "cursor-not-allowed border-stone-100 bg-stone-50 text-stone-300 line-through" : selectedTime === t ? "border-[#c0476b] bg-[#c0476b] text-white" : "border-[#f0dde6] bg-white hover:border-[#c0476b]/50"}`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-xs font-semibold text-stone-400 hover:text-[#c0476b]">← Retour</button>
              <button
                disabled={!selectedDay || !selectedTime}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuer <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — Coordonnées */}
        {step === 3 && service && (
          <div>
            <h2 className="mb-4 font-serif text-2xl text-[#2a1c15]">Vos informations</h2>
            <div className="mb-6 rounded-2xl border border-[#f0dde6] bg-[#fff0f4] p-4 text-xs text-stone-600">
              <p className="font-bold text-[#c0476b]">Récapitulatif</p>
              <p className="mt-1"><span className="font-semibold">Service :</span> {service.name}</p>
              <p><span className="font-semibold">Date :</span> {dateLabel} à {selectedTime}</p>
              <p><span className="font-semibold">Prix :</span> {formatFC(service.price)} (à régler au salon)</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "name", label: "Nom complet *", type: "text", req: true, ph: "Marie Dupont", ac: "name" },
                { key: "phone", label: "Téléphone / WhatsApp *", type: "tel", req: true, ph: "+243 ...", ac: "tel" },
                { key: "email", label: "Email (optionnel)", type: "email", req: false, ph: "marie@email.com", ac: "email" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-400">{f.label}</label>
                  <input
                    required={f.req}
                    type={f.type}
                    autoComplete={f.ac}
                    placeholder={f.ph}
                    value={form[f.key as "name" | "phone" | "email"]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full rounded-xl border border-[#f0dde6] px-4 py-3 text-base outline-none focus:border-[#c0476b] focus:ring-1 focus:ring-[#c0476b]"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-400">Précisions (optionnel)</label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Ex : mariage le 14, peau sensible…"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl border border-[#f0dde6] px-4 py-3 text-base outline-none focus:border-[#c0476b] focus:ring-1 focus:ring-[#c0476b]"
                />
              </div>
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)} className="text-xs font-semibold text-stone-400 hover:text-[#c0476b]">← Retour</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[#c0476b] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457] disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                  {submitting ? "Envoi…" : "Confirmer le rendez-vous"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ÉTAPE 4 — Confirmation (uniquement après enregistrement réel) */}
        {step === 4 && reference && service && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f4]">
              <CheckCircle2 className="h-10 w-10 text-[#c0476b]" />
            </div>
            <h2 className="font-serif text-3xl text-[#2a1c15]">Demande enregistrée !</h2>
            <p className="mt-1 text-[#9e3457]" style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "30px" }}>
              À très bientôt {form.name.split(" ")[0]} !
            </p>
            <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-[#f0dde6] bg-[#fff0f4] p-6 text-left text-sm">
              <p><span className="font-bold text-[#c0476b]">Référence :</span> {reference}</p>
              <p className="mt-1"><span className="font-bold text-[#c0476b]">Service :</span> {service.name}</p>
              <p className="mt-1"><span className="font-bold text-[#c0476b]">Date :</span> {dateLabel} à {selectedTime}</p>
              <p className="mt-1"><span className="font-bold text-[#c0476b]">Prix :</span> {formatFC(service.price)}</p>
            </div>
            <p className="mt-5 text-xs text-stone-500">
              Le salon vous contactera au <strong>{form.phone}</strong> pour confirmer votre rendez-vous.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={icsHref()} download={`rendez-vous-${reference}.ics`} className="rounded-full border border-[#f0dde6] bg-white px-6 py-3 text-xs font-bold text-[#2a1c15] hover:border-[#c0476b]">
                Ajouter au calendrier
              </a>
              <Link href="/" className="rounded-full border border-[#f0dde6] bg-white px-6 py-3 text-xs font-bold text-[#2a1c15] hover:border-[#c0476b]">
                Accueil
              </Link>
              <button onClick={reset} className="rounded-full bg-[#c0476b] px-6 py-3 text-xs font-bold text-white hover:bg-[#9e3457]">
                Nouveau rendez-vous
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
