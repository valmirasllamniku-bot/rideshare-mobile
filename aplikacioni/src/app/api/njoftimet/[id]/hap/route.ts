import { NextResponse } from "next/server";
import { profiliIm } from "@/lib/lejet";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const profili = await profiliIm();
    if (!profili) {
      return NextResponse.json({ error: "Duhet të kyçesh me GitHub." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }

    const { id: idTekst } = await context.params;
    if (!/^[1-9]\d*$/.test(idTekst) || !Number.isSafeInteger(Number(idTekst))) {
      return NextResponse.json({ error: "ID e njoftimit nuk është valide." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }

    const sql = getSql();
    const rows = await sql`
      WITH njoftimi AS (
        SELECT n.id AS njoftim_id, n.kerkesa_id, n.lloji
        FROM public.njoftimet n
        JOIN public.kerkesa_oferta k ON k.id = n.kerkesa_id
        WHERE n.id = ${idTekst}
          AND n.github_id = ${profili.id}
          AND k.github_id = ${profili.id}
      ),
      leximi AS (
        UPDATE public.njoftimet n
        SET lexuar_me = COALESCE(n.lexuar_me, NOW())
        FROM njoftimi j
        WHERE n.id = j.njoftim_id
        RETURNING n.id, n.lexuar_me
      )
      SELECT
        j.njoftim_id,
        l.lexuar_me,
        j.lloji,
        k.id AS kerkesa_id,
        k.projekt_id,
        k.mesazhi,
        k.status,
        k.krijuar_me,
        p.emri AS projekti,
        p.vende
      FROM njoftimi j
      JOIN leximi l ON l.id = j.njoftim_id
      JOIN public.kerkesa_oferta k ON k.id = j.kerkesa_id
      JOIN public.projektet p ON p.id = k.projekt_id
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Njoftimi nuk u gjet për këtë llogari." }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json(
      { njoftimi: { id: rows[0].njoftim_id, lexuar_me: rows[0].lexuar_me }, kerkesa: rows[0] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Gabim gjatë hapjes së njoftimit:", error);
    return NextResponse.json({ error: "Njoftimi nuk mund të hapet." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}