self.addEventListener("install", () => {
  console.log("Doggyscan Service Worker geïnstalleerd");
});

self.addEventListener("fetch", (event) => {
  // Dit is nodig om de app "installeerbaar" te maken
  event.respondWith(fetch(event.request));
});
