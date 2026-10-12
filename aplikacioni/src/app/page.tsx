
"use client";

import { useEffect, useState } from "react";
import KartaUdhetimi from "../components/KartaUdhetimi";
import styles from "./page.module.css";

type Projekt = {
  id: number;
  emri: string;
  lokacioni: string;
  cmimi: string;
  vende: number;
  pershkrimi: string;
};


export default function Home() {
  const [projektet, setProjektet] = useState<Projekt[]>([]);
  const [loading, setLoading] = useState(true);
  const [gabim, setGabim] = useState(false);

  useEffect(() => {
    fetch("/api/projektet")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gabim gjatë marrjes së projekteve");
        }
        return response.json();
      })
      .then((data: Projekt[]) => setProjektet(data))
      .catch(() => setGabim(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className={styles.main}>
      <h1>Ndërtimtari</h1>

      <p className={styles.pershkrimi}>
        Zgjidh projektin që dëshiron të realizosh.
      </p>

      {loading && <p>Duke u ngarkuar projektet...</p>}

      {gabim && (
        <p>Nuk mund të ngarkoheshin projektet. Provo përsëri.</p>
      )}

      {!loading && !gabim && (
        <div className={styles.kartat}>
          {projektet.map((projekt) => (
           <KartaUdhetimi
  key={projekt.id}
  projekt={{
    id: projekt.id,
    titulli: projekt.emri,
    pershkrimi: projekt.pershkrimi,
    lokacioni: projekt.lokacioni,
    cmimi: projekt.cmimi,
    vende: projekt.vende,
  }}
/>
          ))}
        </div>
      )}
    </main>
  );
}
