const C = 'myfit-v1';
const F = ['./index.html', './manifest.json', './icon.svg'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(C).then((c) => c.addAll(F)));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((k) =>
        Promise.all(k.filter((x) => x !== C).map((x) => caches.delete(x))),
      ),
  );
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(
      (r) =>
        r ||
        fetch(e.request)
          .then((res) => {
            const cp = res.clone();
            caches.open(C).then((c) => c.put(e.request, cp));
            return res;
          })
          .catch(() => caches.match('./index.html')),
    ),
  );
});
