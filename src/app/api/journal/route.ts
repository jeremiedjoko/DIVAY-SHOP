import { NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.published, 1))
    .orderBy(desc(articles.createdAt));
  return NextResponse.json({ articles: rows });
}
