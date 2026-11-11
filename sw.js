// Service worker do AURA: cache offline completo (cache-first). Gerado no build a partir deste modelo.
const VERSION = '755184e9f1';
const CACHE = 'aura-' + VERSION;
const FILES = ["./","./assets/index-10IlmAD-.js","./assets/index-CftTkO2T.css","./icons/favicon-32.png","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./index.html","./manifest.webmanifest","./vercel.json"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('aura-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // ignoreVary: o servidor pode mandar "Vary: Origin" e o <script crossorigin> não casaria com o que foi pré-cacheado
    const opts = { ignoreSearch: true, ignoreVary: true };
    const hit = await cache.match(req, opts);
    if (hit) return hit;
    const nav = req.mode === 'navigate';
    if (nav) {
      const shell = (await cache.match('./index.html', opts)) || (await cache.match('./', opts));
      if (shell) return shell;
    }
    try {
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') cache.put(req, res.clone());
      return res;
    } catch (err) {
      if (nav) { const shell = await cache.match('./index.html', opts); if (shell) return shell; }
      return Response.error();
    }
  })());
});
