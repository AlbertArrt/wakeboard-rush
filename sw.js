// WAKEBOARD RUSH 3D — service worker: cache every game file for full offline play.
// Bump VERSION whenever any published file changes so clients pick up the update.
const VERSION = 'wbr3d-v2.0.5';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './vendor/three.module.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Navigations: network-first, so a freshly published build is what players get on the next
  // load; the cached index.html is only a fallback for offline play.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req, { cache: 'no-cache' }).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put('./index.html', copy)).catch(() => { });
        }
        return res;
      }).catch(() => caches.match('./index.html', { ignoreSearch: true }).then((hit) => hit || caches.match('./')).then((hit) => hit || Response.error()))
    );
    return;
  }
  // Other assets stay cache-first (offline play stays instant); the VERSION bump refreshes them.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => Response.error()))
  );
});
