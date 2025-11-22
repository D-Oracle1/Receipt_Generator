// Receipt Generator Service Worker v1.0.0
const CACHE_VERSION = 'receipt-gen-v1';
const CACHE_ASSETS = `${CACHE_VERSION}-assets`;
const CACHE_PAGES = `${CACHE_VERSION}-pages`;
const CACHE_API = `${CACHE_VERSION}-api`;

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/offline.html',
];

// API routes that should be cached
const API_CACHE_ROUTES = [
  '/api/user',
  '/api/receipts',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_ASSETS);
        await cache.addAll(ASSETS_TO_CACHE);
        console.log('[ServiceWorker] Installation complete');
        self.skipWaiting();
      } catch (error) {
        console.error('[ServiceWorker] Installation failed:', error);
      }
    })()
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.startsWith(CACHE_VERSION)) {
              console.log(`[ServiceWorker] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
        self.clients.claim();
        console.log('[ServiceWorker] Activation complete');
      } catch (error) {
        console.error('[ServiceWorker] Activation failed:', error);
      }
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip WebSocket and other non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Strategy: API requests - network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    return event.respondWith(
      (async () => {
        try {
          const response = await fetch(request.clone());

          // Cache successful responses
          if (response.ok && request.method === 'GET') {
            const cache = await caches.open(CACHE_API);
            cache.put(request, response.clone());
          }

          return response;
        } catch (error) {
          console.log(`[ServiceWorker] Fetch failed for ${request.url}, trying cache`);

          // Try to get from cache
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }

          // Return offline response
          return new Response(
            JSON.stringify({ error: 'Offline - cached data not available' }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      })()
    );
  }

  // Strategy: HTML pages - cache first, fallback to network
  if (request.method === 'GET' && (request.headers.get('accept')?.includes('text/html') || url.pathname === '/')) {
    return event.respondWith(
      (async () => {
        const cached = await caches.match(request);

        try {
          const response = await fetch(request.clone());

          if (response.ok) {
            const cache = await caches.open(CACHE_PAGES);
            cache.put(request, response.clone());
          }

          return response;
        } catch (error) {
          console.log(`[ServiceWorker] Network error for ${request.url}`);

          if (cached) {
            return cached;
          }

          // Return offline page
          const offlineResponse = await caches.match('/offline.html');
          return offlineResponse || new Response('Offline', { status: 503 });
        }
      })()
    );
  }

  // Strategy: Static assets - cache first, fallback to network
  if (request.method === 'GET') {
    return event.respondWith(
      (async () => {
        const cached = await caches.match(request);

        if (cached) {
          return cached;
        }

        try {
          const response = await fetch(request.clone());

          if (response.ok) {
            const cache = await caches.open(CACHE_ASSETS);
            cache.put(request, response.clone());
          }

          return response;
        } catch (error) {
          console.log(`[ServiceWorker] Failed to fetch ${request.url}`);
          return new Response('Not available offline', { status: 503 });
        }
      })()
    );
  }
});

// Message event - handle messages from client
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    });
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-receipts') {
    event.waitUntil(
      (async () => {
        try {
          // Attempt to sync pending receipts
          const response = await fetch('/api/receipts/sync', {
            method: 'POST',
          });

          if (response.ok) {
            console.log('[ServiceWorker] Receipt sync completed');
          }
        } catch (error) {
          console.log('[ServiceWorker] Receipt sync failed:', error);
          // Retry later
          throw error;
        }
      })()
    );
  }
});
