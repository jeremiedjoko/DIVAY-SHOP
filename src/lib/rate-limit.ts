// Limiteur simple en mémoire (par instance serveur) : freine le brute-force sur la connexion.
// Pour une protection complète en production, à remplacer par un stockage partagé (Upstash/Redis).
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, max = 8, windowMs = 10 * 60 * 1000): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  entry.count += 1;
  if (entry.count > max) return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  return { ok: true, retryAfterSec: 0 };
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
