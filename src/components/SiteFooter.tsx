import { SHOP_NAME } from "@/lib/currency";
import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone-800/60 bg-[#0f0e0d] text-stone-400">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-3">

          {/* Colonne 1 — Marque */}
          <div>
            <p className="font-serif text-xl tracking-wide text-white">{SHOP_NAME}</p>
            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              Une sélection exclusive de cosmétiques et soins haut de gamme, livrés à Kinshasa.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://wa.me/243000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-800 text-stone-500 transition hover:border-[#c45c3e] hover:text-[#c45c3e]"
                aria-label="WhatsApp"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/divaybeauty"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-800 text-stone-500 transition hover:border-[#c45c3e] hover:text-[#c45c3e]"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Colonne 2 — Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-600">
              Navigation
            </p>
            <ul className="mt-5 space-y-3">
              {[
                { href: "/boutique", label: "Boutique" },
                { href: "/panier", label: "Mon panier" },
                { href: "/connexion", label: "Mon compte" },
                { href: "/suivi", label: "Suivi de commande" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-600">
              Contact
            </p>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <span className="text-stone-500">Kinshasa, R.D. Congo</span>
              </li>
              <li>
                <a href="https://wa.me/243000000000" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  +243 000 000 000
                </a>
              </li>
              <li>
                <a href="mailto:contact@divaybeauty.com" className="transition hover:text-white">
                  contact@divaybeauty.com
                </a>
              </li>
              <li className="text-stone-600">Lun – Sam · 8h à 19h</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-stone-800/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-600">© {year} {SHOP_NAME}</p>
          <p className="text-xs text-stone-700">Kinshasa · République Démocratique du Congo</p>
        </div>
      </div>
    </footer>
  );
}
