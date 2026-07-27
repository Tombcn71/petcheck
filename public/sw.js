const CACHE = "doggyscan-v1";
const OFFLINE_URL = "/";

// Bij installatie: cache de shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([OFFLINE_URL, "/icons/icon-192x192.png", "/icons/icon-512x512.png"])
    )
  );
  self.skipWaiting();
});

// Bij activatie: oude caches opruimen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first, val terug op cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("/api/")) return; // API nooit cachen

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match(OFFLINE_URL)))
  );
});

// Push notificaties
self.addEventListener("push", (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || "Doggyscan", {
        body: data.body,
        icon: data.icon || "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        vibrate: [100, 50, 100],
        data: { url: data.url || "https://doggyscan.nl/dashboard" },
      })
    );
  } catch (e) {
    console.error("Push fout:", e);
  }
});

// Notificatie klik
self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data?.url || "/dashboard";
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
