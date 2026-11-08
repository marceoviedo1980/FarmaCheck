// Prefijo propio: al actualizar solo se borran las cachés de ESTA app.
// Otras PWA del mismo dominio (marceoviedo1980.github.io) no se tocan.
const CACHE_PREFIX = 'farmacheck-lp-';
const CACHE = CACHE_PREFIX + 'v84';
const LEGACY = /^farmacia-v\d+$/; // nombres antiguos de esta misma app
const FILES = ['./index.html', './medicamentos.json', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => (k.startsWith(CACHE_PREFIX) || LEGACY.test(k)) && k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
 
