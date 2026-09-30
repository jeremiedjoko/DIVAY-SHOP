import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, userRoles, roles } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const limit = rateLimit(`login:${clientIp(req)}:${email}`);
    if (!limit.ok) {
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${Math.ceil(limit.retryAfterSec / 60)} minute(s).` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
      );
    }

    // Chercher l'utilisateur
    const userList = await db.select().from(users).where(eq(sql`lower(${users.email})`, email));
    if (userList.length === 0) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    const user = userList[0];

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    // Récupérer les rôles
    const uRoles = await db.select({
      roleName: roles.name
    }).from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id));

    const roleNames = uRoles.map(r => r.roleName);

    // Créer la session JWT sécurisée
    await createSession(user.id, roleNames);

    // Retourner les rôles pour que le frontend puisse rediriger correctement
    const isAdmin = roleNames.includes("SUPER_ADMIN") || roleNames.includes("VENDEUSE");
    return NextResponse.json({ success: true, roles: roleNames, redirectTo: isAdmin ? "/admin" : "/compte" });
  } catch (error) {
    console.error('Erreur connexion:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
