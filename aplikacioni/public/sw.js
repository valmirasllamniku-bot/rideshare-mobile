
const CACHE_NAME = "ndertimtari-v3";

const FILES_TO_CACHE = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
];

const META_URL = "/__ndertimtari_cache_meta__";

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

  // Ruajtja e listës së projekteve.
  if (
    url.pathname === "/api/udhetimet" ||
    url.pathname === "/api/projektet"
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            const savedAt = new Date().toISOString();

            await cache.put(request, response.clone());

            await cache.put(
              META_URL,
              new Response(
                JSON.stringify({ savedAt }),
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
            );

            const headers = new Headers(response.headers);
            headers.set("x-rideshare-source", "server");
            headers.set("x-rideshare-saved-at", savedAt);

            return new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers,
            });
          }

          return response;
        } catch {
          const cached = await cache.match(request);

          if (cached) {
            const metadata = await cache.match(META_URL);
            const info = metadata
              ? await metadata.json()
              : {};

            const headers = new Headers(cached.headers);
            headers.set("x-rideshare-source", "cache");

            if (info.savedAt) {
              headers.set("x-rideshare-saved-at", info.savedAt);
            }

            return new Response(cached.body, {
              status: cached.status,
              statusText: cached.statusText,
              headers,
            });
          }

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

  // Faqja që hapet pa internet.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        return (
          (await caches.match(request)) ||
          (await caches.match("/offline.html"))
        );
      })
    );

    return;
  }

  event.respondWith(
    caches.match(request).then((cached) =>
      cached || fetch(request)
    )
  );
});
