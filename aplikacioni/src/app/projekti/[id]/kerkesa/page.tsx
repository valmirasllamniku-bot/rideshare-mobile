
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type Kerkesa = {
  id: number;
  projektiId: string;
  emri: string;
  email: string;
  telefoni: string;
  pershkrimi: string;
  data: string;
};

export default function KerkesaPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [emri, setEmri] = useState("");
  const [email, setEmail] = useState("");
  const [telefoni, setTelefoni] = useState("");
  const [pershkrimi, setPershkrimi] = useState("");
  const [mesazhi, setMesazhi] = useState("");

  function dergoKerkesen(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMesazhi("");

    try {
      const kerkesa: Kerkesa = {
        id: Date.now(),
        projektiId: id,
        emri,
        email,
        telefoni,
        pershkrimi,
        data: new Date().toISOString(),
      };

      const teRuajturat = localStorage.getItem("ndertimtari-kerkesat");
      const kerkesat: Kerkesa[] = teRuajturat
        ? JSON.parse(teRuajturat)
        : [];

      kerkesat.push(kerkesa);

      localStorage.setItem(
        "ndertimtari-kerkesat",
        JSON.stringify(kerkesat)
      );

      const verifikimi = localStorage.getItem("ndertimtari-kerkesat");
      if (!verifikimi || !JSON.parse(verifikimi).some(
        (item: Kerkesa) => item.id === kerkesa.id
      )) {
        throw new Error("Kërkesa nuk u verifikua.");
      }

      setMesazhi("Kërkesa u ruajt me sukses, edhe pa internet!");
      setEmri("");
      setEmail("");
      setTelefoni("");
      setPershkrimi("");
    } catch {
      setMesazhi("Gabim gjatë ruajtjes. Të dhënat nuk u fshinë.");
    }
  }

  return (
    <main style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1>Kërko ofertë</h1>
      <p>Projekti i zgjedhur: {id}</p>

      <form onSubmit={dergoKerkesen}>
        <label>Emri dhe mbiemri</label>
        <input required value={emri} onChange={(e) => setEmri(e.target.value)}
          placeholder="Shkruaj emrin"
          style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }} />

        <label>Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Shkruaj emailin"
          style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }} />

        <label>Numri i telefonit</label>
        <input required value={telefoni} onChange={(e) => setTelefoni(e.target.value)}
          placeholder="Shkruaj numrin"
          style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }} />

        <label>Përshkrimi i kërkesës</label>
        <textarea required value={pershkrimi} onChange={(e) => setPershkrimi(e.target.value)}
          placeholder="Përshkruaj çfarë dëshiron të ndërtosh..."
          rows={5}
          style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }} />

        <button type="submit" style={{ padding: "12px 20px", cursor: "pointer" }}>
          Dërgo kërkesën
        </button>
      </form>

      {mesazhi && <p role="status">{mesazhi}</p>}

      <button type="button" onClick={() => router.push(`/projekti/${id}`)}
        style={{ marginTop: "20px", padding: "10px" }}>
        Kthehu te projekti
      </button>
    </main>
  );
}
