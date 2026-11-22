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

  async function pranoKerkesen(id: number) {
    setDukePranuar(id);
    setGabimi("");

    try {
      const res = await fetch("/api/kerkesat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGabimi(data.error || "Kërkesa nuk u pranua.");
        return;
      }

      await ngarkoKerkesat();
    } catch {
      setOnline(false);
      setGabimi("Nuk u arrit pranimi i kërkesës. Kontrollo lidhjen.");
    } finally {
      setDukePranuar(null);
    }
  }

  if (dukeNgarkuar) {
    return <p>Po ngarkohen kërkesat...</p>;
  }

  return (
    <section style={{ marginTop: 24 }}>
      <h2>Kërkesat e klientëve</h2>

      <p>
        Statusi i lidhjes:{" "}
        <strong style={{ color: online ? "green" : "red" }}>
          {online ? "Online" : "Offline"}
        </strong>
      </p>

      {!online && (
        <p style={{ color: "#b45309" }}>
          Lidhja u ndërpre. Të dhënat e fundit mbeten në ekran.
        </p>
      )}

      {gabimi && (
        <p style={{ color: "red" }}>{gabimi}</p>
      )}

      {kerkesat.length === 0 ? (
        <p>Ende nuk ka kërkesa për projekte.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {kerkesat.map((kerkesa) => (
            <article
              key={kerkesa.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
                background: "#fff",
              }}
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
                <button
                  onClick={() => pranoKerkesen(kerkesa.id)}
                  disabled={dukePranuar !== null || !online}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {dukePranuar === kerkesa.id
                    ? "Duke pranuar..."
                    : "Prano kërkesën"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
