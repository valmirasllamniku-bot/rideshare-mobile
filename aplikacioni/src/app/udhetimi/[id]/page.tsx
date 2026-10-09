
import Link from "next/link";
import { udhetimet } from "../../udhetimet";
export const instant = false;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UdhetimiDetajet({ params }: Props) {
  const { id } = await params;

  const projekti = udhetimet.find((p) => p.id === Number(id));

  if (!projekti) {
    return (
      <main>
        <h1>Projekti nuk u gjet</h1>
        <p>Ky projekt nuk ekziston.</p>
        <Link href="/">Kthehu te projektet</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>{projekti.titulli}</h1>
      <p>{projekti.pershkrimi}</p>
      <p><strong>Lokacioni:</strong> {projekti.lokacioni}</p>
      <p><strong>Çmimi:</strong> {projekti.cmimi}</p>
      <p><strong>Vende:</strong> {projekti.vende}</p>

      {projekti.vende > 0 ? (
        <Link href={`/udhetimi/${id}/kerkesa`}>
          Kërko ofertë
        </Link>
      ) : (
        <button disabled>Nuk ka vende të lira</button>
      )}
    </main>
  );
}
