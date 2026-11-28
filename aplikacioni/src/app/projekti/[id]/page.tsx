import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejProjektin } from "@/lib/udhetimet";
import Vendtakimi from "@/components/Vendtakimi";
import VendetLive from "@/components/VendetLive";

export const dynamic = "force-dynamic";

export default async function ProjektiDetajet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projekti = await gjejProjektin(id);
  if (!projekti) notFound();

  return (
    <main className="project-detail">
      <Link className="project-back" href="/">← Të gjitha projektet</Link>
      <span className="auth-eyebrow">DETAJET E PROJEKTIT</span>
      <h1>{projekti.emri}</h1>
      <section className="app-card project-overview">
        <p><strong>Lokacioni</strong><br />{projekti.lokacioni}</p>
        <p><strong>Çmimi i parashikuar</strong><br />{projekti.cmimi}</p>
        <div aria-live="polite"><VendetLive projektiId={projekti.id} fillestare={projekti.vende} /></div>
        <p><strong>Për projektin</strong><br />{projekti.pershkrimi}</p>
        <Link className="project-cta" href={`/projekti/${projekti.id}/kerkesa`}>Kërko ofertë <span aria-hidden="true">→</span></Link>
      </section>
      <Vendtakimi />
      <Link className="project-back" href="/">← Kthehu te projektet</Link>
    </main>
  );
}
