import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { MONTH_NAMES, getMonthReport } from "@/lib/stats";
import { renderReportPdf } from "@/lib/report-pdf";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!(await requireAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = new URL(req.url).searchParams;
  const now = new Date(Date.now() + 3600_000);
  const year = Number(sp.get("year") ?? now.getUTCFullYear());
  const month = Number(sp.get("month") ?? now.getUTCMonth() + 1);
  if (!Number.isInteger(year) || year < 2000 || year > 2100 || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Période invalide." }, { status: 400 });
  }

  const report = await getMonthReport(year, month);
  const pdf = await renderReportPdf({ ...report, monthName: MONTH_NAMES[month - 1] });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rapport-divay-${year}-${String(month).padStart(2, "0")}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
