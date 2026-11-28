"use client";

import { useEffect, useState } from "react";

type Veprimi = (formData: FormData) => void | Promise<void>;

export default function FormaKerkese({
  action,
  kerkesa,
  projektId,
}: {
  action: Veprimi;
  kerkesa?: { id: number; mesazhi: string };
  projektId?: string;
}) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    function kontrollo() {
      setOnline(navigator.onLine);
    }
    kontrollo();
    window.addEventListener("online", kontrollo);
    window.addEventListener("offline", kontrollo);
    return () => {
      window.removeEventListener("online", kontrollo);
      window.removeEventListener("offline", kontrollo);
    };
  }, []);

  return (
    <form
      className="app-form"
      action={action}
      onSubmit={(event) => {
        if (!navigator.onLine) {
          event.preventDefault();
          setOnline(false);
        }
      }}
    >
      {kerkesa ? (
        <>
          <input type="hidden" name="id" value={kerkesa.id} />
          <label htmlFor="mesazhi">Ndrysho përshkrimin</label>
          <textarea
            id="mesazhi"
            name="mesazhi"
            rows={4}
            minLength={3}
            maxLength={500}
            required
            defaultValue={kerkesa.mesazhi}
          />
          <button type="submit" disabled={!online}>Ruaj ndryshimet</button>
        </>
      ) : (
        <>
          {projektId ? (
            <input type="hidden" name="projektId" value={projektId} />
          ) : (
            <>
              <label htmlFor="projektId">Zgjidh projektin</label>
                  <select id="projektId" name="projektId" defaultValue="1" required>
                <option value="1">Projekti 1 – Ndërtim shtëpie</option>
                <option value="2">Projekti 2 – Objekt afarist</option>
                <option value="3">Projekti 3 – Renovim banese</option>
              </select>
            </>
          )}
          <label htmlFor="mesazhi">Përshkrimi i kërkesës</label>
          <br />
          <textarea
            id="mesazhi"
            name="mesazhi"
            rows={4}
            minLength={3}
            maxLength={500}
            required
            placeholder="Shkruaj çfarë pune të nevojitet."
          />
          <br />
          <button type="submit" disabled={!online}>Dërgo kërkesën</button>
        </>
      )}
      {!online && (
        <p role="status">Je offline. Lidhja e internetit nevojitet për këtë veprim.</p>
      )}
    </form>
  );
}
