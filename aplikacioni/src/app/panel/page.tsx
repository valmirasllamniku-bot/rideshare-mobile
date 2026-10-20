import Link from "next/link";
import Hyrja from "@/components/Hyrja";
import {
  profiliIm,
  kerkesaIme,
  type Profil,
  type Kerkesa,
} from "@/lib/lejet";
import {
  krijoKerkeseAction,
  ruajKerkeseAction,
} from "./actions";

export const dynamic = "force-dynamic";

const mesazhet: Record<string, string> = {
  hyr: "Hyr me GitHub para se të vazhdosh.",
  ndaluar: "Nuk ke leje për këtë kërkesë. Të dhënat nuk u ndryshuan.",
  fushe: "Kontrollo të dhënat. Mesazhi duhet të ketë 3 deri në 500 karaktere.",
  projekt: "Projekti i zgjedhur nuk u gjet në databazë.",
  krijuar: "Kërkesa për ofertë u ruajt me sukses.",
  ruajtur: "Kërkesa jote u ndryshua me sukses.",
  databaza: "Ndodhi një gabim me databazën ose konfigurimin. Kontrollo terminalin.",
};

export default async function Paneli({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;

  let profili: Profil | null = null;
  let kerkesa: Kerkesa | null = null;
  let gabimDatabaze = false;

  try {
    profili = await profiliIm();

    if (profili) {
      kerkesa = await kerkesaIme();
    }
  } catch {
    gabimDatabaze = true;
  }

  return (
    <main className="app-shell">
      <h1>Paneli i klientit – Ndërtimtari</h1>

      {m && mesazhet[m] && (
        <p role="status">{mesazhet[m]}</p>
      )}

      {gabimDatabaze && (
        <p role="alert">
          Ka ndodhur një gabim. Kontrollo konfigurimin dhe terminalin.
        </p>
      )}

      {!gabimDatabaze && profili && (
        <>
          <p>
            Përshëndetje, {profili.emri}. Roli yt:{" "}
            <strong>{profili.roli}</strong>.
          </p>

          <p>
            ID e llogarisë GitHub: <code>{profili.id}</code>
          </p>

          {profili.roli === "klient" && !kerkesa && (
            <section>
              <h2>Kërko ofertë për një projekt</h2>

              <form action={krijoKerkeseAction}>
                <label htmlFor="projektId">Zgjidh projektin</label>
                <br />

                <select
                  id="projektId"
                  name="projektId"
                  defaultValue="1"
                  required
                >
                  <option value="1">Projekti 1 – Ndërtim shtëpie</option>
                  <option value="2">Projekti 2 – Objekt afarist</option>
                  <option value="3">Projekti 3 – Renovim banese</option>
                </select>

                <br />
                <br />

                <label htmlFor="mesazhi">Përshkrimi i kërkesës</label>
                <br />

                <textarea
                  id="mesazhi"
                  name="mesazhi"
                  rows={4}
                  minLength={3}
                  maxLength={500}
                  required
                  placeholder="Shkruaj çfarë pune ndërtimore të nevojitet."
                />

                <br />

                <button type="submit">Dërgo kërkesën</button>
              </form>
            </section>
          )}

          {profili.roli === "klient" && kerkesa && (
            <section>
              <h2>Kërkesa jote për ofertë</h2>

              <p>
                ID e kërkesës: <strong>{kerkesa.id}</strong>
              </p>

              <p>
                ID e projektit: <strong>{kerkesa.projekt_id}</strong>
              </p>

              <p>
                Statusi: <strong>{kerkesa.status}</strong>
              </p>

              <form action={ruajKerkeseAction}>
                <input
                  type="hidden"
                  name="id"
                  value={kerkesa.id}
                />

                <label htmlFor="mesazhi">Ndrysho përshkrimin</label>
                <br />

                <textarea
                  id="mesazhi"
                  name="mesazhi"
                  rows={4}
                  minLength={3}
                  maxLength={500}
                  required
                  defaultValue={kerkesa.mesazhi}
                />

                <br />

                <button type="submit">Ruaj ndryshimet</button>
              </form>
            </section>
          )}

          {profili.roli === "admin" && (
            <p>
              Je i identifikuar si administrator. Formulari i klientit nuk
              shfaqet për këtë rol.
            </p>
          )}
        </>
      )}

      {!profili && !gabimDatabaze && (
        <p>Hyr me GitHub për të dërguar ose ndryshuar kërkesën tënde.</p>
      )}

      <Hyrja brenda={Boolean(profili)} />

      <p>
        <Link href="/">Kthehu te projektet</Link>
      </p>
    </main>
  );
}