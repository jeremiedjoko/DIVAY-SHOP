"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { Calendar, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "DIVAY BEAUTY";

const navLinks = [
  { href: "/", label: "Accueil", exact: true },
  { href: "/prestations", label: "Nos services", exact: false },
  { href: "/tarifs", label: "Tarifs", exact: false },
  { href: "/boutique", label: "Boutique", icon: true, exact: false },
  { href: "/a-propos", label: "À propos", exact: false },
  { href: "/galerie", label: "Galerie", exact: false },
  { href: "/contact", label: "Contact", exact: false },
];

export function SiteHeader() {
  const itemCount = useCart((s) => s.itemCount());
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#f0dde6]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link href="/" className="flex flex-col items-center justify-center group">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#c0476b]/20 scale-125" />
            <span
              className="relative font-serif text-[28px] leading-none text-[#2a1c15] group-hover:text-[#c0476b] transition-colors duration-300"
              style={{ letterSpacing: "0.08em" }}
            >
              <span className="text-[#c0476b]">D</span>
              <span className="inline-block w-[1px] h-5 bg-[#c0476b]/30 mx-0.5 align-middle" />
              <span>B</span>
            </span>
          </div>
          <span className="mt-0.5 text-[9px] uppercase tracking-[0.35em] text-[#2a1c15]/70 font-medium">
            {shopName}
          </span>
          <span
            className="text-[#c0476b]/70 leading-none"
            style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "11px" }}
          >
            Sublimez votre beauté
          </span>
        </Link>

        {/* NAVIGATION (DESKTOP) */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-stone-600">
          {navLinks.map((link) => {
            const active = isActive(link.href, link.exact ?? false);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 transition pb-0.5 ${
                  active
                    ? "text-[#c0476b] border-b-2 border-[#c0476b]"
                    : "hover:text-[#c0476b] border-b-2 border-transparent"
                }`}
              >
                {link.icon && <ShoppingBag className="h-3.5 w-3.5" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA BUTTON */}
        <div className="flex items-center gap-3">
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
