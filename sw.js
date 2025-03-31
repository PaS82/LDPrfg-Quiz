self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('quiz-cache-v1').then(cache => {
      return cache.addAll([
        'index.html',
        'manifest.json',
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
        'https://cdn.jsdelivr.net/npm/chart.js'
      ]);
    })
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});