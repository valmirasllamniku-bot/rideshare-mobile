import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejProjektin } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";

export default async function ProjektiDetajet({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projekti = await gjejProjektin(id);

  if (!projekti) {
    notFound();
  }

  return (
    <main>
      <h1>{projekti.emri}</h1>
      <p>Lokacioni: {projekti.lokacioni}</p>
      <p>Çmimi: {projekti.cmimi}</p>
      <p>Vendet: {projekti.vende}</p>
      <p>{projekti.pershkrimi}</p>
      <Link href={`/udhetimi/${projekti.id}/kerkesa`}>
        Kërko ofertë
      </Link>
    </main>
  );
}
