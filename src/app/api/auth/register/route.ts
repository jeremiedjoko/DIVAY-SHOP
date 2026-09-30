import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, userRoles, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, password, name, phone } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    // Insérer le nouvel utilisateur
    await db.insert(users).values({
      id: userId,
      email,
      name,
      phone: phone || null,
      passwordHash: hashedPassword,
    });

    // Assigner le rôle CLIENT par défaut
    const clientRole = await db.select().from(roles).where(eq(roles.name, 'CLIENT'));
    if (clientRole.length > 0) {
      await db.insert(userRoles).values({
        id: randomUUID(),
        userId: userId,
        roleId: clientRole[0].id
      });
    }

    // Créer la session directement
    await createSession(userId, ['CLIENT']);

    return NextResponse.json({ success: true, roles: ['CLIENT'] });
  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
