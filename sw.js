const CACHE_NAME = 'rezepte-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/generator.html',
  '/css/style.min.css',
  '/css/styleE.css',
  '/js/main.min.js',
  '/data/recipes.json',
  '/manifest.json',
  '/icons/logo.png'
];

// Installation: statische Ressourcen cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Aktivierung: alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch: Netzwerk bevorzugen, Cache als Fallback (stale-while-revalidate light)
self.addEventListener('fetch', event => {
  const { request } = event;

  // Für statische Assets: Cache first, dann Netzwerk
  if (STATIC_ASSETS.includes(new URL(request.url).pathname)) {
    event.respondWith(
      caches.match(request).then(cached =>
        cached || fetch(request)
      )
    );
    return;
  }

  // Für alles andere (z. B. Bilder): Netzwerk bevorzugen, Cache als Fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
