import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { randomUUID } from "crypto";

async function checkAdmin() {
  const session = await getSession();
  return session?.roles?.includes("SUPER_ADMIN") || session?.roles?.includes("VENDEUSE");
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const allCoupons = await db.select().from(coupons);
  return NextResponse.json({ coupons: allCoupons });
}

export async function POST(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = randomUUID();
  const code = String(body.code).toUpperCase().trim();
  
  await db.insert(coupons).values({
    id,
    code,
    discountPct: body.discountPct ? parseInt(body.discountPct, 10) : null,
    discountFix: body.discountFix ? parseInt(body.discountFix, 10) : null,
    usageLimit: body.usageLimit ? parseInt(body.usageLimit, 10) : null,
    isActive: 1,
  });

  const newCoupon = await db.query.coupons.findFirst({ where: (c, { eq }) => eq(c.id, id) });
  return NextResponse.json({ success: true, coupon: newCoupon });
}
