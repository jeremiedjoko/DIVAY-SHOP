import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { getDashboardSnapshot, getYearStats } from "@/lib/stats";

export async function GET(req: Request) {
  if (!(await requireAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const yearParam = Number(new URL(req.url).searchParams.get("year"));
  const year = Number.isInteger(yearParam) && yearParam > 2000 && yearParam < 2100
    ? yearParam
    : new Date(Date.now() + 3600_000).getUTCFullYear();
  const [stats, snapshot] = await Promise.all([getYearStats(year), getDashboardSnapshot()]);
  return NextResponse.json({ stats, snapshot });
}
