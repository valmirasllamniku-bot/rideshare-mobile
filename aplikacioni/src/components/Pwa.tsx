
"use client";

import { useEffect } from "react";

export default function Pwa() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker aktiv:", registration.scope);
        })
        .catch((error) => {
          console.error("Gabim në Service Worker:", error);
        });
    }
  }, []);

  return null;
}
