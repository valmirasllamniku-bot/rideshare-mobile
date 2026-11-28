
const CACHE_NAME = "ndertimtari-v7";

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

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data?.text() ?? "Hape Ndërtimtari për detaje." };
  }

  const title = typeof data.title === "string" ? data.title : "Njoftim i ri · Ndërtimtari";
  const options = {
    body: typeof data.body === "string" ? data.body : "Ke një përditësim për kërkesën tënde.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: typeof data.tag === "string" ? data.tag : "ndertimtari-njoftim",
    data: { url: typeof data.url === "string" ? data.url : "/panel" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/panel", self.location.origin);
  const destination = targetUrl.origin === self.location.origin ? targetUrl.href : `${self.location.origin}/panel`;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          await client.focus();
          if ("navigate" in client) await client.navigate(destination);
          return;
        }
      }
      await self.clients.openWindow(destination);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname === "/_next" ||
    url.pathname === "/sw.js" ||
    url.searchParams.has("_rsc")
  ) {
    return;
  }

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
              new Response(JSON.stringify({ savedAt }), {
                headers: { "Content-Type": "application/json" },
              })
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
            const info = metadata ? await metadata.json() : {};
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
            JSON.stringify({ error: "Nuk ka të dhëna offline." }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      })
    );

    return;
  }

  // Authenticated API responses must not be cached between browser sessions.
  if (url.pathname.startsWith("/api/")) return;

  // Mos ruaj faqet me të dhëna të lidhura me llogarinë në pajisje.
  if (
    url.pathname === "/panel" ||
    url.pathname.startsWith("/panel/") ||
    /\/kerkesa(?:\/|$)/.test(url.pathname)
  ) {
    event.respondWith(
      fetch(request).catch(async () =>
        (await caches.match("/offline.html")) ||
        new Response("Nuk ka lidhje me internetin.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }

          return response;
        } catch {
          return (
            (await caches.match(request)) ||
            (await caches.match("/offline.html"))
          );
        }
      })()
    );

    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);

      if (cached) return cached;

      try {
        const response = await fetch(request);

        if (response.ok) {
          await cache.put(request, response.clone());
        }

        return response;
      } catch {
        return new Response("Nuk ka lidhje me internetin.", {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }
    })
  );
});
