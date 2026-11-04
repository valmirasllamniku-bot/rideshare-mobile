
const CACHE_NAME = "ndertimtari-v2";

const FILES_TO_CACHE = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        FILES_TO_CACHE.map((url) => cache.add(url))
      );
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  // Ruaj dhe përdor listën e projekteve edhe offline.
  if (url.pathname === "/api/projektet") {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            await cache.put(request, response.clone());
          }

          return response;
        } catch {
          const cached = await cache.match(request);

          if (cached) return cached;

          return new Response(
            JSON.stringify({
              error: "Nuk ka të dhëna të ruajtura offline.",
            }),
            {
              status: 503,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      })
    );

    return;
  }

  // Përdor faqen offline kur nuk ka internet.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        return (
          (await caches.match(request)) ||
          (await caches.match("/")) ||
          (await caches.match("/offline.html"))
        );
      })
    );

    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
