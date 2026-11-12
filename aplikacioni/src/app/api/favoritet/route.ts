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

    const sql = getSql();

    const favoritet = await sql`
      SELECT projekt_id
      FROM public.projektet_favoritet
      WHERE github_id = ${profili.id}
      ORDER BY krijuar_me DESC
    `;

    return NextResponse.json(
      favoritet.map((item) => Number(item.projekt_id))
    );
  } catch (error) {
    console.error("Gabim gjatë marrjes së preferencave:", error);
    return NextResponse.json(
      { error: "Nuk mund të merren preferencat." },
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

    if (profili.roli !== "klient") {
      return NextResponse.json(
        { error: "Nuk ke leje për këtë veprim." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const projektId = Number(body.projektId);

    if (
      !Number.isSafeInteger(projektId) ||
      projektId < 1
    ) {
      return NextResponse.json(
        { error: "ID e projektit nuk është valide." },
        { status: 400 }
      );
    }

    const sql = getSql();

    const projektet = await sql`
      SELECT id
      FROM public.projektet
      WHERE id = ${projektId}
      LIMIT 1
    `;

    if (projektet.length === 0) {
      return NextResponse.json(
        { error: "Projekti nuk ekziston." },
        { status: 404 }
      );
    }

    await sql`
      INSERT INTO public.projektet_favoritet
        (github_id, projekt_id)
      VALUES (${profili.id}, ${projektId})
      ON CONFLICT (github_id, projekt_id) DO NOTHING
    `;

    return NextResponse.json({
      success: true,
      projektId,
      favorite: true,
    });
  } catch (error) {
    console.error("Gabim gjatë ruajtjes së preferencës:", error);
    return NextResponse.json(
      { error: "Nuk u ruajt projekti i preferuar." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const profili = await profiliIm();

    if (!profili) {
      return NextResponse.json(
        { error: "Duhet të kyçesh me GitHub." },
        { status: 401 }
      );
    }

    if (profili.roli !== "klient") {
      return NextResponse.json(
        { error: "Nuk ke leje për këtë veprim." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const projektId = Number(body.projektId);

    if (
      !Number.isSafeInteger(projektId) ||
      projektId < 1
    ) {
      return NextResponse.json(
        { error: "ID e projektit nuk është valide." },
        { status: 400 }
      );
    }

    const sql = getSql();

    await sql`
      DELETE FROM public.projektet_favoritet
      WHERE github_id = ${profili.id}
        AND projekt_id = ${projektId}
    `;

    return NextResponse.json({
      success: true,
      projektId,
      favorite: false,
    });
  } catch (error) {
    console.error("Gabim gjatë heqjes së preferencës:", error);
    return NextResponse.json(
      { error: "Nuk u hoq projekti i preferuar." },
      { status: 500 }
    );
  }
}
