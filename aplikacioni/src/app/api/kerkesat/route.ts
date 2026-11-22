
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
        { status: 401 }
      );
    }

    if (profili.roli !== "admin") {
      return NextResponse.json(
        { error: "Nuk ke leje për t'i parë kërkesat." },
        { status: 403 }
      );
    }

    const sql = getSql();

    const kerkesat = await sql`
      SELECT
        k.id,
        k.projekt_id,
        k.github_id,
        k.mesazhi,
        k.status,
        k.krijuar_me,
        p.vende,
        p.emri AS projekti,
        pr.emri AS klienti
      FROM public.kerkesa_oferta k
      JOIN public.projektet p ON p.id = k.projekt_id
      JOIN public.profilet pr ON pr.github_id = k.github_id
      ORDER BY k.krijuar_me DESC
    `;

    return NextResponse.json(kerkesat, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Gabim gjatë marrjes së kërkesave:", error);

    return NextResponse.json(
      { error: "Kërkesat nuk mund të merren." },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const profili = await profiliIm();

    if (!profili) {
      return NextResponse.json(
        { error: "Duhet të kyçesh me GitHub." },
        { status: 401 }
      );
    }

    if (profili.roli !== "admin") {
      return NextResponse.json(
        { error: "Nuk ke leje për pranimin e kërkesave." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return NextResponse.json(
        { error: "ID e kërkesës nuk është valide." },
        { status: 400 }
      );
    }

    const sql = getSql();

    const rezultat = await sql`
      WITH target AS (
        SELECT id, projekt_id
        FROM public.kerkesa_oferta
        WHERE id = ${id}
          AND status IN ('e_re', 'ne pritje')
        FOR UPDATE
      ),
      zbritja AS (
        UPDATE public.projektet p
        SET vende = p.vende - 1
        FROM target t
        WHERE p.id = t.projekt_id
          AND p.vende > 0
        RETURNING p.id
      ),
      pranimi AS (
        UPDATE public.kerkesa_oferta k
        SET status = 'ne_shqyrtim'
        FROM target t
        JOIN zbritja z ON z.id = t.projekt_id
        WHERE k.id = t.id
        RETURNING k.id, k.projekt_id, k.status
      )
      SELECT * FROM pranimi
    `;

    if (rezultat.length === 0) {
      return NextResponse.json(
        { error: "Kërkesa nuk u pranua. Mund të mos ketë vende të lira ose të jetë trajtuar më parë." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      kerkesa: rezultat[0],
    });
  } catch (error) {
    console.error("Gabim gjatë pranimit të kërkesës:", error);

    return NextResponse.json(
      { error: "Kërkesa nuk mund të pranohet." },
      { status: 500 }
    );
  }
}
