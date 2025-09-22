// sw.js  — same-origin only, no CDN precache
const CACHE_NAME = 'baduanjin-missions-v2'; // 版本號改一下，確保新 SW 生效
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// 安裝：只快取同網域的核心檔
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// 啟用：清掉舊版快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// 取得：同網域採用「Cache, falling back to network」；跨網域直接放行
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    // 不處理 CDN / 第三方，避免 CORS 問題
    return; // 讓瀏覽器自己做預設 fetch
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        // 只把可快取的同源回應寫入快取
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return resp;
      }).catch(() => caches.match('./index.html')); // 離線回退
    })
  );
});
