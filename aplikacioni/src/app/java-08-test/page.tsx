import Link from "next/link";
import Vendtakimi from "@/components/Vendtakimi";

export default function Java08Test() {
  return (
    <main className="test-page">
      <Link className="project-back" href="/">← Faqja kryesore</Link>
      <span className="auth-eyebrow">JAVA 8 · PROVË</span>
      <h1>Vendtakimi i projektit</h1>
      <section className="app-card">
        <h2>Ndërtim shtëpie</h2>
        <p>Lokacioni i projektit: Prishtinë, lagjja Dardania</p>
        <p>Përcakto vendtakimin për konsultim me ekipin e Ndërtimtarisë.</p>
      </section>
      <Vendtakimi />
    </main>
  );
}
