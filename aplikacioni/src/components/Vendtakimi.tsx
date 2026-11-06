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
        maxWidth: "680px",
        margin: "55px auto",
        padding: "32px",
        background: "#ffffff",
        border: "1px solid #e9e9e9",
        borderRadius: "20px",
        boxShadow: "0 15px 45px rgba(0,0,0,0.06)",
        color: "#202020",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "#fff0e6",
            color: "#ed7625",
            display: "grid",
            placeItems: "center",
            fontSize: "25px",
          }}
        >
          ⌖
        </div>
        <div>
          <span style={{ color: "#ed7625", fontSize: "11px", fontWeight: 800, letterSpacing: "2px" }}>
            PLANIFIKIMI
          </span>
          <h2 style={{ margin: "3px 0 0", fontSize: "25px", fontWeight: 800 }}>
            Vendtakimi
          </h2>
        </div>
      </div>

      <p style={{ color: "#777", fontSize: "14px", lineHeight: 1.6, marginBottom: "22px" }}>
        Shëno adresën ku dëshiron të takohemi ose përdor GPS për të marrë vendndodhjen tënde.
      </p>

      <label
        htmlFor="meeting-input"
        style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "9px" }}
      >
        Adresa e vendtakimit
      </label>

      <input
        id="meeting-input"
        data-testid="meeting-input"
        type="text"
        value={teksti}
        onChange={(e) => setTeksti(e.target.value)}
        placeholder="P.sh. Prishtinë, lagjja Dardania"
        style={{
          display: "block",
          width: "100%",
          padding: "15px 16px",
          boxSizing: "border-box",
          border: "1px solid #dedede",
          borderRadius: "11px",
          outlineColor: "#ed7625",
          fontSize: "14px",
          background: "#fafafa",
          color: "#202020",
        }}
      />

      <button
        type="button"
        data-testid="confirm-meeting"
        onClick={konfirmoVendtakimin}
        style={{
          width: "100%",
          marginTop: "13px",
          padding: "15px",
          border: "none",
          borderRadius: "11px",
          background: "#ed7625",
          color: "#ffffff",
          fontWeight: 800,
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Konfirmo vendtakimin →
      </button>

      <p data-testid="meeting-error" role="alert" style={{ color: "#c0392b", fontSize: "13px", marginTop: "10px" }}>
        {gabim}
      </p>

      <div
        style={{
          marginTop: "18px",
          padding: "16px",
          borderRadius: "12px",
          background: "#f7f7f7",
          border: "1px solid #eeeeee",
        }}
      >
        <span style={{ color: "#777", fontSize: "11px", fontWeight: 800, letterSpacing: "1px" }}>
          VENDTAKIMI I KONFIRMUAR
        </span>
        <p style={{ margin: "7px 0 0", fontSize: "15px", fontWeight: 700, color: "#202020" }}>
          <strong data-testid="confirmed-meeting">
            {vendtakimi || "Ende nuk është konfirmuar"}
          </strong>
        </p>
      </div>

      <button
        type="button"
        data-testid="locate-me"
        onClick={kerkoVendndodhjen}
        disabled={gjendja === "loading"}
        style={{
          width: "100%",
          marginTop: "16px",
          padding: "14px",
          border: "1px solid #ed7625",
          borderRadius: "11px",
          background: "#ffffff",
          color: "#d96819",
          fontSize: "14px",
          fontWeight: 800,
          cursor: gjendja === "loading" ? "wait" : "pointer",
          opacity: gjendja === "loading" ? 0.6 : 1,
        }}
      >
        {gjendja === "loading"
          ? "Duke kërkuar vendndodhjen..."
          : "◎ Përdor vendndodhjen time"}
      </button>

      <p
        data-testid="location-status"
        data-state={gjendja}
        role="status"
        style={{
          marginTop: "15px",
          color: gjendja === "success" ? "#21834a" : "#666",
          fontSize: "13px",
          lineHeight: 1.5,
        }}
      >
        {mesazhi}
      </p>

      <p style={{ margin: "8px 0 0", color: "#777", fontSize: "12px" }}>
        Saktësia GPS:{" "}
        <strong data-testid="location-accuracy" style={{ color: "#202020" }}>
          {saktesia || "—"}
        </strong>
      </p>
    </section>
  );
}
