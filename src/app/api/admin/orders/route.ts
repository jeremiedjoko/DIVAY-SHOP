import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { desc } from "drizzle-orm";
import { orders } from "@/db/schema";

async function checkAdmin() {
  const session = await getSession();
  return session?.roles?.includes("SUPER_ADMIN") || session?.roles?.includes("VENDEUSE");
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // Les orders sont chargées avec leurs relations
  const allOrders = await db.query.orders.findMany({
    with: {
      user: true,
      lines: true,
    },
    orderBy: [desc(orders.createdAt)],
  });

  return NextResponse.json({ orders: allOrders });
}
