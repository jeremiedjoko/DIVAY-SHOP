import { getSession } from "@/lib/session";
import { db } from "@/db";
import { products, users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";

async function getStats() {
  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  return {
    productCount: Number(productCount.count),
    userCount: Number(userCount.count),
    revenue: 0,
    orderCount: 0,
  };
}

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session?.roles?.includes("SUPER_ADMIN") && !session?.roles?.includes("VENDEUSE")) {
    redirect("/connexion");
  }

  const stats = await getStats();

  const kpis = [
    {
      label: "Chiffre d'affaires",
      value: `$${stats.revenue.toFixed(2)}`,
      sub: "Phase 4 — Checkout en cours",
      color: "text-stone-900",
    },
    {
      label: "Commandes",
      value: stats.orderCount,
      sub: "Phase 4 — en construction",
      color: "text-stone-900",
    },
    {
      label: "Produits actifs",
      value: stats.productCount,
      sub: "Catalogue en ligne",
      color: "text-stone-900",
    },
    {
      label: "Clients inscrits",
      value: stats.userCount,
      sub: "Comptes validés",
      color: "text-stone-900",
    },
  ];

  const quickActions = [
    { label: "Gérer les commandes", href: "/admin/commandes", desc: "Suivi, statuts, livreurs" },
    { label: "Gérer le catalogue", href: "/admin/catalogue", desc: "Ajouter, modifier, supprimer" },
    { label: "Créer une promotion", href: "/admin/promotions", desc: "Codes promo et réductions" },
    { label: "Voir les rapports", href: "/admin/rapports", desc: "CA, graphiques, exports PDF" },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <h1 className="font-serif text-3xl text-stone-900">Tableau de bord</h1>
        <p className="text-sm text-stone-400 mt-1">
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              {kpi.label}
            </p>
            <p className={`text-3xl font-serif mt-3 ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-stone-400 mt-2">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between bg-white rounded-2xl border border-stone-200 px-6 py-5 shadow-sm hover:border-stone-900 hover:shadow-md transition-all group"
            >
              <div>
                <p className="font-medium text-stone-900">{action.label}</p>
                <p className="text-sm text-stone-400 mt-0.5">{action.desc}</p>
              </div>
              <svg
                className="h-5 w-5 text-stone-300 group-hover:text-stone-900 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Status banner */}
      <div className="rounded-2xl border border-stone-200 bg-stone-900 text-white p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Statut du projet</p>
        <p className="font-serif text-xl mt-2">Phase 3 en cours — Catalogue & Commandes</p>
        <p className="text-sm text-white/60 mt-1">
          Le back-office est opérationnel. Les prochaines phases activeront le checkout complet,
          les quittances PDF clients, les graphiques de CA et la gestion des livreurs.
        </p>
        <div className="flex gap-2 mt-4">
          {["Auth ✓", "BDD ✓", "Layout ✓", "Catalogue →", "Checkout", "PDF", "Rapports"].map((s, i) => (
            <span
              key={s}
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                s.includes("✓")
                  ? "bg-green-500/20 text-green-300"
                  : s.includes("→")
                  ? "bg-[#c0476b]/30 text-[#e8876a]"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
