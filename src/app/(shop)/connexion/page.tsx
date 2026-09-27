"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ConnexionPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          password: fd.get("password"),
        }),
      });
      const data = (await res.json()) as { error?: string; redirectTo?: string };
      if (!res.ok) {
        setError(data.error ?? "Identifiants incorrects.");
        return;
      }
      router.push(data.redirectTo ?? "/compte");
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c0476b]">
            DIVAY BEAUTY
          </p>
          <h1 className="mt-2 font-serif text-3xl text-stone-900">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Accédez à votre espace personnel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm">
            <span className="font-medium text-stone-700">E-mail</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="votre@email.com"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-900/10"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-stone-700">Mot de passe</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-900/10"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-stone-900 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="font-medium text-[#c0476b] hover:underline"
          >
            Créer un compte
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-stone-500">
          <Link href="/suivi" className="hover:underline">
            Suivre une commande sans compte →
          </Link>
        </p>
      </div>
    </main>
  );
}
