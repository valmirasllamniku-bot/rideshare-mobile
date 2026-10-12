import { getSql } from "../../../lib/db";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    const sql = getSql();

    const projektet = await sql`
      SELECT id, emri, lokacioni, cmimi, vende, pershkrimi
      FROM projektet
      ORDER BY id
    `;

    return NextResponse.json(projektet);
  } catch (error) {
    console.error("Gabim gjatë marrjes së projekteve:", error);

    return NextResponse.json(
      { error: "Nuk mund të merren projektet nga databaza." },
      { status: 500 }
    );
  }
}

