import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { db } from "@/db";

export async function GET() {
  if (!(await requireAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [users, orders, appts] = await Promise.all([
    db.query.users.findMany({ with: { roles: { with: { role: true } } } }),
    db.query.orders.findMany(),
    db.query.appointments.findMany(),
  ]);
  const clients = users
    .filter((u) => !u.roles.some((r) => ["SUPER_ADMIN", "VENDEUSE", "LIVREUR"].includes(r.role.name)))
    .map((u) => {
      const mine = orders.filter((o) => (o.userId === u.id || o.shippingEmail.toLowerCase() === u.email.toLowerCase()) && ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(o.status));
      return {
        id: u.id, name: u.name, email: u.email, phone: u.phone,
        createdAt: u.createdAt.toISOString(),
        orders: mine.length,
        spentFc: mine.reduce((s, o) => s + Math.round(o.totalMinor / 100), 0),
        appointments: appts.filter((a) => a.userId === u.id).length,
      };
    })
    .sort((a, b) => b.spentFc - a.spentFc);
  return NextResponse.json({ clients });
}
