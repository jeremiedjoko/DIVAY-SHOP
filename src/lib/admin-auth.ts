import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "boutique_admin";

export function adminToken(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update("boutique-admin").digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = adminToken();
  if (!token) return false;
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (!value) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(token));
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
