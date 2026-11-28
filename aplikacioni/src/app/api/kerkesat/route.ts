import { NextResponse } from "next/server";
import { profiliIm } from "@/lib/lejet";
import { getSql } from "@/lib/db";
import { dergoNjoftimPush } from "@/lib/push";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const profili = await profiliIm();

    if (!profili) {
      return NextResponse.json(
        { error: "Kyçu në llogarinë tënde për të vazhduar." },
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
        { error: "Kyçu në llogarinë tënde për të vazhduar." },
        { status: 401 }
      );
    }

    if (profili.roli !== "admin") {
      return NextResponse.json(
        { error: "Nuk ke leje për trajtimin e kërkesave." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const id = Number(body.id);
    const veprimi = body.veprimi ?? "prano";

    if (!Number.isSafeInteger(id) || id < 1) {
      return NextResponse.json(
        { error: "ID e kërkesës nuk është valide." },
        { status: 400 }
      );
    }

    if (veprimi !== "prano" && veprimi !== "refuzo") {
      return NextResponse.json(
        { error: "Veprimi nuk është valid." },
        { status: 400 }
      );
    }

    const sql = getSql();

    if (veprimi === "refuzo") {
      const refuzimi = await sql`
        WITH pergjigjja AS (
          UPDATE public.kerkesa_oferta
          SET status = 'refuzuar'
          WHERE id = ${id}
            AND status IN ('e_re', 'ne pritje')
          RETURNING id, projekt_id, github_id, status
        ), njoftimi AS (
          INSERT INTO public.njoftimet (github_id, kerkesa_id, lloji)
          SELECT github_id, id, 'refuzuar'
          FROM pergjigjja
          ON CONFLICT (kerkesa_id) DO NOTHING
          RETURNING id
        )
        SELECT p.id, p.projekt_id, p.github_id, p.status, n.id AS njoftim_id
        FROM pergjigjja p
        LEFT JOIN njoftimi n ON TRUE
      `;

      if (refuzimi.length === 0) {
        return NextResponse.json(
          { error: "Kërkesa është trajtuar më parë ose nuk u gjet." },
          { status: 409 }
        );
      }

      await dergoNjoftimPush(String(refuzimi[0].github_id), {
        title: "Kërkesa u refuzua",
        body: "Administratori e refuzoi kërkesën tënde.",
        url: "/panel",
        tag: `kerkesa-${id}`,
      });

      return NextResponse.json({ success: true, kerkesa: refuzimi[0] });
    }

    const rezultati = await sql`
      WITH target AS (
        SELECT id, projekt_id, github_id
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
        RETURNING k.id, k.projekt_id, k.status, k.github_id
      ),
      njoftimi AS (
        INSERT INTO public.njoftimet (github_id, kerkesa_id, lloji)
        SELECT github_id, id, 'pranuar'
        FROM pranimi
        ON CONFLICT (kerkesa_id) DO NOTHING
        RETURNING id
      )
      SELECT p.id, p.projekt_id, p.github_id, p.status, n.id AS njoftim_id
      FROM pranimi p
      LEFT JOIN njoftimi n ON TRUE
    `;

    if (rezultati.length === 0) {
      return NextResponse.json(
        { error: "Kërkesa nuk u pranua. Mund të mos ketë vende të lira ose të jetë trajtuar më parë." },
        { status: 409 }
      );
    }

    await dergoNjoftimPush(String(rezultati[0].github_id), {
      title: "Kërkesa u pranua",
      body: "Administratori e pranoi kërkesën tënde.",
      url: "/panel",
      tag: `kerkesa-${id}`,
    });

    return NextResponse.json({ success: true, kerkesa: rezultati[0] });
  } catch (error) {
    console.error("Gabim gjatë trajtimit të kërkesës:", error);
    return NextResponse.json(
      { error: "Kërkesa nuk mund të përditësohet." },
      { status: 500 }
    );
  }
}
