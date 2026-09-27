import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserWithRoles } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await getUserWithRoles(session.userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { passwordHash: _, ...publicUser } = user;

  // Retourner l'utilisateur ET ses rôles pour que le frontend puisse rediriger
  return NextResponse.json({ 
    user: publicUser, 
    roles: session.roles ?? [] 
  });
}
