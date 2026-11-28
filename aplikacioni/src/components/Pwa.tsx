
"use client";

import { useEffect } from "react";

export default function Pwa() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV !== "production") {
        let aktiv = true;

        async function disableServiceWorker() {
          const scope = new URL("/", window.location.href).href;
          const registrations = await navigator.serviceWorker.getRegistrations();

          await Promise.all(
            registrations
              .filter((registration) => registration.scope === scope)
              .map((registration) => registration.unregister())
          );

          const cachesToClear = (await caches.keys()).filter((name) =>
            name.startsWith("ndertimtari-")
          );
          await Promise.all(cachesToClear.map((name) => caches.delete(name)));

          if (aktiv && navigator.serviceWorker.controller) {
            window.location.reload();
          }
        }

        void disableServiceWorker().catch((error) => {
          console.error("Service Worker nuk mund të çaktivizohet në development:", error);
        });

        return () => {
          aktiv = false;
        };
      }

      let dukeRifreskuar = false;
      const kurNdryshonKontrolluesi = () => {
        if (dukeRifreskuar) return;
        dukeRifreskuar = true;
        window.location.reload();
      };

      navigator.serviceWorker.addEventListener("controllerchange", kurNdryshonKontrolluesi);
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then((registration) => {
          console.log("Service Worker aktiv:", registration.scope);
          return registration.update();
        })
        .catch((error) => {
          console.error("Gabim në Service Worker:", error);
        });

      return () => {
        navigator.serviceWorker.removeEventListener("controllerchange", kurNdryshonKontrolluesi);
      };
    }
  }, []);

  return null;
}
