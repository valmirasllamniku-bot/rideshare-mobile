"use client";

import { useState } from "react";

type Gjendja = "idle" | "loading" | "success" | "denied" | "timeout" | "unavailable";

export default function Vendtakimi() {
  const [teksti, setTeksti] = useState("");
  const [vendtakimi, setVendtakimi] = useState("");
  const [gabim, setGabim] = useState("");
  const [gjendja, setGjendja] = useState<Gjendja>("idle");
  const [saktesia, setSaktesia] = useState("");

  function konfirmoVendtakimin() {
    const vlera = teksti.trim();

    if (!vlera) {
      setGabim("Shkruaj vendtakimin para konfirmimit.");
      return;
    }

    setGabim("");
    setVendtakimi(vlera);
  }

  function kurMerretPozicioni(position: GeolocationPosition) {
    setSaktesia(`${Math.round(position.coords.accuracy)} m`);
    setGjendja("success");
  }

  function kurDeshtonLeximi(error: GeolocationPositionError) {
    setSaktesia("");

    if (error.code === 1) {
      setGjendja("denied");
    } else if (error.code === 3) {
      setGjendja("timeout");
    } else {
      setGjendja("unavailable");
    }
  }

  function kerkoVendndodhjen() {
    setGabim("");
    setSaktesia("");

    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      setGjendja("unavailable");
      return;
    }

    setGjendja("loading");

    navigator.geolocation.getCurrentPosition(
      kurMerretPozicioni,
      kurDeshtonLeximi,
      { timeout: 10000 }
    );
  }

  let mesazhi = "";

  if (gjendja === "loading") {
    mesazhi = "Po kërkojmë vendndodhjen...";
  } else if (gjendja === "success") {
    mesazhi = "Pozicioni u mor.";
  } else if (gjendja === "denied") {
    mesazhi = "Leja u refuzua. Shkruaj vendtakimin vetë.";
  } else if (gjendja === "timeout") {
    mesazhi = "Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.";
  } else if (gjendja === "unavailable") {
    mesazhi = "Vendndodhja nuk është e disponueshme. Shkruaj vendtakimin vetë.";
  }

  return (
    <section className="meeting-card">
      <div className="meeting-heading">
        <div className="meeting-icon" aria-hidden="true">⌖</div>
        <div>
          <span className="meeting-eyebrow">PLANIFIKIMI</span>
          <h2>Vendtakimi</h2>
        </div>
      </div>
      <p className="meeting-description">Shëno adresën ku dëshiron të takohemi ose përdor GPS për të marrë vendndodhjen tënde.</p>
      <label className="meeting-label" htmlFor="meeting-input">Adresa e vendtakimit</label>
      <input className="meeting-input" id="meeting-input" data-testid="meeting-input" type="text" value={teksti} onChange={(e) => setTeksti(e.target.value)} placeholder="P.sh. Prishtinë, lagjja Dardania" />
      <button className="meeting-primary" type="button" data-testid="confirm-meeting" onClick={konfirmoVendtakimin}>Konfirmo vendtakimin →</button>
      <p className="meeting-error" data-testid="meeting-error" role="alert">{gabim}</p>
      <div className="meeting-confirmed">
        <span className="meeting-confirmed-label">VENDTAKIMI I KONFIRMUAR</span>
        <p><strong data-testid="confirmed-meeting">{vendtakimi || "Ende nuk është konfirmuar"}</strong></p>
      </div>
      <button className="meeting-secondary" type="button" data-testid="locate-me" onClick={kerkoVendndodhjen} disabled={gjendja === "loading"}>
        {gjendja === "loading" ? "Duke kërkuar vendndodhjen..." : "◎ Përdor vendndodhjen time"}
      </button>
      <p className="meeting-status" data-testid="location-status" data-state={gjendja} role="status">{mesazhi}</p>
      <p className="meeting-accuracy">Saktësia GPS: <strong data-testid="location-accuracy">{saktesia || "—"}</strong></p>
    </section>
  );
}
