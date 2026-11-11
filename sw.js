// Service worker do AURA: cache offline completo (cache-first). Gerado no build a partir deste modelo.
const VERSION = 'eb507b52a0';
const CACHE = 'aura-' + VERSION;
const FILES = ["./","./art/ajudantes/arqueira.webp","./art/ajudantes/escudeiro.webp","./art/ajudantes/golem.webp","./art/ajudantes/ladino.webp","./art/ajudantes/vidente.webp","./art/chefes/devorador.webp","./art/chefes/golem.webp","./art/chefes/rei.webp","./art/fundos/abismo.webp","./art/fundos/catacumbas.webp","./art/fundos/cristal.webp","./art/heroi.webp","./art/icone-1024.webp","./art/icone-256.webp","./art/icones/alvo.webp","./art/icones/arvore.webp","./art/icones/aura.webp","./art/icones/bau.webp","./art/icones/chefe.webp","./art/icones/coroa.webp","./art/icones/espada.webp","./art/icones/essencia.webp","./art/icones/forca.webp","./art/icones/heroi.webp","./art/icones/impacto.webp","./art/icones/moeda.webp","./art/icones/moedas.webp","./art/icones/presenca.webp","./art/icones/punho.webp","./art/icones/vento.webp","./art/monstros/aranha.webp","./art/monstros/cristalino.webp","./art/monstros/espectro.webp","./art/monstros/esqueleto.webp","./art/monstros/gosma.webp","./art/monstros/morcego.webp","./art/monstros/observador.webp","./art/monstros/rato.webp","./assets/index-C4iaR0tE.js","./assets/index-D5CLHD8K.css","./fonts/OFL-Cinzel.txt","./fonts/cinzel-decorative-latin-700-normal.woff2","./fonts/cinzel-decorative-latin-900-normal.woff2","./fonts/cinzel-latin-700-normal.woff2","./fonts/cinzel-latin-900-normal.woff2","./icons/favicon-32.png","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./index.html","./manifest.webmanifest","./vercel.json"];

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
