import Link from "next/link";

export default function ProjektiNukUGjet() {
  return (
    <main className="not-found-page">
      <span className="auth-eyebrow">NDËRTIMTARI</span>
      <h1>Projekti nuk u gjet</h1>
      <p>Ky projekt mund të jetë hequr ose lidhja nuk është e saktë.</p>
      <Link className="project-cta" href="/">Kthehu te projektet <span aria-hidden="true">→</span></Link>
    </main>
  );
}
