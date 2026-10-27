const CACHE_NAME = 'swiptch-v5';
// 相対パスで持つ。itch.io の iframe（/html/<id>/ 配下）でも同じ定義で解決できる
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './js/api.js',
  './js/card.js',
  './js/deck.js',
  './js/dom.js',
  './js/gestures.js',
  './js/i18n.js',
  './js/likes.js',
  './js/locales.js',
  './js/state.js',
  './js/storage.js',
  './js/translate.js',
  './js/ui/modal.js',
  './js/ui/toast.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    // 1件でも失敗すると addAll 全体が落ちるので、個別に入れて失敗は無視する
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        ASSETS.map(asset =>
          cache.add(asset).catch(err => console.warn('SW: precache failed', asset, err))
        )
      )
    )
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
  const req = e.request;

  // GET 以外・API・別オリジンは Service Worker の管轄外
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // 画面遷移はネットワーク優先。オフライン時だけキャッシュへ落とす
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then(cached => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  // 静的アセットは stale-while-revalidate。
  // キャッシュを即返しつつ裏で取り直すので、更新が次の表示から効く。
  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
