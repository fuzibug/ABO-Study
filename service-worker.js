const CACHE_NAME = 'abo-study-v1';
const urlsToCache = [
  '/ABO-Study/',
  '/ABO-Study/index.html',
  '/ABO-Study/css/styles.css',
  '/ABO-Study/css/appearance.css',
  '/ABO-Study/js/constants.js',
  '/ABO-Study/js/state.js',
  '/ABO-Study/js/data.js',
  '/ABO-Study/js/ui.js',
  '/ABO-Study/js/quiz.js',
  '/ABO-Study/js/api.js',
  '/ABO-Study/js/progress.js',
  '/ABO-Study/js/appearance.js',
  '/ABO-Study/js/srs.js',
  '/ABO-Study/js/analytics.js',
  '/ABO-Study/js/calculator.js',
  '/ABO-Study/js/simulator.js',
  '/ABO-Study/js/flashcards.js',
  '/ABO-Study/js/export.js'
];

// Install service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Update service worker and clear old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
