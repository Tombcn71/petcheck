self.addEventListener("push", function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: data.icon || "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png", // Gebruik idealiter een kleiner, monochroom icoon voor de badge
        vibrate: [100, 50, 100], // Laat de telefoon trillen voor extra aandacht
        data: {
          url: data.url || "https://doggyscan.nl/dashboard", // Geef een specifieke URL mee vanuit de server
        },
      };

      event.waitUntil(
        self.registration.showNotification(
          data.title || "Doggyscan Update",
          options,
        ),
      );
    } catch (e) {
      console.error("Fout bij het parsen van push data:", e);
    }
  }
});

self.addEventListener("notificationclick", function (event) {
  const notification = event.notification;
  const targetUrl = notification.data.url; // Haal de URL op uit de meegestuurde data

  notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Als de app al open staat in een tabblad, focus daar dan op...
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        // ...anders open een nieuw venster
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
