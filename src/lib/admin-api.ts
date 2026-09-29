import { getSession } from "@/lib/session";

export async function requireAdminSession() {
  const session = await getSession();
  const ok =
    session?.roles?.includes("SUPER_ADMIN") || session?.roles?.includes("VENDEUSE");
  return ok ? session : null;
}
