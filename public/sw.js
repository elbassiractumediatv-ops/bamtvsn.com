// Compatibility worker for older installed clients requesting /sw.js.
// Deliberately network-only: do not cache pages, admin responses, or API data.
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map(name => caches.delete(name)));
    await self.clients.claim();
    await self.registration.unregister();
  })());
});
