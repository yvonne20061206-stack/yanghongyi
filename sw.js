const CACHE_NAME = 'ytk-dashboard-v20260728-b';
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
  // auth.json 鍜?version.json 姘歌繙璧扮綉缁滐紝涓嶇紦瀛?  if (url.pathname.endsWith('auth.json') || url.pathname.endsWith('version.json')) {
    event.respondWith(fetch(event.request));
    return;
  }
  // index.html 璧扮綉缁滀紭鍏堬紙淇濊瘉鐢ㄦ埛鎷垮埌鏈€鏂扮増锛?  if (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
    event.respondWith(fetch(event.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
      return r;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
