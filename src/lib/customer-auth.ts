import { getSession } from "./session";
import { getUserWithRoles } from "./auth";

export const CUSTOMER_COOKIE = "divay_session";

export async function createCustomerSession(userId: string): Promise<string | null> {
  // L'API /api/auth/login s'en charge désormais. Maintenu pour la rétrocompatibilité.
  return "migrated-to-api";
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;
  
  const user = await getUserWithRoles(session.userId);
  if (!user) return null;
  
  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}

export async function isCustomerAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}
