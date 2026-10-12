import Link from "next/link";
import { Suspense } from "react";
import { gjejProjektin } from "../../../lib/udhetimet";



type Props = {
  params: Promise<{ id: string }>;
};

export default function ProjektiDetajet({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main style={{ padding: "40px" }}>
          <p>Po ngarkohen të dhënat e projektit...</p>
        </main>
      }
    >
      <Detajet params={params} />
    </Suspense>
  );
}

async function Detajet({ params }: Props) {
  const { id } = await params;
  const projekti = await gjejProjektin(id);

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
      <p><strong>Lokacioni:</strong> {projekti.lokacioni}</p>
      <p><strong>Çmimi:</strong> {projekti.cmimi}</p>
      <p><strong>Vende të lira:</strong> {projekti.vende}</p>
      <p><strong>Përshkrimi:</strong> {projekti.pershkrimi}</p>
      <p>
        <Link href="/">Kthehu te projektet</Link>
      </p>
    </main>
  );
}
