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
    let aktiv = true;
    let kaCache = false;

    try {
      const ruajtura = localStorage.getItem(CACHE_KEY);

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
      localStorage.removeItem(CACHE_KEY);
    }

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
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
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
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>N</span>
          <span>NDËRTIMTARI</span>
        </div>

        <nav className={styles.nav}>
          <a href="#projektet">Projektet</a>
          <a href="/panel">Paneli i klientit</a>
        </nav>
      </header>

      <Hyrja brenda={false} />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.etiketa}>
            NDËRTIMI I SË ARDHMES
          </span>

          <h1>
            Ëndrrat e tua,
            <br />
            <span>ne i ndërtojmë.</span>
          </h1>

          <p className={styles.pershkrimi}>
            Gjej projektin e duhur për shtëpinë apo objektin tënd.
            Ne të ndihmojmë ta kthesh idenë në realitet.
          </p>

          <a href="#projektet" className={styles.heroButton}>
            Eksploro projektet <span>→</span>
          </a>

          <div className={styles.heroInfo}>
            <div>
              <strong>{projektet.length}+</strong>
              <span>Projekte</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Përkushtim</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Online</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualBox}>
            <div className={styles.visualTop}>
              <span>NDËRTIMTARI</span>
              <span>01 / 2026</span>
            </div>
            <div className={styles.building}>
              <div className={styles.buildingRoof}></div>
              <div className={styles.buildingBody}>
                <div className={styles.windows}></div>
                <div className={styles.windows}></div>
                <div className={styles.windows}></div>
                <div className={styles.windows}></div>
              </div>
              <div className={styles.buildingBase}></div>
            </div>
            <div className={styles.visualBottom}>
              <span>IDE → PROJEKT → REALITET</span>
              <span>✦</span>
            </div>
          </div>
          <div className={styles.orangeCircle}></div>
        </div>
      </section>

      <section id="projektet" className={styles.projectsSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.etiketa}>GJEJ INSPIRIMIN</span>
            <h2>Projektet tona</h2>
            <p>Zgjidh projektin që dëshiron të realizosh.</p>
          </div>
          <span className={styles.projectCount}>
            {projektet.length} projekte
          </span>
        </div>

        {loading && (
          <p className={styles.status}>Duke u ngarkuar projektet...</p>
        )}

        {gabim && projektet.length === 0 && (
          <p className={styles.status}>
            Nuk mund të ngarkoheshin projektet. Kontrollo lidhjen me
            internetin dhe provo përsëri.
          </p>
        )}

        {!loading && projektet.length === 0 && !gabim && (
          <p className={styles.status}>Nuk ka projekte për t'u shfaqur.</p>
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
      </section>

      <footer className={styles.footer}>
        <span>NDËRTIMTARI</span>
        <span>Ndërto sot atë që ëndërron për nesër.</span>
      </footer>
    </main>
  );
}
