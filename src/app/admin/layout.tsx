"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Users,
  Tag,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Commandes", href: "/admin/commandes", icon: ShoppingBag, exact: false },
  { name: "Catalogue", href: "/admin/catalogue", icon: Package, exact: false },
  { name: "Promotions", href: "/admin/promotions", icon: Tag, exact: false },
  { name: "Clients", href: "/admin/clients", icon: Users, exact: false },
  { name: "Rapports & CA", href: "/admin/rapports", icon: BarChart3, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/connexion");
  }

  function isActive(item: typeof navItems[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-[#0f0f0f] text-white">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div>
          <p className="font-serif text-xl tracking-widest text-white">DIVAY</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mt-0.5">
            Espace Administration
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white/40 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive(item)
                ? "bg-white/10 text-white"
                : "text-white/50 hover:bg-white/5 hover:text-white/90"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.name}
            {isActive(item) && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#c0476b]" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer sidebar */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:w-60 xl:w-64 shrink-0 flex-col">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-col lg:hidden transition-transform duration-300 ${
          sidebarOpen ? "flex translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-stone-500 hover:text-stone-900"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-widest">
              DIVAY BEAUTY
            </span>
            <span className="h-4 w-px bg-stone-200" />
            <span className="text-xs text-stone-500">CEO</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
