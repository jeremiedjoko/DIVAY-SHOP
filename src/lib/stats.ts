import { db } from "@/db";
import { appointments } from "@/db/schema";

// Statuts de commande comptés dans le chiffre d'affaires (les commandes en attente ou annulées ne le sont pas)
const REVENUE_ORDER_STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

// Année / mois à Kinshasa (UTC+1), quel que soit le fuseau du serveur
function kin(d: Date) {
  const t = new Date(d.getTime() + 60 * 60 * 1000);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1 };
}

export type MonthStat = {
  month: number;
  shopFc: number;
  servicesFc: number;
  totalFc: number;
  orders: number;
  appointments: number;
};

export type Ranked = { name: string; qty: number; revenueFc: number };

async function loadAll() {
  const [allOrders, allAppts] = await Promise.all([
    db.query.orders.findMany({ with: { lines: true } }),
    db.select().from(appointments),
  ]);
  return { allOrders, allAppts };
}

export async function getYearStats(year: number) {
  const { allOrders, allAppts } = await loadAll();

  const months: MonthStat[] = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1, shopFc: 0, servicesFc: 0, totalFc: 0, orders: 0, appointments: 0,
  }));
  const products = new Map<string, Ranked>();
  const services = new Map<string, Ranked>();
  const yearsSet = new Set<number>([kin(new Date()).y]);

  for (const o of allOrders) {
    const { y, m } = kin(o.createdAt);
    yearsSet.add(y);
    if (y !== year || !REVENUE_ORDER_STATUSES.includes(o.status)) continue;
    const fc = Math.round(o.totalMinor / 100);
    months[m - 1].shopFc += fc;
    months[m - 1].orders += 1;
    for (const l of o.lines) {
      const cur = products.get(l.productName) ?? { name: l.productName, qty: 0, revenueFc: 0 };
      cur.qty += l.quantity;
      cur.revenueFc += Math.round((l.priceMinor * l.quantity) / 100);
      products.set(l.productName, cur);
    }
  }

  for (const a of allAppts) {
    const [y, m] = a.date.split("-").map(Number);
    yearsSet.add(y);
    if (y !== year || a.status !== "DONE") continue;
    months[m - 1].servicesFc += a.priceFc;
    months[m - 1].appointments += 1;
    const cur = services.get(a.serviceName) ?? { name: a.serviceName, qty: 0, revenueFc: 0 };
    cur.qty += 1;
    cur.revenueFc += a.priceFc;
    services.set(a.serviceName, cur);
  }

  for (const s of months) s.totalFc = s.shopFc + s.servicesFc;

  const top = (m: Map<string, Ranked>) => [...m.values()].sort((a, b) => b.revenueFc - a.revenueFc).slice(0, 5);

  return {
    year,
    years: [...yearsSet].sort((a, b) => b - a),
    months,
    totals: {
      shopFc: months.reduce((s, m) => s + m.shopFc, 0),
      servicesFc: months.reduce((s, m) => s + m.servicesFc, 0),
      totalFc: months.reduce((s, m) => s + m.totalFc, 0),
      orders: months.reduce((s, m) => s + m.orders, 0),
      appointments: months.reduce((s, m) => s + m.appointments, 0),
    },
    topProducts: top(products),
    topServices: top(services),
  };
}

/** Indicateurs « à traiter » pour l'accueil de l'admin. */
export async function getDashboardSnapshot() {
  const { allOrders, allAppts } = await loadAll();
  const today = new Date(Date.now() + 3600_000).toISOString().slice(0, 10);
  return {
    pendingOrders: allOrders.filter((o) => o.status === "PENDING").length,
    toShip: allOrders.filter((o) => o.status === "PAID" || o.status === "PROCESSING").length,
    pendingAppointments: allAppts.filter((a) => a.status === "PENDING").length,
    upcomingAppointments: allAppts
      .filter((a) => a.date >= today && (a.status === "PENDING" || a.status === "CONFIRMED"))
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 5)
      .map((a) => ({ id: a.id, reference: a.reference, name: a.name, serviceName: a.serviceName, date: a.date, time: a.time, status: a.status })),
    recentOrders: [...allOrders]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map((o) => ({ id: o.id, orderNumber: o.orderNumber, name: o.shippingName, totalFc: Math.round(o.totalMinor / 100), status: o.status, createdAt: o.createdAt.toISOString() })),
  };
}

export async function getMonthReport(year: number, month: number) {
  const { allOrders, allAppts } = await loadAll();
  const orders = allOrders
    .filter((o) => { const k = kin(o.createdAt); return k.y === year && k.m === month; })
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const appts = allAppts
    .filter((a) => a.date.startsWith(`${year}-${String(month).padStart(2, "0")}`))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const counted = orders.filter((o) => REVENUE_ORDER_STATUSES.includes(o.status));
  const done = appts.filter((a) => a.status === "DONE");
  const shopFc = counted.reduce((s, o) => s + Math.round(o.totalMinor / 100), 0);
  const servicesFc = done.reduce((s, a) => s + a.priceFc, 0);

  const products = new Map<string, Ranked>();
  for (const o of counted) for (const l of o.lines) {
    const cur = products.get(l.productName) ?? { name: l.productName, qty: 0, revenueFc: 0 };
    cur.qty += l.quantity; cur.revenueFc += Math.round((l.priceMinor * l.quantity) / 100);
    products.set(l.productName, cur);
  }
  const services = new Map<string, Ranked>();
  for (const a of done) {
    const cur = services.get(a.serviceName) ?? { name: a.serviceName, qty: 0, revenueFc: 0 };
    cur.qty += 1; cur.revenueFc += a.priceFc;
    services.set(a.serviceName, cur);
  }
  const rank = (m: Map<string, Ranked>) => [...m.values()].sort((a, b) => b.revenueFc - a.revenueFc);

  return {
    year, month,
    shopFc, servicesFc, totalFc: shopFc + servicesFc,
    ordersTotal: orders.length,
    ordersCounted: counted.length,
    ordersCancelled: orders.filter((o) => o.status === "CANCELLED").length,
    ordersPending: orders.filter((o) => o.status === "PENDING").length,
    appointmentsTotal: appts.length,
    appointmentsDone: done.length,
    appointmentsCancelled: appts.filter((a) => a.status === "CANCELLED").length,
    topProducts: rank(products).slice(0, 8),
    topServices: rank(services).slice(0, 8),
    orders: counted.map((o) => ({
      number: o.orderNumber,
      date: o.createdAt.toISOString().slice(0, 10),
      customer: o.shippingName,
      totalFc: Math.round(o.totalMinor / 100),
      status: o.status,
    })),
  };
}
export type MonthReport = Awaited<ReturnType<typeof getMonthReport>>;
