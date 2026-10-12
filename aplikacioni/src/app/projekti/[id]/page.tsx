
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const instant = false;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Projekt = {
  id: number;
  emri: string;
  lokacioni: string;
  cmimi: string;
  vende: number;
  pershkrimi: string;
};

export default async function ProjektiDetajet({ params }: Props) {
  const { id } = await params;
  const numerId = Number(id);

  if (!Number.isInteger(numerId) || numerId < 1) {
    notFound();
  }

  const result = await db.query<Projekt>(
    `SELECT id, emri, lokacioni, cmimi, vende, pershkrimi
     FROM projektet
     WHERE id = $1
     LIMIT 1`,
    [numerId]
  );

  const projekti = result.rows[0];

  if (!projekti) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Projekti nuk u gjet</h1>
        <p>Ky projekt nuk ekziston.</p>
        <Link href="/">Kthehu te projektet</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>{projekti.emri}</h1>

      <p>{projekti.pershkrimi}</p>

      <p>
        <strong>Lokacioni:</strong> {projekti.lokacioni}
      </p>

      <p>
        <strong>Çmimi:</strong> {projekti.cmimi}
      </p>

      <p>
        <strong>Vende:</strong> {projekti.vende}
      </p>

      {projekti.vende > 0 ? (
        <Link href={`/projekti/${projekti.id}/kerkesa`}>
          Kërko ofertë
        </Link>
      ) : (
        <p>Nuk ka vende të lira.</p>
      )}

      <p>
        <Link href="/">Kthehu te projektet</Link>
      </p>
    </main>
  );
}
