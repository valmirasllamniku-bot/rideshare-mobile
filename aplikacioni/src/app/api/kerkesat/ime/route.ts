import { NextResponse } from "next/server";
import { profiliIm } from "@/lib/lejet";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profili = await profiliIm();

    if (!profili) {
      return NextResponse.json(
        { error: "Duhet të kyçesh me GitHub." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (profili.roli !== "klient") {
      return NextResponse.json(
        { error: "Kjo gjendje është vetëm për klientin." },
        { status: 403, headers: { "Cache-Control": "no-store" } }
      );
    }

    const sql = getSql();
    const rows = await sql`
      SELECT
        k.id,
        k.projekt_id,
        k.status,
        p.vende
      FROM public.kerkesa_oferta k
      JOIN public.projektet p ON p.id = k.projekt_id
      WHERE k.github_id = ${profili.id}
      ORDER BY k.id DESC
      LIMIT 1
    `;

    return NextResponse.json(
      { kerkesa: rows[0] ?? null },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Gabim gjatë marrjes së gjendjes së klientit:", error);
    return NextResponse.json(
      { error: "Gjendja nuk mund të merret." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
