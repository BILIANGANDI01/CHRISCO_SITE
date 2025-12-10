const CACHE_NAME = "chrisco-cache-v4";

const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/hero.jpg",
  "/preaching.jpg",
  "/gallery2.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());
self.addEventListener('fetch', () => {}); // minimal; use next-pwa for production
