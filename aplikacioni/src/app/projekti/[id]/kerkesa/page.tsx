import Link from "next/link";
import { gjejProjektin } from "../../../../lib/udhetimet";

export const instant = false;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Kerkesa({ params }: Props) {
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

      {projekti.vende > 0 ? (
        <>
          <h1>Simulim: Në pritje</h1>
          <p>
            Kërkesa për projektin "{projekti.emri}" është në pritje.
          </p>
          <p>
            Kjo është vetëm një demonstrim. Kërkesa nuk ruhet realisht.
          </p>
        </>
      ) : (
        <h1>Nuk ka vende të lira.</h1>
      )}
    </main>
  );
}