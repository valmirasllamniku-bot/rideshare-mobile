import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function KerkesaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main>
      <h1>Kërko ofertë</h1>
      <p>Projekti i zgjedhur: {id}</p>
      <p>Plotësimi i kërkesës për ofertë do të realizohet në hapin vijues.</p>
      <Link href={`/udhetimi/${id}`}>Kthehu te projekti</Link>
    </main>
  );
}
