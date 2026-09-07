const CACHE_NAME = 'pwa-iframe-cache-v2';
const urlsToCache = [
    './index.html',
    './manifest.json',
    './icon-512.png'
];

// Fasa Pemasangan (Install)
self.addEventListener('install', event => {
    // Paksa Service Worker baharu untuk terus aktif tanpa menunggu
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache dibuka dan fail sedang disimpan');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Gagal menyimpan cache:', err))
    );
});

// Fasa Pengaktifan (Activate)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Buang cache versi lama
                    if (cacheName !== CACHE_NAME) {
                        console.log('Membuang cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Mula mengawal halaman serta-merta
    );
});

// Fasa Pengambilan (Fetch)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Kembalikan response dari cache jika dijumpai
                if (response) {
                    return response;
                }
                // Jika tiada dalam cache, muat dari internet (rangkaian)
                return fetch(event.request);
            })
    );
});
