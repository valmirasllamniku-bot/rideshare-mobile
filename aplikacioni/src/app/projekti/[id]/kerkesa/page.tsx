
import Link from "next/link";
import { gjejProjektin } from "../../../../lib/udhetimet";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function KerkesaPerOferte({ params }: Props) {
  const { id } = await params;
  const projekti = await gjejProjektin(id);

  if (!projekti) {
    return (
      <main>
        <h1>Projekti nuk u gjet</h1>
        <Link href="/">Kthehu te projektet</Link>
      </main>
    );
  }

  return (
    <main>
      <Link href={`/projekti/${id}`}>
        ← Kthehu te detajet
      </Link>

      <h1>Kërkesë për ofertë</h1>
      <h2>{projekti.emri}</h2>
      <p>Lokacioni: {projekti.lokacioni}</p>
      <p>Çmimi: {projekti.cmimi}</p>

      {projekti.vende > 0 ? (
        <>
          <p>Simulim: Në pritje</p>
          <p>
            Kjo është vetëm demonstrim. Kërkesa nuk ruhet realisht.
          </p>
        </>
      ) : (
        <p>Nuk ka vende të lira.</p>
      )}
    </main>
  );
}
