import KerkesatAdmin from "@/components/KerkesatAdmin";
import Link from "next/link";
import Hyrja from "@/components/Hyrja";
import GjendjaKerkesesLive from "@/components/GjendjaKerkesesLive";
import FormaKerkese from "@/components/FormaKerkese";
import NjoftimetKlient from "@/components/NjoftimetKlient";
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
  hyr: "Hyr me Google ose GitHub për të vazhduar.",
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
      <Link className="app-back-link" href="/">← Faqja kryesore</Link>
      <h1>
        {profili?.roli === "admin"
          ? "Paneli i administratorit – Ndërtimtari"
          : "Paneli i klientit – Ndërtimtari"}
      </h1>

      {m && mesazhet[m] && (
        <p className="app-notice" role="status">{mesazhet[m]}</p>
      )}

      {gabimDatabaze && (
        <p className="app-notice app-notice-error" role="alert">
          Ka ndodhur një gabim. Kontrollo konfigurimin dhe terminalin.
        </p>
      )}

      {!gabimDatabaze && profili && (
        <>
          <p className="app-welcome">
            Përshëndetje, {profili.emri}. Roli yt:{" "}
            <strong>{profili.roli}</strong>.
          </p>

          <p className="app-account-id">
            ID e llogarisë: <code>{profili.id}</code>
          </p>

          {profili.roli === "klient" && <NjoftimetKlient />}

          {profili.roli === "klient" && !kerkesa && (
            <section className="app-card">
              <h2>Kërko ofertë për një projekt</h2>

              <FormaKerkese action={krijoKerkeseAction} />
            </section>
          )}

          {profili.roli === "klient" && kerkesa && (
            <section className="app-card">
              <h2>Kërkesa jote për ofertë</h2>

              <p>
                ID e kërkesës: <strong>{kerkesa.id}</strong>
              </p>

              <p>
                ID e projektit: <strong>{kerkesa.projekt_id}</strong>
              </p>

              <GjendjaKerkesesLive fillestare={kerkesa} />

              <FormaKerkese
                action={ruajKerkeseAction}
                kerkesa={{ id: kerkesa.id, mesazhi: kerkesa.mesazhi }}
              />
              {(kerkesa.status === "ne_shqyrtim" || kerkesa.status === "perfunduar" || kerkesa.status === "refuzuar") && (
                <section className="app-card app-card-nested">
                  <h3>Dërgo kërkesë të re</h3>
                  <FormaKerkese action={krijoKerkeseAction} />
                </section>
              )}
            </section>
          )}

          {profili.roli === "admin" && <KerkesatAdmin />}
        </>
      )}

      {!profili && !gabimDatabaze && (
        <p className="app-notice">Hyr me Google ose GitHub. Paneli hapet sipas rolit të lidhur me llogarinë tënde.</p>
      )}

      <Hyrja brenda={Boolean(profili)} />

      <p className="app-footer-link">
        <Link href="/">Kthehu te projektet</Link>
      </p>
    </main>
  );
}
