// Service Worker for PWA functionality

const CACHE_NAME = 'fieldwise-sentinel-v2';
const DATA_CACHE_NAME = 'fieldwise-data-v1';

// Assets to cache on install - expanded list
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  '/dashboard',
  '/login'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches and ensure service worker update takes effect immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME);
            })
            .map((cacheName) => {
              console.log('Deleting outdated cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Ensure the service worker takes control of all clients
      self.clients.claim()
    ])
  );
});

// Network first strategy with falling back to cache
const networkFirst = async (request) => {
  try {
    // Try to get from network first
    const networkResponse = await fetch(request);
    
    // If successful, clone and cache the response
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(request.url.includes('/api/') ? DATA_CACHE_NAME : CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try to return from cache
    const cachedResponse = await caches.match(request);
    
    // If we have a cache hit, return it
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's a navigation request and we don't have a cached response, 
    // return the offline page
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    // Otherwise just rethrow the error
    throw error;
  }
};

// Cache first strategy with background update
const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Return the cached response immediately
    // But also update the cache in the background
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse);
        }
      })
      .catch(() => {
        console.log('Background fetch failed, using cached version');
      });
      
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  const networkResponse = await fetch(request);
  
  // Cache the response
  if (networkResponse && networkResponse.status === 200) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
};

// Fetch event - improved caching strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // For API requests, use network-first strategy
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  
  // For static assets, use cache-first strategy
  if (STATIC_ASSETS.some(asset => event.request.url.includes(asset)) || 
      event.request.destination === 'style' || 
      event.request.destination === 'script' || 
      event.request.destination === 'image') {
    event.respondWith(cacheFirst(event.request));
    return;
  }
  
  // For everything else (like navigation requests), use network-first
  event.respondWith(networkFirst(event.request));
});

// Handle background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  } else if (event.tag === 'backup-data') {
    event.waitUntil(backupData());
  }
});

// Improved data synchronization function
async function syncData() {
  try {
    // Get all offline data from IndexedDB
    const offlineItems = await getOfflineData();
    
    if (offlineItems && offlineItems.length > 0) {
      console.log(`Syncing ${offlineItems.length} offline items to server`);
      
      // For each item, try to sync with the server
      const syncResults = await Promise.allSettled(
        offlineItems.map(async (item) => {
          // Based on item type, use appropriate API endpoint
          const endpoint = getEndpointForItem(item);
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Add authenticated user token if available
              ...(getAuthToken() ? { 'Authorization': `Bearer ${getAuthToken()}` } : {})
            },
            body: JSON.stringify(item.data)
          });
          
          if (response.ok) {
            // Remove from offline storage if sync successful
            await removeFromOfflineStorage(item.id);
            return { success: true, item };
          }
          
          return { success: false, item, error: await response.text() };
        })
      );
      
      // Post a message to all clients
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETED',
          timestamp: new Date().toISOString(),
          results: syncResults
        });
      });
      
      return syncResults;
    }
  } catch (error) {
    console.error('Sync failed:', error);
    // Notify clients about sync failure
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_FAILED',
        timestamp: new Date().toISOString(),
        error: error.message
      });
    });
  }
}

// Automated backup function
async function backupData() {
  try {
    // Get all important data from IndexedDB
    const dataToBackup = await getAllDataForBackup();
    
    if (dataToBackup) {
      // Create a versioned backup
      const backupVersion = new Date().toISOString();
      const backup = {
        version: backupVersion,
        timestamp: new Date().toISOString(),
        data: dataToBackup
      };
      
      // Store backup in cache storage
      const cache = await caches.open('backups-cache');
      await cache.put(`/backups/${backupVersion}.json`, new Response(JSON.stringify(backup)));
      
      // Limit to keep only last 5 backups
      const backupsList = await getBackupsList();
      if (backupsList.length > 5) {
        // Remove oldest backups
        const oldestBackups = backupsList.sort().slice(0, backupsList.length - 5);
        await Promise.all(oldestBackups.map(async (backup) => {
          await cache.delete(`/backups/${backup}.json`);
        }));
      }
      
      // Notify clients about backup completion
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'BACKUP_COMPLETED',
          timestamp: new Date().toISOString(),
          version: backupVersion
        });
      });
    }
  } catch (error) {
    console.error('Backup failed:', error);
  }
}

// Helper functions
function getAuthToken() {
  return self.localStorage ? localStorage.getItem('auth_token') : null;
}

function getEndpointForItem(item) {
  // Map item type to API endpoint
  const endpoints = {
    'pestDetection': '/api/v1/detect',
    'sensorReading': '/api/v1/sensors/reading',
    'userSettings': '/api/v1/user/settings',
  };
  
  return endpoints[item.type] || '/api/v1/data';
}

// These functions would actually interact with IndexedDB
// Placeholder implementations for now
async function getOfflineData() {
  return []; // Would retrieve from IndexedDB in a real implementation
}

async function removeFromOfflineStorage(id) {
  // Would delete from IndexedDB in a real implementation
}

async function getAllDataForBackup() {
  return {}; // Would retrieve all important data in a real implementation
}

async function getBackupsList() {
  return []; // Would get list of existing backups
}

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New notification',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: data.data || {},
      vibrate: [100, 50, 100],
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'FieldWise Notification', options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/dashboard';
  
  event.waitUntil(
    self.clients.matchAll({type: 'window'}).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is open with target URL, open one
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
