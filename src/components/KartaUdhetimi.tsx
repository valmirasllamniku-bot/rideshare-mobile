import Link from "next/link";

type Props = {
  projekt: {
    id: string | number;
    titulli: string;
    pershkrimi: string;
    lokacioni: string;
    cmimi: string | number;
    vende: number;
  };
};

export default function KartaUdhetimi({ projekt }: Props) {
  return (
    <article>
      <h2>{projekt.titulli}</h2>
      <p>{projekt.pershkrimi}</p>
      <p>Lokacioni: {projekt.lokacioni}</p>
      <p>Çmimi: {projekt.cmimi}</p>
      <p>Vende të lira: {projekt.vende}</p>
      <Link href={`/udhetimi/${projekt.id}`}>Shiko projektin</Link>
    </article>
  );
}
