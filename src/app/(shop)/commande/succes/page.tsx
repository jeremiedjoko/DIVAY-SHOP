import Link from "next/link";

type Props = { searchParams: Promise<{ order?: string; mode?: string; session_id?: string }> };

export default async function SuccesPage({ searchParams }: Props) {
  const { order, mode, session_id } = await searchParams;
  const isCod = mode === "cod";

  return (
    <main className="mx-auto max-w-lg px-4 py-20 sm:px-6">
      <div className="rounded-3xl border border-stone-200 bg-white p-10 shadow-sm text-center">
        {/* Checkmark animé */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600 animate-check"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mt-6 font-serif text-3xl text-stone-900">
          Merci pour votre commande ! 🎉
        </h1>

        {order && (
          <p className="mt-2 font-mono text-xs text-stone-400 break-all">
            Réf. #{order.slice(0, 8)}…
          </p>
        )}

        <div className="mt-8 rounded-2xl border border-stone-100 bg-stone-50 p-6 text-left space-y-4 text-sm text-stone-600">
          {isCod ? (
            <>
              <div className="flex gap-3">
                <svg className="h-5 w-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline strokeLinecap="round" strokeLinejoin="round" points="3.27 6.96 12 12.01 20.73 6.96"/><line strokeLinecap="round" strokeLinejoin="round" x1="12" y1="22.08" x2="12" y2="12"/></svg>
                <span>Votre commande est enregistrée et sera préparée dans les plus brefs délais.</span>
              </div>
              <div className="flex gap-3">
                <svg className="h-5 w-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect strokeLinecap="round" strokeLinejoin="round" x="2" y="6" width="20" height="12" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01"/><path strokeLinecap="round" strokeLinejoin="round" d="M17 12h.01"/><path strokeLinecap="round" strokeLinejoin="round" d="M7 12h.01"/></svg>
                <span>Veuillez préparer le règlement en espèces lors de la réception.</span>
              </div>
              <div className="flex gap-3">
                <svg className="h-5 w-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>Notre service client vous contactera rapidement pour confirmer la livraison.</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-3">
                <svg className="h-5 w-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline strokeLinecap="round" strokeLinejoin="round" points="20 6 9 17 4 12"/></svg>
                <span>Votre paiement a été vérifié et confirmé avec succès.</span>
              </div>
              <div className="flex gap-3">
                <svg className="h-5 w-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline strokeLinecap="round" strokeLinejoin="round" points="3.27 6.96 12 12.01 20.73 6.96"/><line strokeLinecap="round" strokeLinejoin="round" x1="12" y1="22.08" x2="12" y2="12"/></svg>
                <span>Votre commande est en cours de préparation.</span>
              </div>
              <div className="flex gap-3">
                <svg className="h-5 w-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>Vous serez informée des détails de livraison sous 24h.</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {order && (
            <Link
              href={order ? `/suivi?order=${order}` : "/suivi"}
              className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-900"
            >
              Suivre ma commande
            </Link>
          )}
          <Link
            href="/boutique"
            className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </main>
  );
}
