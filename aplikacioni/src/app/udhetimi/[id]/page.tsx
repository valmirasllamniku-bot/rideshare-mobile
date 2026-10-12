import Link from "next/link";
import { gjejProjektin } from "../../../lib/udhetimet";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function KerkesaPerOferte({ params }: Props) {
  const { id } = await params;
  const projekti = await gjejProjektin(id);

  if (!projekti) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Projekti nuk u gjet</h1>
        <Link href="/">Kthehu te projektet</Link>
      </main>
    );
  }

  if (projekti.vende <= 0) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Nuk ka vende të lira</h1>
        <Link href={`/udhetimi/${id}`}>Kthehu te projekti</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Kërkesë për ofertë</h1>
      <h2>{projekti.emri}</h2>
      <p>Lokacioni: {projekti.lokacioni}</p>
      <p>Çmimi: {projekti.cmimi}</p>
      <p>Simulim: Në pritje</p>
      <p>Kjo është vetëm demonstrim. Kërkesa nuk ruhet realisht.</p>
      <Link href={`/udhetimi/${id}`}>Kthehu te projekti</Link>
    </main>
  );
}