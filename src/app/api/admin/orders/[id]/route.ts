import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

async function checkAdmin() {
  const session = await getSession();
  return session?.roles?.includes("SUPER_ADMIN") || session?.roles?.includes("VENDEUSE");
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status, trackingNote } = await req.json();
  
  // En Phase 4, ceci mettra à jour la table orders en BDD
  return NextResponse.json({ success: true, orderId: id, status });
}
