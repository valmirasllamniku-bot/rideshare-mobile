"use client";

import { useEffect, useRef, useState } from "react";

type Njoftim = {
  id: number;
  kerkesa_id: number;
  lloji: "pranuar" | "refuzuar";
  krijuar_me: string;
  lexuar_me: string | null;
  projekt_id: number;
  projekti: string;
  mesazhi: string;
  status: string;
};

type Detaje = {
  njoftim_id: number;
  kerkesa_id: number;
  projekt_id: number;
  mesazhi: string;
  status: string;
  krijuar_me: string;
  projekti: string;
  vende: number;
};

const TOAST_SEEN_KEY = "ndertimtari-java11-toast-ids";

function tekstiNjoftimit(lloji: Njoftim["lloji"]) {
  return lloji === "pranuar"
    ? "Administratori e pranoi kërkesën tënde."
    : "Administratori e refuzoi kërkesën tënde.";
}

export default function NjoftimetKlient() {
  const [njoftimet, setNjoftimet] = useState<Njoftim[]>([]);
  const [radhaToast, setRadhaToast] = useState<Njoftim[]>([]);
  const [detaje, setDetaje] = useState<Detaje | null>(null);
  const [gabimi, setGabimi] = useState("");
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [dukeHapur, setDukeHapur] = useState<number | null>(null);
  const njohura = useRef(new Set<number>());
  const ngarkuarNjehere = useRef(false);
  const kerkesaNeFluturim = useRef(false);

  useEffect(() => {
    let aktiv = true;

    async function ngarko() {
      if (kerkesaNeFluturim.current) return;
      kerkesaNeFluturim.current = true;

      try {
        const response = await fetch("/api/njoftimet", { cache: "no-store" });
        if (!response.ok) throw new Error("Njoftimet nuk u lexuan.");
        const data = (await response.json()) as Njoftim[];
        if (!aktiv) return;

        if (!ngarkuarNjehere.current) {
          ngarkuarNjehere.current = true;
          njohura.current = new Set(data.map((njoftim) => njoftim.id));
        } else {
          const teReja = data.filter((njoftim) => !njohura.current.has(njoftim.id));
          for (const njoftim of data) njohura.current.add(njoftim.id);

          if (teReja.length > 0) {
            let idsTeNjoftuara: number[] = [];
            try {
              idsTeNjoftuara = JSON.parse(sessionStorage.getItem(TOAST_SEEN_KEY) ?? "[]") as number[];
            } catch {
              idsTeNjoftuara = [];
            }
            const tePalajmeruara = teReja.filter((njoftim) => !idsTeNjoftuara.includes(njoftim.id));
            if (tePalajmeruara.length > 0) {
              const ids = [...idsTeNjoftuara, ...tePalajmeruara.map((njoftim) => njoftim.id)].slice(-200);
              sessionStorage.setItem(TOAST_SEEN_KEY, JSON.stringify(ids));
              setRadhaToast((radha) => [...radha, ...tePalajmeruara]);
            }
          }
        }

        setNjoftimet(data);
        setGabimi("");
      } catch {
        if (aktiv) setGabimi("Njoftimet nuk u rifreskuan. Po provojmë përsëri.");
      } finally {
        kerkesaNeFluturim.current = false;
        if (aktiv) setDukeNgarkuar(false);
      }
    }

    void ngarko();
    const interval = window.setInterval(() => void ngarko(), 5000);
    return () => {
      aktiv = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (radhaToast.length === 0) return;
    const timer = window.setTimeout(() => {
      setRadhaToast((radha) => radha.slice(1));
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [radhaToast]);

  async function hapNjoftimin(id: number) {
    setDukeHapur(id);
    setGabimi("");

    try {
      const response = await fetch(`/api/njoftimet/${id}/hap`, {
        method: "POST",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Njoftimi nuk u hap.");

      setNjoftimet((lista) =>
        lista.map((njoftim) =>
          njoftim.id === id
            ? { ...njoftim, lexuar_me: data.njoftimi.lexuar_me }
            : njoftim
        )
      );
      setDetaje(data.kerkesa as Detaje);
      setRadhaToast((radha) => radha.filter((njoftim) => njoftim.id !== id));
    } catch (error) {
      setGabimi(error instanceof Error ? error.message : "Njoftimi nuk u hap.");
    } finally {
      setDukeHapur(null);
    }
  }

  const tePalexuara = njoftimet.filter((njoftim) => njoftim.lexuar_me === null).length;
  const toast = radhaToast[0] ?? null;

  return (
    <section aria-live="polite" style={{ marginTop: 24 }}>
      <h2>Njoftimet</h2>
      <p>Njoftime të palexuara: <strong>{tePalexuara}</strong></p>
      {gabimi && <p role="alert">{gabimi}</p>}
      {dukeNgarkuar && <p>Po ngarkohen njoftimet...</p>}
      {!dukeNgarkuar && njoftimet.length === 0 && <p>Nuk ke ende njoftime.</p>}

      {toast && (
        <div role="status" style={{ border: "1px solid #2563eb", padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <strong>Njoftim i ri</strong>
          <p>{tekstiNjoftimit(toast.lloji)}</p>
          <button onClick={() => void hapNjoftimin(toast.id)} disabled={dukeHapur !== null}>
            Hape kërkesën
          </button>
          <button onClick={() => setRadhaToast((radha) => radha.slice(1))} style={{ marginLeft: 8 }}>
            Mbyll
          </button>
        </div>
      )}

      {njoftimet.length > 0 && (
        <ul style={{ display: "grid", gap: 8, paddingLeft: 20 }}>
          {njoftimet.map((njoftim) => (
            <li key={njoftim.id}>
              <button
                onClick={() => void hapNjoftimin(njoftim.id)}
                disabled={dukeHapur !== null}
                style={{ textAlign: "left", padding: 10, width: "100%" }}
              >
                <strong>{njoftim.lexuar_me === null ? "E palexuar · " : "E lexuar · "}</strong>
                {tekstiNjoftimit(njoftim.lloji)} {njoftim.projekti} · Kërkesa #{njoftim.kerkesa_id}
                <br />
                <small>{new Date(njoftim.krijuar_me).toLocaleString("sq-AL")}</small>
              </button>
            </li>
          ))}
        </ul>
      )}

      {detaje && (
        <article style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 10, padding: 16 }}>
          <h3>Kërkesa #{detaje.kerkesa_id} · {detaje.projekti}</h3>
          <p>Statusi: <strong>{detaje.status === "ne_shqyrtim" ? "U pranua" : detaje.status === "refuzuar" ? "U refuzua" : detaje.status}</strong></p>
          <p>{detaje.mesazhi}</p>
          <p>Vende të lira: {detaje.vende}</p>
          <button onClick={() => setDetaje(null)}>Kthehu te njoftimet</button>
        </article>
      )}
    </section>
  );
}