
import Link from "next/link";
import { udhetimet } from "../../../udhetimet";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function KerkesaPerOferte({ params }: Props) {
  const { id } = await params;

  const projekti = udhetimet.find(
    (p) => p.id === Number(id)
  );

  if (!projekti) {
    return (
      <main>
        <h1>Projekti nuk u gjet</h1>
        <Link href="/">Kthehu te projektet</Link>
      </main>
    );
  }

  if (projekti.vende <= 0) {
    return (
      <main>
        <h1>Nuk ka vende të lira</h1>
        <Link href={`/udhetimi/${id}`}>
          Kthehu te projekti
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Kërkesë për ofertë</h1>
      <h2>{projekti.titulli}</h2>
      <p>Lokacioni: {projekti.lokacioni}</p>
      <p>Çmimi: {projekti.cmimi}</p>

      <p>
        Simulim: Në pritje
      </p>
      <p>
        Kjo është vetëm demonstrim. Kërkesa nuk ruhet realisht.
      </p>

      <Link href={`/udhetimi/${id}`}>
        Kthehu te projekti
      </Link>
    </main>
  );
}