import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getOrdersForUser } from "@/lib/orders";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const orders = await getOrdersForUser(session.userId);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Erreur historique commandes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
