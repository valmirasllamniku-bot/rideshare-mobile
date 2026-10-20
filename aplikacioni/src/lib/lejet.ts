import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSql } from "@/lib/db";

export type Profil = {
  id: string;
  emri: string;
  roli: "klient" | "admin";
};

export type Kerkesa = {
  id: number;
  projekt_id: number;
  mesazhi: string;
  status: string;
  krijuar_me: string;
};

export async function profiliIm(): Promise<Profil | null> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;

  if (!id || !/^\d+$/.test(id)) {
    return null;
  }

  const sql = getSql();

  await sql`
    INSERT INTO profilet (github_id, emri)
    VALUES (${id}, ${session.user.name ?? "Klient"})
    ON CONFLICT (github_id) DO NOTHING
  `;

  const rows = await sql`
    SELECT github_id AS id, emri, roli
    FROM profilet
    WHERE github_id = ${id}
    LIMIT 1
  `;

  return (rows[0] as Profil | undefined) ?? null;
}

export async function kerkesaIme(): Promise<Kerkesa | null> {
  const p = await profiliIm();

  if (!p) {
    return null;
  }

  const sql = getSql();

  const rows = await sql`
    SELECT id, projekt_id, mesazhi, status, krijuar_me
    FROM kerkesa_oferta
    WHERE github_id = ${p.id}
    ORDER BY id DESC
    LIMIT 1
  `;

  return (rows[0] as Kerkesa | undefined) ?? null;
}

export async function krijoKerkesen(
  projektId: string,
  mesazhi: string
): Promise<string> {
  const p = await profiliIm();

  if (!p) return "hyr";
  if (p.roli !== "klient") return "ndaluar";

  if (!/^[1-9]\d*$/.test(projektId)) return "fushe";

  const tekst = mesazhi.trim();

  if (tekst.length < 3 || tekst.length > 500) {
    return "fushe";
  }

  const sql = getSql();

  const projektet = await sql`
    SELECT id
    FROM projektet
    WHERE id = ${projektId}
    LIMIT 1
  `;

  if (projektet.length === 0) {
    return "projekt";
  }

  await sql`
    INSERT INTO kerkesa_oferta (projekt_id, github_id, mesazhi)
    VALUES (${projektId}, ${p.id}, ${tekst})
  `;

  return "krijuar";
}

export async function ndryshoKerkesen(
  id: string,
  mesazhi: string
): Promise<string> {
  const p = await profiliIm();

  if (!p) return "hyr";
  if (p.roli !== "klient") return "ndaluar";

  if (!/^[1-9]\d*$/.test(id)) return "fushe";

  const tekst = mesazhi.trim();

  if (tekst.length < 3 || tekst.length > 500) {
    return "fushe";
  }

  const sql = getSql();

  const rows = await sql`
    UPDATE kerkesa_oferta
    SET mesazhi = ${tekst}
    WHERE id = ${id}
      AND github_id = ${p.id}
    RETURNING id
  `;

  return rows.length === 1 ? "ruajtur" : "ndaluar";
}