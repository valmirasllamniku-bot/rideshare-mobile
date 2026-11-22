"use client";

import { useEffect, useRef, useState } from "react";

type Gjendja = {
  id: number;
  projekt_id: number;
  status: string;
  vende: number;
};

export default function GjendjaKerkesesLive({
  fillestare,
}: {
  fillestare: Gjendja;
}) {
  const [gjendja, setGjendja] = useState(fillestare);
  const [online, setOnline] = useState(true);
  const [dukeLexuar, setDukeLexuar] = useState(true);
  const kontrolluesi = useRef<AbortController | null>(null);
  const neFluturim = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let aktiv = true;

    async function lexo() {
      if (!aktiv || neFluturim.current) return;
      if (!navigator.onLine) {
        setOnline(false);
        setDukeLexuar(false);
        timer.current = setTimeout(lexo, 5000);
        return;
      }

      const controller = new AbortController();
      kontrolluesi.current = controller;
      neFluturim.current = true;

      try {
        const response = await fetch("/api/kerkesat/ime", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Leximi dështoi.");

        const data: { kerkesa: Gjendja | null } = await response.json();
        if (aktiv && data.kerkesa) setGjendja(data.kerkesa);
        if (aktiv) {
          setOnline(true);
          setDukeLexuar(false);
        }
      } catch {
        if (aktiv && !controller.signal.aborted) {
          setOnline(false);
          setDukeLexuar(false);
        }
      } finally {
        neFluturim.current = false;
        if (kontrolluesi.current === controller) kontrolluesi.current = null;
        if (aktiv) timer.current = setTimeout(lexo, 5000);
      }
    }

    function kurRilidhet() {
      if (!navigator.onLine) {
        setOnline(false);
        return;
      }
      if (timer.current) clearTimeout(timer.current);
      void lexo();
    }

    window.addEventListener("online", kurRilidhet);
    window.addEventListener("offline", kurRilidhet);
    void lexo();

    return () => {
      aktiv = false;
      kontrolluesi.current?.abort();
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("online", kurRilidhet);
      window.removeEventListener("offline", kurRilidhet);
    };
  }, []);

  const statusi = gjendja.status === "ne_shqyrtim" ? "U pranua" : "Në pritje";

  return (
    <div aria-live="polite">
      <p>
        Statusi i kërkesës: <strong>{statusi}</strong>
      </p>
      <p>
        Vende të lira: <strong>{gjendja.vende}</strong>
      </p>
      <p style={{ color: online ? "green" : "#b45309" }}>
        {!online
          ? "Po rilidhemi · po shfaqen të dhënat e fundit të lexuara."
          : dukeLexuar
            ? "Po lexohet gjendja nga serveri..."
            : "Përditësim automatik çdo 5 sekonda · gjendja u lexua nga serveri."}
      </p>
    </div>
  );
}
