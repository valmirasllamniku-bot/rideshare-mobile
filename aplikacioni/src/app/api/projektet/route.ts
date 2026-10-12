
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const result = await db.query(
      `SELECT id, emri, lokacioni, cmimi, vende, pershkrimi
       FROM projektet
       ORDER BY id`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Gabim gjatë marrjes së projekteve:", error);

    return NextResponse.json(
      { error: "Nuk mund të lexohen projektet nga databaza." },
      { status: 500 }
    );
  }
}

