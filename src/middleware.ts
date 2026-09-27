import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedRoutes = ['/compte', '/panier/validation', '/suivi'];
const adminRoutes = ['/admin'];
const livreurRoutes = ['/livreur'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  const isLivreurRoute = livreurRoutes.some(route => path.startsWith(route));

  const cookie = req.cookies.get('divay_session')?.value;
  const session = await decrypt(cookie);

  // 1. Rediriger les non-connectés vers la page de connexion
  if ((isProtectedRoute || isAdminRoute || isLivreurRoute) && !session?.userId) {
    return NextResponse.redirect(new URL('/connexion', req.nextUrl));
  }

  // 2. Protection des routes d'Administration
  if (isAdminRoute) {
    const isAuthorized = session?.roles?.includes('SUPER_ADMIN') || session?.roles?.includes('VENDEUSE');
    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/compte', req.nextUrl)); // Redirection si pas le bon rôle
    }
  }

  // 3. Protection des routes Livreur
  if (isLivreurRoute) {
    const isAuthorized = session?.roles?.includes('LIVREUR') || session?.roles?.includes('SUPER_ADMIN');
    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/compte', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
