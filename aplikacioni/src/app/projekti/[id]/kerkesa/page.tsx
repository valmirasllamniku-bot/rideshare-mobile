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
    <main className="app-shell offer-page">
      <Link className="app-back-link" href={`/projekti/${projekti.id}`}>← Kthehu te projekti</Link>
      <header className="offer-heading">
        <span>KËRKESË PËR OFERTË</span>
        <h1>Kërko ofertë</h1>
        <p>Na trego pak për projektin tënd dhe do të të kontaktojmë.</p>
      </header>
      <section className="app-card">
        <p>Projekti: <strong>{projekti.emri}</strong></p>
        <p>Vende të lira: <strong>{projekti.vende}</strong></p>
        <FormaKerkese action={krijoKerkeseAction} projektId={String(projekti.id)} />
      </section>
    </main>
  );
}
