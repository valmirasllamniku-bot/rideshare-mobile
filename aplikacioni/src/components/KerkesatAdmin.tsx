"use client";

import { useEffect, useRef, useState } from "react";

type Kerkese = {
  id: number;
  projekt_id: number;
  github_id: string;
  mesazhi: string;
  status: string;
  krijuar_me: string;
  vende: number;
  projekti: string;
  klienti: string;
};

export default function KerkesatAdmin() {
  const [kerkesat, setKerkesat] = useState<Kerkese[]>([]);
  const [online, setOnline] = useState(true);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [gabimi, setGabimi] = useState("");
  const [dukePranuar, setDukePranuar] = useState<number | null>(null);
  const leximAktiv = useRef(false);

  async function ngarkoKerkesat() {
    if (leximAktiv.current) return;
    leximAktiv.current = true;

    try {
      const res = await fetch("/api/kerkesat", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Kërkesat nuk mund të ngarkohen.");
      }

      const data = await res.json();

      setKerkesat(data);
      setOnline(true);
      setGabimi("");
    } catch {
      setOnline(false);
      setGabimi("Lidhja u ndërpre. Po i ruajmë të dhënat e fundit.");
    } finally {
      leximAktiv.current = false;
      setDukeNgarkuar(false);
    }
  }

  useEffect(() => {
    const leximiFillestar = setTimeout(() => {
      void ngarkoKerkesat();
    }, 0);

    const interval = setInterval(() => {
      ngarkoKerkesat();
    }, 5000);

    function kontrolloLidhjen() {
      setOnline(navigator.onLine);
      if (navigator.onLine) {
        ngarkoKerkesat();
      }
    }

    window.addEventListener("online", kontrolloLidhjen);
    window.addEventListener("offline", kontrolloLidhjen);

    return () => {
      clearTimeout(leximiFillestar);
      clearInterval(interval);
      window.removeEventListener("online", kontrolloLidhjen);
      window.removeEventListener("offline", kontrolloLidhjen);
    };
  }, []);

  async function veproKerkesen(id: number, veprimi: "prano" | "refuzo") {
    if (
      veprimi === "refuzo" &&
      !window.confirm("A dëshiron ta refuzosh këtë kërkesë? Klienti do të informohet për refuzimin.")
    ) {
      return;
    }

    setDukePranuar(id);
    setGabimi("");

    try {
      const res = await fetch("/api/kerkesat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, veprimi }),
      });
      const data = await res.json();

      if (!res.ok) {
        setGabimi(data.error || "Veprimi nuk u krye.");
        return;
      }

      await ngarkoKerkesat();
    } catch {
      setOnline(false);
      setGabimi("Veprimi nuk u krye. Kontrollo lidhjen.");
    } finally {
      setDukePranuar(null);
    }
  }

  if (dukeNgarkuar) {
    return <p>Po ngarkohen kërkesat...</p>;
  }

  return (
    <section className="admin-panel">
      <h2>Kërkesat e klientëve</h2>

      <p>
        Statusi i lidhjes:{" "}
        <strong className={online ? "admin-status-online" : "admin-status-offline"}>
          {online ? "Online" : "Offline"}
        </strong>
      </p>

      {!online && (
        <p className="admin-warning">
          Lidhja u ndërpre. Të dhënat e fundit mbeten në ekran.
        </p>
      )}

      {gabimi && (
        <p className="app-notice app-notice-error">{gabimi}</p>
      )}

      {kerkesat.length === 0 ? (
        <p>Ende nuk ka kërkesa për projekte.</p>
      ) : (
        <div className="admin-request-list">
          {kerkesat.map((kerkesa) => (
            <article
              key={kerkesa.id}
            >
              <h3>{kerkesa.projekti}</h3>

              <p>
                <strong>Klienti:</strong> {kerkesa.klienti}
              </p>

              <p>
                <strong>Mesazhi:</strong> {kerkesa.mesazhi}
              </p>

              <p>
                <strong>Statusi:</strong>{" "}
                {kerkesa.status === "ne_shqyrtim"
                  ? "U pranua"
                  : kerkesa.status === "perfunduar"
                    ? "Përfunduar"
                    : kerkesa.status === "refuzuar"
                      ? "U refuzua"
                      : "E re"}
              </p>

              <p>
                <strong>Vende të lira:</strong> {kerkesa.vende}
              </p>

              <p>
                <strong>Data:</strong>{" "}
                {new Date(kerkesa.krijuar_me).toLocaleString("sq-AL")}
              </p>

              {(kerkesa.status === "e_re" ||
                kerkesa.status === "ne pritje") && (
                <div className="admin-request-actions">
                  {kerkesa.vende > 0 ? (
                    <button
                      onClick={() => veproKerkesen(kerkesa.id, "prano")}
                      disabled={dukePranuar !== null || !online}
                      className="admin-accept"
                    >
                      {dukePranuar === kerkesa.id ? "Duke përditësuar..." : "Prano kërkesën"}
                    </button>
                  ) : (
                    <p role="status">Nuk ka vende të lira për këtë projekt.</p>
                  )}
                  <button
                    onClick={() => veproKerkesen(kerkesa.id, "refuzo")}
                    disabled={dukePranuar !== null || !online}
                    className="admin-reject"
                  >
                    {dukePranuar === kerkesa.id
                      ? "Duke përditësuar..."
                      : kerkesa.vende > 0
                        ? "Refuzo kërkesën"
                        : "Refuzo (nuk ka vende të lira)"}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
