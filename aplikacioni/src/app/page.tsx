import { udhetimet } from "./udhetimet";
import KartaUdhetimi from "./KartaUdhetimi";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Ndërtimtari</h1>

      <p className={styles.pershkrimi}>
        Zgjidh projektin që dëshiron të realizosh.
      </p>

      <div className={styles.kartat}>
        {udhetimet.map((projekt) => (
          <KartaUdhetimi
            key={projekt.id}
            projekt={projekt}
          />
        ))}
      </div>
    </main>
  );
}