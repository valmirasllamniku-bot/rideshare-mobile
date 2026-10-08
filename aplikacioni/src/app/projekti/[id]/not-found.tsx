import Link from "next/link";

export default function ProjektiNukUGjet() {
  return (
    <main
      style={{
        padding: "40px",
        color: "black",
        backgroundColor: "white",
        minHeight: "100vh",
      }}
    >
      <h1>Projekti nuk u gjet</h1>

      <p>Ky projekt nuk ekziston.</p>

      <Link href="/" style={{ color: "blue" }}>
        Kthehu te projektet
      </Link>
    </main>
  );
}