const CACHE_NAME = "proche-v3";
const CORE_ASSETS = ["./index.html", "./app.js", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Reseau d'abord pour les donnees Firebase (temps reel), cache pour le reste (coquille de l'app)
self.addEventListener("fetch", (e) => {
  const url = e.request.url;
  if (url.includes("firebaseio.com") || url.includes("openstreetmap.org")) return; // toujours en direct
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => cached))
  );
});
