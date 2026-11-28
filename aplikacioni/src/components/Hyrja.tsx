"use client";

import { getProviders, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Hyrja({ brenda }: { brenda: boolean }) {
  const [ofruesit, setOfruesit] = useState<Awaited<ReturnType<typeof getProviders>>>(null);
  const [kontrolluar, setKontrolluar] = useState(false);

  useEffect(() => {
    let aktiv = true;
    getProviders()
      .then((rezultati) => { if (aktiv) setOfruesit(rezultati); })
      .catch(() => { if (aktiv) setOfruesit(null); })
      .finally(() => { if (aktiv) setKontrolluar(true); });
    return () => { aktiv = false; };
  }, []);

  if (brenda) {
    return (
      <div className="auth-signed-in">
        <p className="auth-signed-copy"><span className="auth-check" aria-hidden="true">✓</span> Je kyçur në llogarinë tënde.</p>
        <button className="auth-signout" type="button" onClick={() => signOut({ callbackUrl: "/panel" })}>
          Dil nga llogaria
        </button>
      </div>
    );
  }

  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-intro">
        <span className="auth-eyebrow">HYRJE E SIGURT</span>
        <h2 id="auth-title">Hyr në Ndërtimtari</h2>
        <p>Mund të përdorësh Google ose GitHub. Paneli hapet sipas rolit të caktuar për llogarinë tënde.</p>
      </div>
      <div className="auth-options">
        <button className="auth-button auth-google" type="button" disabled={!ofruesit?.google} onClick={() => signIn("google", { callbackUrl: "/panel" })}>
          <span className="provider-mark provider-google" aria-hidden="true">G</span>
          <span className="auth-button-copy"><strong>Vazhdo me Google</strong><small>Hyr me llogarinë tënde Google</small></span>
          <span className="auth-arrow" aria-hidden="true">→</span>
        </button>
        <button className="auth-button auth-github" type="button" disabled={!ofruesit?.github} onClick={() => signIn("github", { callbackUrl: "/panel" })}>
          <span className="provider-mark provider-github" aria-hidden="true">GH</span>
          <span className="auth-button-copy"><strong>Vazhdo me GitHub</strong><small>Hyr me llogarinë tënde GitHub</small></span>
          <span className="auth-arrow" aria-hidden="true">→</span>
        </button>
      </div>
      {kontrolluar && (!ofruesit?.google || !ofruesit?.github) && (
        <p className="auth-config-note" role="status">
          {!ofruesit?.google && !ofruesit?.github
            ? "Hyrja me Google dhe GitHub nuk është konfiguruar në server."
            : !ofruesit?.google
              ? "Google aktivizohet pasi të shtohen kredencialet OAuth në server. Për momentin, hyr me GitHub."
              : "GitHub aktivizohet pasi të shtohen kredencialet OAuth në server."}
        </p>
      )}
      <p className="auth-role-note">Roli admin caktohet vetëm nga profili i autorizuar, jo nga zgjedhja e butonit.</p>
    </section>
  );
}
