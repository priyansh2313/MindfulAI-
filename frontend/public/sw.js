// Service Worker for Care Connect Push Notifications

const CACHE_NAME = 'care-connect-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'You have a new message from your family',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Message',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Care Connect', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app to the care connect page
    event.waitUntil(
      clients.openWindow('/care-connect')
    );
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync any pending data when connection is restored
    const pendingData = await getPendingData();
    
    for (const data of pendingData) {
      await syncData(data);
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getPendingData() {
  // Get any data that was stored locally while offline
  const pendingData = localStorage.getItem('careConnectPendingData');
  return pendingData ? JSON.parse(pendingData) : [];
}

async function syncData(data) {
  try {
    const response = await fetch('/api/care-connect/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Remove from pending data
      const pendingData = await getPendingData();
      const updatedPendingData = pendingData.filter(item => item.id !== data.id);
      localStorage.setItem('careConnectPendingData', JSON.stringify(updatedPendingData));
    }
  } catch (error) {
    console.error('Sync failed for data:', data, error);
  }
} 