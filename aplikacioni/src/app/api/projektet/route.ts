import { getSql } from "../../../lib/db";
import { NextResponse } from "next/server";



export async function GET(request: Request) {
  try {
    const sql = getSql();
    const id = new URL(request.url).searchParams.get("id");

    if (id !== null) {
      if (!/^[1-9]\d*$/.test(id)) {
        return NextResponse.json({ error: "ID e projektit nuk është valide." }, { status: 400 });
      }

      const projektet = await sql`
        SELECT id, emri, lokacioni, cmimi, vende, pershkrimi
        FROM public.projektet
        WHERE id = ${Number(id)}
        LIMIT 1
      `;

      if (projektet.length === 0) {
        return NextResponse.json({ error: "Projekti nuk u gjet." }, { status: 404 });
      }

      return NextResponse.json(projektet[0], {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const projektet = await sql`
      SELECT id, emri, lokacioni, cmimi, vende, pershkrimi
      FROM projektet
      ORDER BY id
    `;

    return NextResponse.json(projektet, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Gabim gjatë marrjes së projekteve:", error);

    return NextResponse.json(
      { error: "Nuk mund të merren projektet nga databaza." },
      { status: 500 }
    );
  }
}

