"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  projekt: {
    id: string | number;
    titulli: string;
    pershkrimi: string;
    lokacioni: string;
    cmimi: string | number;
    vende: number;
  };
};

export default function KartaUdhetimi({ projekt }: Props) {
  const [favorit, setFavorit] = useState(false);
  const [dukeRuajtur, setDukeRuajtur] = useState(false);
  const [mesazhi, setMesazhi] = useState("");

  useEffect(() => {
    let aktiv = true;
    async function merrFavoritet() {
      try {
        const response = await fetch("/api/favoritet", { cache: "no-store" });
        if (!response.ok) return;
        const ids: number[] = await response.json();
        if (aktiv) setFavorit(ids.includes(Number(projekt.id)));
      } catch {
        // Preferencat janë opsionale; projekti mbetet i shfaqur edhe pa to.
      }
    }
    void merrFavoritet();
    return () => { aktiv = false; };
  }, [projekt.id]);

  async function ndryshoFavoritin() {
    if (dukeRuajtur) return;
    const gjendjaEmeparshme = favorit;
    const gjendjaRe = !favorit;
    setFavorit(gjendjaRe);
    setDukeRuajtur(true);
    setMesazhi("");
    try {
      const response = await fetch("/api/favoritet", {
        method: gjendjaRe ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projektId: projekt.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Veprimi dështoi.");
      setMesazhi(gjendjaRe ? "U ruajt te të preferuarat." : "U hoq nga të preferuarat.");
    } catch (error) {
      setFavorit(gjendjaEmeparshme);
      setMesazhi(error instanceof Error ? error.message : "Ndodhi një gabim. Provo përsëri.");
    } finally {
      setDukeRuajtur(false);
    }
  }

  return (
    <article className="karta-udhetimit">
      <button type="button" className="project-save-button" onClick={ndryshoFavoritin} disabled={dukeRuajtur} aria-label={favorit ? "Hiqe projektin nga lista e ruajtur" : "Ruaje projektin"} aria-pressed={favorit}>
        <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
          <path d="M6.75 3.75h10.5a1.5 1.5 0 0 1 1.5 1.5v15l-6.75-4.5-6.75 4.5v-15a1.5 1.5 0 0 1 1.5-1.5Z" />
        </svg>
        <span>{dukeRuajtur ? "Duke ruajtur" : favorit ? "Ruajtur" : "Ruaje"}</span>
      </button>
      <span className="project-card-kicker">PROJEKT NDËRTIMI</span>
      <h2>{projekt.titulli}</h2>
      <p className="project-card-description">{projekt.pershkrimi}</p>
      <dl className="project-card-details">
        <div><dt>Lokacioni</dt><dd>{projekt.lokacioni}</dd></div>
        <div><dt>Çmimi</dt><dd>{projekt.cmimi}</dd></div>
        <div><dt>Vende të lira</dt><dd>{projekt.vende}</dd></div>
      </dl>
      <Link className="project-card-link" href={`/projekti/${projekt.id}`}>
        Shiko projektin <span aria-hidden="true">→</span>
      </Link>
      {mesazhi && <p className="project-save-message" role="status">{mesazhi}</p>}
    </article>
  );
}
