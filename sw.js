// sw.js — same-origin only (no CDN precache) to avoid CORS
const CACHE_NAME = 'baduanjin-missions-v4'; // 換版本可強制更新
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// 安裝：預先快取同網域核心檔案
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
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

// 擷取：同網域採用「Cache → Network（並回寫快取）」；跨網域直接放行（避免 CORS）
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 僅處理同網域請求
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((resp) => {
        // 將可用回應寫入快取（忽略 opaque/error）
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return resp;
      }).catch(() => {
        // 導航請求離線回退到首頁（SPA）
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return caches.match(event.request);
      });
    })
  );
});
