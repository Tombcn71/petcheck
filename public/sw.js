self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("push", function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: data.icon || "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        vibrate: [100, 50, 100],
        data: {
          url: data.url || "https://doggyscan.nl/dashboard",
        },
      };
      event.waitUntil(
        self.registration.showNotification(data.title || "Doggyscan Update", options)
      );
    } catch (e) {
      console.error("Fout bij het parsen van push data:", e);
    }
  }
});

self.addEventListener("notificationclick", function (event) {
  const notification = event.notification;
  const targetUrl = notification.data.url;
  notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
