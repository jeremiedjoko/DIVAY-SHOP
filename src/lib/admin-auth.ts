import { getSession } from "./session";

export const COOKIE_NAME = "divay_session";

export function adminToken(): string | null {
  // Maintenu pour la rétrocompatibilité des anciens formulaires
  return "migrated-to-api";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  
  // Seuls le SUPER_ADMIN et la VENDEUSE ont accès au dashboard Admin
  return session.roles.includes('SUPER_ADMIN') || session.roles.includes('VENDEUSE');
}
