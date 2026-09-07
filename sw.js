const CACHE_NAME = 'pwa-iframe-cache-v2';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon-512.png'
];

// Fasa Pemasangan (Install): Menyimpan fail asas ke dalam cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache dibuka');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fasa Pengaktifan (Activate): Membuang cache lama jika ada versi baharu
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
});

// Fasa Pengambilan (Fetch): Memaparkan fail dari cache jika ada (membolehkan PWA berfungsi), 
// jika tiada, ia akan mengambilnya dari rangkaian.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Kembalikan response dari cache jika dijumpai
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
