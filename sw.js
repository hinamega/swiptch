const CACHE_NAME = 'swiptch-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/js/api.js',
  '/js/card.js',
  '/js/deck.js',
  '/js/dom.js',
  '/js/gestures.js',
  '/js/i18n.js',
  '/js/likes.js',
  '/js/locales.js',
  '/js/state.js',
  '/js/storage.js',
  '/js/translate.js',
  '/js/ui/modal.js',
  '/js/ui/toast.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Force immediate activation
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control immediately
});

self.addEventListener('fetch', e => {
  // Exclude API calls and cross-origin requests from service worker caching
  if (e.request.url.includes('/api/') || !e.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
