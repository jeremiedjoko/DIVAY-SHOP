"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { Calendar, ShoppingBag } from "lucide-react";

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "DIVAY BEAUTY";

export function SiteHeader() {
  const itemCount = useCart((s) => s.itemCount());

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#f0dde6]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link href="/" className="flex flex-col items-center justify-center group">
          {/* Monogramme DB élégant */}
          <div className="relative flex items-center justify-center">
            {/* Cercle décoratif derrière */}
            <div className="absolute inset-0 rounded-full border border-[#c0476b]/20 scale-125" />
            <span
              className="relative font-serif text-[28px] leading-none tracking-[-0.02em] text-[#2a1c15] group-hover:text-[#c0476b] transition-colors duration-300"
              style={{ letterSpacing: "0.08em" }}
            >
              <span className="text-[#c0476b]">D</span>
              <span className="inline-block w-[1px] h-5 bg-[#c0476b]/30 mx-0.5 align-middle" />
              <span>B</span>
            </span>
          </div>
          {/* Nom de la marque */}
          <span
            className="mt-0.5 text-[9px] uppercase tracking-[0.35em] text-[#2a1c15]/70 font-medium"
          >
            {shopName}
          </span>
          {/* Tagline cursive */}
          <span
            className="text-[#c0476b]/70 leading-none"
            style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "11px" }}
          >
            Sublimez votre beauté
          </span>
        </Link>

        {/* NAVIGATION (DESKTOP) */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-stone-600">
          <Link href="/" className="text-[#c0476b] border-b-2 border-[#c0476b] pb-1">Accueil</Link>
          <Link href="/prestations" className="hover:text-[#c0476b] transition">Nos services</Link>
          <Link href="/tarifs" className="hover:text-[#c0476b] transition">Tarifs</Link>
          <Link href="/boutique" className="flex items-center gap-1.5 hover:text-[#c0476b] transition">
            <ShoppingBag className="h-3.5 w-3.5" />
            Boutique
          </Link>
          <Link href="/a-propos" className="hover:text-[#c0476b] transition">À propos</Link>
          <Link href="/galerie" className="hover:text-[#c0476b] transition">Galerie</Link>
          <Link href="/contact" className="text-stone-900 font-bold transition hover:text-[#c0476b]">Contact</Link>
        </nav>

        {/* CTA BUTTON */}
        <div className="flex items-center gap-3">
          {/* Icône panier si articles */}
          {itemCount > 0 && (
            <Link href="/panier" className="relative flex items-center justify-center h-10 w-10 rounded-full border border-[#f0dde6] text-stone-700 hover:border-[#c0476b] transition">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c0476b] text-[9px] font-bold text-white">
                {itemCount}
              </span>
            </Link>
          )}
          <Link
            href="/reservation"
            className="flex items-center gap-2 rounded-full bg-[#c0476b] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9e3457]"
          >
            <Calendar className="h-3.5 w-3.5" />
            Rendez-vous
            <span className="ml-0.5">→</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
