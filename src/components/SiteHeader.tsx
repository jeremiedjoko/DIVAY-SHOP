"use client";

import Link from "next/link";
import { SHOP_NAME } from "@/lib/currency";
import { useCart } from "@/store/cart";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthUser = { id: string; name: string; email: string } | null;

export function SiteHeader() {
  const itemCount = useCart((s) => s.itemCount());
  const router = useRouter();
  const [user, setUser] = useState<AuthUser>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { user?: AuthUser; roles?: string[] } | null) => {
        setUser(d?.user ?? null);
        setUserRoles(d?.roles ?? []);
      })
      .catch(() => null);
  }, []);

  const isAdmin = userRoles.includes("SUPER_ADMIN") || userRoles.includes("VENDEUSE");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const navLinks = [
    { href: "/boutique", label: "Boutique" },
    { href: "/suivi", label: "Suivi commande" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf8f5]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="font-serif text-lg tracking-tight text-stone-900 sm:text-xl shrink-0">
          {SHOP_NAME}
        </Link>

        {/* Nav desktop */}
        <nav className="hidden sm:flex items-center gap-5 text-sm font-medium text-stone-700">
          <CurrencySwitcher />
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-stone-900">
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 transition hover:text-stone-900">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c0476b] text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-stone-200 bg-white py-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#c0476b] hover:bg-orange-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Administration
                  </Link>
                )}
                {!isAdmin && (
                  <Link
                    href="/compte"
                    className="block px-4 py-2 text-sm hover:bg-stone-50 text-stone-700"
                  >
                    Mon compte
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/connexion"
              className="transition hover:text-stone-900"
            >
              Connexion
            </Link>
          )}
        </nav>

        {/* Panier + Hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/panier"
            className="relative rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Panier
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c0476b] px-1 text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Hamburger mobile */}
          <button
            className="sm:hidden flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <span
              className={`block h-0.5 w-5 bg-stone-700 transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-stone-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-stone-700 transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="sm:hidden border-t border-stone-200 bg-[#faf8f5] px-4 py-4 space-y-1 animate-slide-down">
          <CurrencySwitcher />
          <div className="mt-2 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/compte"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
                >
                  Mon compte ({user.name.split(" ")[0]})
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-[#c0476b] hover:bg-orange-50"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
