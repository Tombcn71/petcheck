self.addEventListener("install", (event) => {
  console.log("Doggyscan Service Worker geïnstalleerd");
  self.skipWaiting(); // Dwing de nieuwe SW om direct de oude te vervangen
});

self.addEventListener("activate", (event) => {
  console.log("Doggyscan Service Worker geactiveerd");
});

self.addEventListener("fetch", (event) => {
  // Nodig voor de 'install' prompt op Android
  event.respondWith(fetch(event.request));
});
