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
    async function merrFavoritet() {
      try {
        const response = await fetch("/api/favoritet", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const ids: number[] = await response.json();

        setFavorit(ids.includes(Number(projekt.id)));
      } catch (error) {
        console.error("Gabim gjatë marrjes së preferencave:", error);
      }
    }

    merrFavoritet();
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projektId: projekt.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Veprimi dështoi.");
        if (typeof data.favorite === "boolean") {
  setFavorit(data.favorite);
}
      }

      setMesazhi(
        gjendjaRe
          ? "Projekti u ruajt te të preferuarat."
          : "Projekti u hoq nga të preferuarat."
      );
    } catch (error) {
      setFavorit(gjendjaEmeparshme);

      setMesazhi(
        error instanceof Error
          ? error.message
          : "Ndodhi një gabim. Provo përsëri."
      );
    } finally {
      setDukeRuajtur(false);
    }
  }

  return (
    <article
  className="karta-udhetimit"
  style={{ position: "relative" }}
>
      <button
        type="button"
        className="butoni-favorit"
        style={{
  position: "absolute",
  top: "16px",
  right: "16px",
  width: "42px",
  height: "42px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #e32636",
  borderRadius: "50%",
  background: "#fff5f5",
  color: "#e32636",
  fontSize: "28px",
  cursor: "pointer",
  zIndex: 2,
}}

        onClick={ndryshoFavoritin}
        disabled={dukeRuajtur}
        aria-label={
          favorit
            ? "Hiqe nga të preferuarat"
            : "Shto te të preferuarat"
        }
        aria-pressed={favorit}
      >
        {favorit ? "♥" : "♡"}
      </button>

      <h2>{projekt.titulli}</h2>
      <p>{projekt.pershkrimi}</p>
      <p>Lokacioni: {projekt.lokacioni}</p>
      <p>Çmimi: {projekt.cmimi}</p>
      <p>Vende të lira: {projekt.vende}</p>

      <Link href={`/udhetimi/${projekt.id}`}>
        Shiko projektin
      </Link>

      {mesazhi && (
        <p className="mesazhi-favorit" role="status">
          {mesazhi}
        </p>
      )}
    </article>
  );
}
