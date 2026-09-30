import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET ?? (process.env.NODE_ENV === 'production' ? '' : 'dev-only-secret-not-for-production');
if (!secretKey || secretKey.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    // Sans secret solide, n'importe qui pourrait forger un cookie administrateur : on refuse de démarrer.
    throw new Error('SESSION_SECRET manquant ou trop court (32 caractères minimum).');
  }
}
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  roles: string[];
  expiresAt?: Date;
};

export async function encrypt(payload: Omit<SessionPayload, 'expiresAt'>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, userRoles: string[]) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
  const session = await encrypt({ userId, roles: userRoles });

  (await cookies()).set('divay_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const session = (await cookies()).get('divay_session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function destroySession() {
  (await cookies()).delete('divay_session');
}
