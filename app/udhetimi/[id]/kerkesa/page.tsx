import Link from "next/link";

export default async function Kerkesa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main>
      <h1>Kërko ofertë</h1>
      <p>Projekti i zgjedhur: {id}</p>
      <p>Simulim: Në pritje</p>
      <p>Kërkesa është vetëm demonstrim dhe nuk dërgohet në server.</p>
      <Link href={`/udhetimi/${id}`}>Kthehu te projekti</Link>
    </main>
  );
}
