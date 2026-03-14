const CACHE_NAME = 'tnt-decision-v1.5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/2382/2382461.png'
];

// 1. 설치될 때 파일들을 캐시에 저장
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// 2. 새로운 버전이 올라오면 옛날 캐시 삭제 (스마트 업데이트)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. 오프라인 작동 로직 (Network First 전략)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // 인터넷이 끊겼을 때만 캐시(저장된 파일)에서 꺼내옴
      return caches.match(event.request);
    })
  );
});
