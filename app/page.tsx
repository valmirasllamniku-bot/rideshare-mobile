import Link from "next/link";
import KartaUdhetimi from "../src/components/KartaUdhetimi";

const projektet = [
  { id: 1, titulli: "Ndërtim shtëpie", lokacioni: "Prishtinë", cmimi: "Nga 30,000 €", pershkrimi: "Projekt për ndërtimin e një shtëpie.", vende: 3 },
  { id: 2, titulli: "Ndërtim objekti afarist", lokacioni: "Fushë Kosovë", cmimi: "Nga 50,000 €", pershkrimi: "Projekt për ndërtimin e një objekti afarist.", vende: 2 },
  { id: 3, titulli: "Renovim banese", lokacioni: "Prishtinë", cmimi: "Nga 10,000 €", pershkrimi: "Projekt për renovimin e një banese.", vende: 0 }
];

export default function Home() {
  return (
    <main>
      <h1>Ndërtimtari</h1>
      <p>Zgjidh projektin që dëshiron të realizosh.</p>
      {projektet.map((projekt) => (
        <KartaUdhetimi key={projekt.id} projekt={projekt} />
      ))}
    </main>
  );
}
