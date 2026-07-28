const CACHE_NAME = 'ytk-dashboard-v20260728-c';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js',
  'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js',
  'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // auth.json / version.json 姘歌繙璧扮綉缁?  if (url.pathname.endsWith('auth.json') || url.pathname.endsWith('version.json')) {
    event.respondWith(fetch(event.request));
    return;
  }
  // index.html / 鏍硅矾寰? 鍙蛋缃戠粶锛屼笉缂撳瓨(閬垮厤缂栫爜/鐗堟湰闂)
  if (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
    return;
  }
  // 鍏朵粬闈欐€佽祫婧愮敤缂撳瓨浼樺厛
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
