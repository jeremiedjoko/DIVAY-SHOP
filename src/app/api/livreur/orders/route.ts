import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

async function checkLivreur() {
  const session = await getSession();
  return session?.roles?.includes("LIVREUR") || session?.roles?.includes("SUPER_ADMIN");
}

export async function GET() {
  if (!await checkLivreur()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // Les livreurs ne voient que les commandes en cours de traitement ou expédiées
  const activeOrders = await db.query.orders.findMany({
    where: inArray(orders.status, ["PENDING", "PROCESSING", "SHIPPED"]),
    with: { lines: true },
  });

  return NextResponse.json({ orders: activeOrders });
}
