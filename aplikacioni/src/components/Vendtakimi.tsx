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
    <section
      style={{
        maxWidth: "600px",
        margin: "30px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2>Vendtakimi</h2>

      <label htmlFor="meeting-input">
        Shkruaj vendtakimin
      </label>

      <input
        id="meeting-input"
        data-testid="meeting-input"
        type="text"
        value={teksti}
        onChange={(e) => setTeksti(e.target.value)}
        placeholder="P.sh. Biblioteka"
        style={{
          display: "block",
          width: "100%",
          padding: "12px",
          margin: "10px 0",
          boxSizing: "border-box",
        }}
      />

      <button
        type="button"
        data-testid="confirm-meeting"
        onClick={konfirmoVendtakimin}
      >
        Konfirmo në telefon
      </button>

      <p data-testid="meeting-error" role="alert">
        {gabim}
      </p>

      <p>
        Vendtakimi i konfirmuar:
        {" "}
        <strong data-testid="confirmed-meeting">
          {vendtakimi}
        </strong>
      </p>

      <button
        type="button"
        data-testid="locate-me"
        onClick={kerkoVendndodhjen}
        disabled={gjendja === "loading"}
        style={{ marginTop: "12px" }}
      >
        {gjendja === "loading"
          ? "Duke kërkuar..."
          : "Përdor vendndodhjen time"}
      </button>

      <p
        data-testid="location-status"
        data-state={gjendja}
        role="status"
      >
        {mesazhi}
      </p>

      <p>
        Saktësia:
        {" "}
        <strong data-testid="location-accuracy">
          {saktesia}
        </strong>
      </p>
    </section>
  );
}
