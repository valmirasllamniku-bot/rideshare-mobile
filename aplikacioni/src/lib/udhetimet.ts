
import "server-only";
import { getSql } from "./db";

export type Projekt = {
  id: number;
  emri: string;
  lokacioni: string;
  cmimi: string;
  vende: number;
  pershkrimi: string;
};

export async function gjejProjektin(
  id: string
): Promise<Projekt | undefined> {
  const sql = getSql();
  const numerId = Number(id);

  if (!Number.isInteger(numerId) || numerId < 1) {
    return undefined;
  }

  const rows = await sql`
    SELECT id, emri, lokacioni, cmimi, vende, pershkrimi
    FROM projektet
    WHERE id = ${numerId}
    LIMIT 1
  `;

  return rows[0] as Projekt | undefined;
}
