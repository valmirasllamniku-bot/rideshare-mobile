import { NextResponse } from "next/server";
import { profiliIm } from "@/lib/lejet";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profili = await profiliIm();
    if (!profili) {
      return NextResponse.json({ error: "Duhet të kyçesh me GitHub." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }

    const sql = getSql();
    const njoftimet = await sql`
      SELECT
        n.id,
        n.kerkesa_id,
        n.lloji,
        n.krijuar_me,
        n.lexuar_me,
        k.projekt_id,
        p.emri AS projekti,
        k.mesazhi,
        k.status
      FROM public.njoftimet n
      JOIN public.kerkesa_oferta k ON k.id = n.kerkesa_id
      JOIN public.projektet p ON p.id = k.projekt_id
      WHERE n.github_id = ${profili.id}
      ORDER BY n.krijuar_me DESC
      LIMIT 50
    `;

    return NextResponse.json(njoftimet, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Gabim gjatë leximit të njoftimeve:", error);
    return NextResponse.json({ error: "Njoftimet nuk mund të lexohen." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}