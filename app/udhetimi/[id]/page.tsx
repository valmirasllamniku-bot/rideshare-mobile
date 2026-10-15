import Link from "next/link";

const projektet: Record<string, { titulli: string; lokacioni: string; cmimi: string; pershkrimi: string }> = {
  "1": { titulli: "Ndërtim shtëpie", lokacioni: "Prishtinë", cmimi: "Nga 30,000 €", pershkrimi: "Projekt për ndërtimin e një shtëpie." },
  "2": { titulli: "Ndërtim objekti afarist", lokacioni: "Fushë Kosovë", cmimi: "Nga 50,000 €", pershkrimi: "Projekt për ndërtimin e një objekti afarist." },
  "3": { titulli: "Renovim banese", lokacioni: "Prishtinë", cmimi: "Nga 10,000 €", pershkrimi: "Projekt për renovimin e një banese." }
};

export default async function Detajet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projekti = projektet[id];

  if (!projekti) {
    return <main><h1>Projekti nuk u gjet</h1><p>Ky projekt nuk ekziston.</p><Link href="/">Kthehu te projektet</Link></main>;
  }

  return (
    <main>
      <h1>{projekti.titulli}</h1>
      <p>Lokacioni: {projekti.lokacioni}</p>
      <p>Çmimi: {projekti.cmimi}</p>
      <p>{projekti.pershkrimi}</p>
      <Link href={`/udhetimi/${id}/kerkesa`}>Kërko ofertë</Link>
      <p><Link href="/">Kthehu te projektet</Link></p>
    </main>
  );
}
