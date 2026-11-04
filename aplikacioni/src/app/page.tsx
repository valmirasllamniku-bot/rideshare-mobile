
"use client";

import Hyrja from "../components/Hyrja";
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

const CACHE_KEY = "ndertimtari-projektet";

export default function Home() {
  const [projektet, setProjektet] = useState<Projekt[]>([]);
  const [loading, setLoading] = useState(true);
  const [gabim, setGabim] = useState(false);

  
useEffect(() => {
  const cacheKey = "ndertimtari-projektet";
  let aktiv = true;

  // Lexo projektet e ruajtura para se të kërkosh internetin.
  let kaCache = false;

  try {
    const ruajtura = localStorage.getItem(cacheKey);

    if (ruajtura) {
      const data = JSON.parse(ruajtura) as Projekt[];

      if (Array.isArray(data)) {
        setProjektet(data);
        setLoading(false);
        setGabim(false);
        kaCache = true;
      }
    }
  } catch {
    localStorage.removeItem(cacheKey);
  }

  // Nëse ka cache, mos e lër faqen të presë kërkesën online.
  if (!navigator.onLine) {
    if (!kaCache) setGabim(true);
    setLoading(false);
    return () => {
      aktiv = false;
    };
  }

  fetch("/api/projektet")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gabim gjatë marrjes së projekteve");
      }
      return response.json();
    })
    .then((data: Projekt[]) => {
      if (!aktiv || !Array.isArray(data)) return;

      setProjektet(data);
      setGabim(false);
      localStorage.setItem(cacheKey, JSON.stringify(data));
    })
    .catch(() => {
      if (aktiv && !kaCache) setGabim(true);
    })
    .finally(() => {
      if (aktiv) setLoading(false);
    });

  return () => {
    aktiv = false;
  };
}, []);


  return (
    <main className={styles.main}>
      <Hyrja brenda={false} />

      <p>
        <a href="/panel">Paneli i klientit</a>
      </p>

      <h1>Ndërtimtari</h1>

      <p className={styles.pershkrimi}>
        Zgjidh projektin që dëshiron të realizosh.
      </p>

      {loading && <p>Duke u ngarkuar projektet...</p>}

      {gabim && projektet.length === 0 && (
        <p>
          Nuk mund të ngarkoheshin projektet. Kontrollo lidhjen me
          internetin dhe provo përsëri.
        </p>
      )}

      {!loading && projektet.length === 0 && !gabim && (
        <p>Nuk ka projekte për t'u shfaqur.</p>
      )}

      {projektet.length > 0 && (
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
