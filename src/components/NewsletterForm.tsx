"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) setEmail("");
    } catch {
      setStatus("err");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre e-mail"
          className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white outline-none placeholder:text-white/40 focus:border-[#c0476b]"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-full bg-[#c0476b] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white disabled:opacity-60"
        >
          {loading ? "…" : "OK"}
        </button>
      </div>
      {status === "ok" ? (
        <p className="text-[10px] text-emerald-300">Merci, vous êtes inscrite.</p>
      ) : null}
      {status === "err" ? (
        <p className="text-[10px] text-red-300">E-mail invalide. Réessayez.</p>
      ) : null}
    </form>
  );
}
