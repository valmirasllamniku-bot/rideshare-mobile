import Link from "next/link";
import { notFound } from "next/navigation";
import FormaKerkese from "@/components/FormaKerkese";
import { krijoKerkeseAction } from "@/app/panel/actions";
import { gjejProjektin } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";

export default async function KerkesaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projekti = await gjejProjektin(id);

  if (!projekti) notFound();

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 20 }}>
      <h1>Kërko ofertë</h1>
      <p>Projekti: <strong>{projekti.emri}</strong></p>
      <p>Vende të lira: <strong>{projekti.vende}</strong></p>
      <FormaKerkese action={krijoKerkeseAction} projektId={String(projekti.id)} />
      <p><Link href={`/projekti/${projekti.id}`}>Kthehu te projekti</Link></p>
    </main>
  );
}
