// Service Worker for Nyx PWA
const CACHE_NAME = "nyx-pwa-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/fonts/fonts.css",
  "/fonts/cairo-arabic.woff2",
  "/fonts/cairo-latin.woff2",
  "/fonts/tajawal-300.woff2",
  "/fonts/tajawal-400.woff2",
  "/fonts/tajawal-500.woff2",
  "/fonts/tajawal-700.woff2",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-512-maskable.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match("/index.html"));
    })
  );
});
