
// Service Worker for PWA functionality

const CACHE_NAME = 'fieldwise-sentinel-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network-first strategy with fallback to cache
self.addEventListener('fetch', (event) => {
  // Only cache API requests and static assets
  if (event.request.url.includes('/api/') || STATIC_ASSETS.some(asset => event.request.url.includes(asset))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const clonedResponse = response.clone();
          
          // Open cache and store the fetched resource
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          
          return response;
        })
        .catch(() => {
          // If network request fails, try to return from cache
          return caches.match(event.request);
        })
    );
  }
});

// Handle background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Function to sync data when coming back online
async function syncData() {
  try {
    // In a real implementation, this would retrieve data from IndexedDB
    // and send it to the server
    console.log('Syncing offline data to server');
    
    // For now, we'll just post a message to all clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        timestamp: new Date().toISOString()
      });
    });
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
