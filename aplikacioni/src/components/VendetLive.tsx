"use client";

import { useEffect, useRef, useState } from "react";

export default function VendetLive({
  projektiId,
  fillestare,
}: {
  projektiId: number;
  fillestare: number;
}) {
  const [vende, setVende] = useState(fillestare);
  const [online, setOnline] = useState(true);
  const [uLexua, setULexua] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const neFluturim = useRef(false);

  useEffect(() => {
    let aktiv = true;

    async function lexo() {
      if (!aktiv || neFluturim.current) return;
      if (!navigator.onLine) {
        setOnline(false);
        timer.current = setTimeout(lexo, 5000);
        return;
      }

      neFluturim.current = true;
      try {
        const response = await fetch(`/api/projektet?id=${projektiId}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Leximi dështoi.");
        const projekti: { vende: number } = await response.json();
        if (aktiv) {
          setVende(projekti.vende);
          setOnline(true);
          setULexua(true);
        }
      } catch {
        if (aktiv) setOnline(false);
      } finally {
        neFluturim.current = false;
        if (aktiv) timer.current = setTimeout(lexo, 5000);
      }
    }

    function lidhjaNdryshoi() {
      if (!navigator.onLine) {
        setOnline(false);
      } else {
        if (timer.current) clearTimeout(timer.current);
        void lexo();
      }
    }

    window.addEventListener("online", lidhjaNdryshoi);
    window.addEventListener("offline", lidhjaNdryshoi);
    void lexo();

    return () => {
      aktiv = false;
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("online", lidhjaNdryshoi);
      window.removeEventListener("offline", lidhjaNdryshoi);
    };
  }, [projektiId]);

  return (
    <div aria-live="polite">
      <p>Vende të lira: <strong>{vende}</strong></p>
      <p style={{ color: online ? "green" : "#b45309" }}>
        {!online
          ? "Po rilidhemi · po shfaqet numri i fundit i lexuar."
          : uLexua
            ? "Përditësim automatik çdo 5 sekonda · gjendja u lexua nga serveri."
            : "Po lexohet gjendja nga serveri..."}
      </p>
    </div>
  );
}
