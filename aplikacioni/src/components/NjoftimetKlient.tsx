"use client";

import { useEffect, useRef, useState } from "react";

type Njoftim = {
  id: number;
  kerkesa_id: number;
  lloji: "pranuar" | "refuzuar";
  krijuar_me: string;
  lexuar_me: string | null;
  projekt_id: number;
  projekti: string;
  mesazhi: string;
  status: string;
};

type Detaje = {
  njoftim_id: number;
  kerkesa_id: number;
  projekt_id: number;
  mesazhi: string;
  status: string;
  krijuar_me: string;
  projekti: string;
  vende: number;
};

const TOAST_SEEN_KEY = "ndertimtari-java11-toast-ids";

function tekstiNjoftimit(lloji: Njoftim["lloji"]) {
  return lloji === "pranuar"
    ? "Administratori e pranoi kërkesën tënde."
    : "Administratori e refuzoi kërkesën tënde.";
}

export default function NjoftimetKlient() {
  const [njoftimet, setNjoftimet] = useState<Njoftim[]>([]);
  const [radhaToast, setRadhaToast] = useState<Njoftim[]>([]);
  const [detaje, setDetaje] = useState<Detaje | null>(null);
  const [gabimi, setGabimi] = useState("");
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [dukeHapur, setDukeHapur] = useState<number | null>(null);
  const [pushMesazhi, setPushMesazhi] = useState("");
  const [pushNeProces, setPushNeProces] = useState(false);
  const [pushAktive, setPushAktive] = useState(false);
  const [pushMbeshte, setPushMbeshte] = useState<boolean | null>(null);
  const njohura = useRef(new Set<number>());
  const ngarkuarNjehere = useRef(false);
  const kerkesaNeFluturim = useRef(false);

  useEffect(() => {
    let aktiv = true;

    async function kontrolloPush() {
      const mbeshtetet =
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;
      if (!aktiv) return;
      setPushMbeshte(mbeshtetet);
      if (!mbeshtetet || Notification.permission !== "granted") return;

      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) return;

        const response = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });
        if (aktiv) setPushAktive(response.ok);
      } catch {
        if (aktiv) setPushMesazhi("Njoftimet e telefonit nuk mund të kontrollohen.");
      }
    }

    void kontrolloPush();
    return () => { aktiv = false; };
  }, []);

  function dekodoVapidKey(key: string): ArrayBuffer {
    const padding = "=".repeat((4 - (key.length % 4)) % 4);
    const binary = atob(key.replace(/-/g, "+").replace(/_/g, "/") + padding);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes.buffer;
  }

  async function aktivizoPush() {
    setPushNeProces(true);
    setPushMesazhi("");

    try {
      const userAgent = navigator.userAgent.toLowerCase();
      const eshteIOS = /iphone|ipad|ipod/.test(userAgent) ||
        (/macintosh/.test(userAgent) && navigator.maxTouchPoints > 1);
      const siAplikacion = window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;

      if (eshteIOS && !siAplikacion) {
        setPushMesazhi("Në iPhone, shtoje faqen në Home Screen nga Safari (Share → Add to Home Screen), hape ikonën e aplikacionit dhe provo përsëri.");
        return;
      }

      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setPushMesazhi("Ky shfletues nuk i mbështet njoftimet push. Në iPhone përdor aplikacionin e shtuar në Home Screen me iOS 16.4 ose më të ri.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushMesazhi("Lejo njoftimet për Ndërtimtari te cilësimet e iPhone-it dhe provo përsëri.");
        return;
      }

      const configResponse = await fetch("/api/push/subscribe", { cache: "no-store" });
      const config = await configResponse.json();
      if (!configResponse.ok || typeof config.publicKey !== "string") {
        throw new Error(config.error ?? "Vercel nuk i ka ende çelësat e njoftimeve.");
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const activeRegistration = await navigator.serviceWorker.ready;
      const subscription = await activeRegistration.pushManager.getSubscription() ??
        await activeRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: dekodoVapidKey(config.publicKey),
        });

      const saveResponse = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      const saveResult = await saveResponse.json();
      if (!saveResponse.ok) throw new Error(saveResult.error ?? "Abonimi nuk u ruajt.");

      setPushAktive(true);
      setPushMesazhi("Njoftimet e telefonit u aktivizuan.");
    } catch (error) {
      setPushMesazhi(error instanceof Error ? error.message : "Njoftimet e telefonit nuk u aktivizuan.");
    } finally {
      setPushNeProces(false);
    }
  }

  useEffect(() => {
    let aktiv = true;

    async function ngarko() {
      if (kerkesaNeFluturim.current) return;
      kerkesaNeFluturim.current = true;

      try {
        const response = await fetch("/api/njoftimet", { cache: "no-store" });
        if (!response.ok) throw new Error("Njoftimet nuk u lexuan.");
        const data = (await response.json()) as Njoftim[];
        if (!aktiv) return;

        if (!ngarkuarNjehere.current) {
          ngarkuarNjehere.current = true;
          njohura.current = new Set(data.map((njoftim) => njoftim.id));
        } else {
          const teReja = data.filter((njoftim) => !njohura.current.has(njoftim.id));
          for (const njoftim of data) njohura.current.add(njoftim.id);

          if (teReja.length > 0) {
            let idsTeNjoftuara: number[] = [];
            try {
              idsTeNjoftuara = JSON.parse(sessionStorage.getItem(TOAST_SEEN_KEY) ?? "[]") as number[];
            } catch {
              idsTeNjoftuara = [];
            }
            const tePalajmeruara = teReja.filter((njoftim) => !idsTeNjoftuara.includes(njoftim.id));
            if (tePalajmeruara.length > 0) {
              const ids = [...idsTeNjoftuara, ...tePalajmeruara.map((njoftim) => njoftim.id)].slice(-200);
              sessionStorage.setItem(TOAST_SEEN_KEY, JSON.stringify(ids));
              setRadhaToast((radha) => [...radha, ...tePalajmeruara]);
            }
          }
        }

        setNjoftimet(data);
        setGabimi("");
      } catch {
        if (aktiv) setGabimi("Njoftimet nuk u rifreskuan. Po provojmë përsëri.");
      } finally {
        kerkesaNeFluturim.current = false;
        if (aktiv) setDukeNgarkuar(false);
      }
    }

    void ngarko();
    const interval = window.setInterval(() => void ngarko(), 5000);
    return () => {
      aktiv = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (radhaToast.length === 0) return;
    const timer = window.setTimeout(() => {
      setRadhaToast((radha) => radha.slice(1));
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [radhaToast]);

  async function hapNjoftimin(id: number) {
    setDukeHapur(id);
    setGabimi("");

    try {
      const response = await fetch(`/api/njoftimet/${id}/hap`, {
        method: "POST",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Njoftimi nuk u hap.");

      setNjoftimet((lista) =>
        lista.map((njoftim) =>
          njoftim.id === id
            ? { ...njoftim, lexuar_me: data.njoftimi.lexuar_me }
            : njoftim
        )
      );
      setDetaje(data.kerkesa as Detaje);
      setRadhaToast((radha) => radha.filter((njoftim) => njoftim.id !== id));
    } catch (error) {
      setGabimi(error instanceof Error ? error.message : "Njoftimi nuk u hap.");
    } finally {
      setDukeHapur(null);
    }
  }

  const tePalexuara = njoftimet.filter((njoftim) => njoftim.lexuar_me === null).length;
  const toast = radhaToast[0] ?? null;

  return (
    <section className="client-notifications" aria-live="polite">
      <h2>Njoftimet</h2>
      <p>Njoftime të palexuara: <strong>{tePalexuara}</strong></p>
      <button
        className="push-enable-button"
        type="button"
        onClick={() => void aktivizoPush()}
        disabled={pushNeProces || pushAktive}
      >
        {pushNeProces
          ? "Duke aktivizuar…"
          : pushAktive
            ? "Njoftimet e telefonit janë aktive"
            : "Aktivizo njoftimet në telefon"}
      </button>
      {pushMesazhi && <p className="push-message" role="status">{pushMesazhi}</p>}
      {pushMbeshte === false && !pushMesazhi && (
        <p className="push-message">Njoftimet e telefonit mund të aktivizohen nga iPhone me iOS 16.4 ose më të ri, pasi faqja të shtohet në Home Screen.</p>
      )}
      {gabimi && <p role="alert">{gabimi}</p>}
      {dukeNgarkuar && <p>Po ngarkohen njoftimet...</p>}
      {!dukeNgarkuar && njoftimet.length === 0 && <p>Nuk ke ende njoftime.</p>}

      {toast && (
        <div className="notification-toast" role="status">
          <strong>Njoftim i ri</strong>
          <p>{tekstiNjoftimit(toast.lloji)}</p>
          <button onClick={() => void hapNjoftimin(toast.id)} disabled={dukeHapur !== null}>
            Hape kërkesën
          </button>
          <button className="notification-dismiss" onClick={() => setRadhaToast((radha) => radha.slice(1))}>
            Mbyll
          </button>
        </div>
      )}

      {njoftimet.length > 0 && (
        <ul>
          {njoftimet.map((njoftim) => (
            <li key={njoftim.id}>
              <button
                onClick={() => void hapNjoftimin(njoftim.id)}
                disabled={dukeHapur !== null}
              >
                <strong>{njoftim.lexuar_me === null ? "E palexuar · " : "E lexuar · "}</strong>
                {tekstiNjoftimit(njoftim.lloji)} {njoftim.projekti} · Kërkesa #{njoftim.kerkesa_id}
                <br />
                <small>{new Date(njoftim.krijuar_me).toLocaleString("sq-AL")}</small>
              </button>
            </li>
          ))}
        </ul>
      )}

      {detaje && (
        <article className="notification-details">
          <h3>Kërkesa #{detaje.kerkesa_id} · {detaje.projekti}</h3>
          <p>Statusi: <strong>{detaje.status === "ne_shqyrtim" ? "U pranua" : detaje.status === "refuzuar" ? "U refuzua" : detaje.status}</strong></p>
          <p>{detaje.mesazhi}</p>
          <p>Vende të lira: {detaje.vende}</p>
          <button onClick={() => setDetaje(null)}>Kthehu te njoftimet</button>
        </article>
      )}
    </section>
  );
}
