import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET() {
  try {
    const sql = getSql();

    const udhetimet = await sql`
      SELECT id, emri, lokacioni, cmimi, vende, pershkrimi
      FROM public.projektet
      ORDER BY id
    `;

    return NextResponse.json(udhetimet);
  } catch (error) {
    console.error("Gabim gjatë marrjes së udhëtimeve:", error);

    return NextResponse.json(
      { error: "Nuk mund të merren të dhënat." },
      { status: 500 }
    );
  }
}