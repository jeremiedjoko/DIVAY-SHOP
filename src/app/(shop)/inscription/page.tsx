"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InscriptionPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          password,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(
          data.error === "EMAIL_EXISTS"
            ? "Cet e-mail est déjà utilisé. Connectez-vous."
            : (data.error ?? "Erreur lors de la création du compte.")
        );
        return;
      }
      router.push("/compte");
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { name: "name", label: "Nom complet", type: "text", placeholder: "Divay Mukendi", autocomplete: "name" },
    { name: "email", label: "E-mail", type: "email", placeholder: "votre@email.com", autocomplete: "email" },
    { name: "phone", label: "Téléphone / WhatsApp", type: "tel", placeholder: "+243 8XX XXX XXX", autocomplete: "tel" },
    { name: "password", label: "Mot de passe", type: "password", placeholder: "Min. 6 caractères", autocomplete: "new-password" },
    { name: "confirm", label: "Confirmer le mot de passe", type: "password", placeholder: "••••••••", autocomplete: "new-password" },
  ] as const;

  return (
    <main className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c0476b]">
            DIVAY BEAUTY
          </p>
          <h1 className="mt-2 font-serif text-3xl text-stone-900">
            Créer un compte
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Suivez vos commandes facilement
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, type, placeholder, autocomplete }) => (
            <label key={name} className="block text-sm">
              <span className="font-medium text-stone-700">{label}</span>
              <input
                name={name}
                type={type}
                required
                autoComplete={autocomplete}
                placeholder={placeholder}
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-900/10"
              />
            </label>
          ))}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#c0476b] py-3 text-sm font-semibold text-white transition hover:bg-[#9e3457] disabled:opacity-60"
          >
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="font-medium text-[#c0476b] hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
