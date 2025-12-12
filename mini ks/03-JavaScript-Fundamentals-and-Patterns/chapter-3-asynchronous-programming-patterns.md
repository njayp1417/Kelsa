# Chapter 3: Asynchronous Programming Patterns
## Mastering Promises, Async/Await, and Concurrent Operations

---

## 3.1 Promise-Based Architecture

```javascript
// Promise constructor for image format detection
testFormat(format) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = function() {
      resolve(image.width === 1);
    };
    image.onerror = function() {
      resolve(false);
    };
    image.src = `data:image/${format};base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=`;
  });
}

// Async/await implementation
async checkImageFormats() {
  this.supportsWebP = await this.testFormat('webp');
  this.supportsAVIF = await this.testFormat('avif');
  
  if (this.supportsWebP) document.body.classList.add('webp');
  if (this.supportsAVIF) document.body.classList.add('avif');
}
```

**DETAILED EXPLANATION:**

Asynchronous programming is fundamental to modern web development, enabling non-blocking operations that maintain responsive user interfaces. The Kelsa Events project demonstrates sophisticated async patterns for image optimization, form handling, and API interactions.

### 3.1.1 Promise Construction Patterns

```javascript
// Basic Promise constructor
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    
    img.src = src;
  });
}

// Promise with timeout
function loadImageWithTimeout(src, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    const timeoutId = setTimeout(() => {
      reject(new Error(`Image load timeout: ${src}`));
    }, timeout);
    
    img.onload = () => {
      clearTimeout(timeoutId);
      resolve(img);
    };
    
    img.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    img.src = src;
  });
}
```

**PROMISE STATE MANAGEMENT:**

**Promise States:**
1. **Pending**: Initial state, neither fulfilled nor rejected
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

**State Transition Rules:**
```javascript
// Promise can only transition once
const promise = new Promise((resolve, reject) => {
  resolve('success');
  reject('error');    // This will be ignored
  resolve('again');   // This will also be ignored
});
```

**COMPUTER SCIENCE PRINCIPLES:**

**Finite State Machine:**
```
[Pending] --resolve()--> [Fulfilled]
    |
    +----reject()-----> [Rejected]
```

**Memory Management:**
- Promises hold references to callback functions
- Resolved/rejected promises can be garbage collected
- Pending promises prevent garbage collection of their callbacks

### 3.1.2 Promise Chaining and Composition

```javascript
// Sequential promise chaining
function processImageSequentially(imageSrc) {
  return loadImage(imageSrc)
    .then(img => resizeImage(img, 800, 600))
    .then(resizedImg => compressImage(resizedImg, 0.8))
    .then(compressedImg => uploadImage(compressedImg))
    .then(uploadResult => {
      console.log('Image processed successfully:', uploadResult);
      return uploadResult;
    })
    .catch(error => {
      console.error('Image processing failed:', error);
      throw error; // Re-throw to maintain error chain
    });
}

// Parallel promise execution
async function processMultipleImages(imageSources) {
  try {
    // Process all images concurrently
    const results = await Promise.all(
      imageSources.map(src => processImageSequentially(src))
    );
    
    console.log('All images processed:', results);
    return results;
  } catch (error) {
    console.error('One or more images failed:', error);
    throw error;
  }
}
```

**PROMISE UTILITY METHODS:**

```javascript
// Promise.all - All must succeed
const allResults = await Promise.all([
  fetchUserData(),
  fetchUserPosts(),
  fetchUserSettings()
]);

// Promise.allSettled - Get all results regardless of success/failure
const allSettled = await Promise.allSettled([
  fetchUserData(),
  fetchUserPosts(),
  fetchUserSettings()
]);

allSettled.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`Request ${index} succeeded:`, result.value);
  } else {
    console.log(`Request ${index} failed:`, result.reason);
  }
});

// Promise.race - First to complete wins
const fastest = await Promise.race([
  fetchFromPrimaryAPI(),
  fetchFromBackupAPI(),
  timeoutPromise(5000)
]);

// Promise.any - First to succeed wins (ES2021)
const firstSuccess = await Promise.any([
  fetchFromServer1(),
  fetchFromServer2(),
  fetchFromServer3()
]);
```

### 3.1.3 Error Handling Strategies

```javascript
// Comprehensive error handling
class APIClient {
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      // Handle HTTP errors
      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response
        );
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      // Network errors, parsing errors, etc.
      if (error instanceof APIError) {
        throw error; // Re-throw API errors
      }
      
      // Wrap other errors
      throw new APIError(
        `Request failed: ${error.message}`,
        0,
        null,
        error
      );
    }
  }
}

// Custom error class
class APIError extends Error {
  constructor(message, status, response, originalError) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
    this.originalError = originalError;
  }
}
```

## 3.2 Async/Await Patterns

```javascript
// Modern async/await implementation
class ImageOptimizer {
  async checkImageFormats() {
    try {
      // Sequential execution
      this.supportsWebP = await this.testFormat('webp');
      this.supportsAVIF = await this.testFormat('avif');
      
      // Update DOM based on results
      this.updateBodyClasses();
      
    } catch (error) {
      console.error('Format detection failed:', error);
      // Fallback to basic image support
      this.supportsWebP = false;
      this.supportsAVIF = false;
    }
  }
  
  async checkImageFormatsParallel() {
    try {
      // Parallel execution for better performance
      const [webpSupport, avifSupport] = await Promise.all([
        this.testFormat('webp'),
        this.testFormat('avif')
      ]);
      
      this.supportsWebP = webpSupport;
      this.supportsAVIF = avifSupport;
      this.updateBodyClasses();
      
    } catch (error) {
      console.error('Format detection failed:', error);
    }
  }
}
```

### 3.2.1 Sequential vs Parallel Execution

```javascript
// Sequential execution (slower but ordered)
async function processDataSequentially(items) {
  const results = [];
  
  for (const item of items) {
    try {
      const result = await processItem(item);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process item ${item.id}:`, error);
      results.push(null); // Placeholder for failed item
    }
  }
  
  return results;
}

// Parallel execution (faster but unordered)
async function processDataParallel(items) {
  const promises = items.map(async (item) => {
    try {
      return await processItem(item);
    } catch (error) {
      console.error(`Failed to process item ${item.id}:`, error);
      return null;
    }
  });
  
  return await Promise.all(promises);
}

// Controlled concurrency (balanced approach)
async function processDataWithConcurrency(items, concurrency = 3) {
  const results = [];
  
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchPromises = batch.map(item => processItem(item));
    
    try {
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    } catch (error) {
      console.error('Batch processing failed:', error);
      // Handle partial failures
      const settledResults = await Promise.allSettled(batchPromises);
      results.push(...settledResults.map(r => 
        r.status === 'fulfilled' ? r.value : null
      ));
    }
  }
  
  return results;
}
```

### 3.2.2 Advanced Async Patterns

```javascript
// Retry mechanism with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
const result = await retryWithBackoff(async () => {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error('API request failed');
  return response.json();
});
```

**ASYNC ITERATOR PATTERN:**
```javascript
// Async generator for streaming data
async function* fetchDataStream(urls) {
  for (const url of urls) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      yield data;
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      yield null;
    }
  }
}

// Usage with for-await-of
async function processStream() {
  const urls = ['/api/data1', '/api/data2', '/api/data3'];
  
  for await (const data of fetchDataStream(urls)) {
    if (data) {
      console.log('Processing data:', data);
      // Process each piece of data as it arrives
    }
  }
}
```

## 3.3 Service Worker and Background Processing

```javascript
// Service Worker registration and management
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            showUpdateNotification();
          }
        });
      });
      
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}
```

### 3.3.1 Service Worker Event Handling

```javascript
// Service Worker implementation (service-worker.js)
const CACHE_NAME = 'kelsa-events-v1';
const DYNAMIC_CACHE = 'kelsa-events-dynamic-v1';

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell and assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  if (event.request.headers.get('accept').includes('text/html')) {
    // Network first for HTML
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache first for other resources
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          
          return fetch(event.request)
            .then(response => {
              if (response.status === 200) {
                const responseToCache = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(event.request, responseToCache));
              }
              return response;
            });
        })
    );
  }
});
```

### 3.3.2 Background Sync and Push Notifications

```javascript
// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

async function syncContactForms() {
  try {
    // Get pending form submissions from IndexedDB
    const pendingForms = await getPendingFormSubmissions();
    
    for (const formData of pendingForms) {
      try {
        await submitForm(formData);
        await removePendingSubmission(formData.id);
        console.log('Form synced successfully:', formData.id);
      } catch (error) {
        console.error('Failed to sync form:', formData.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'New notification from Kelsa Events',
    icon: '/assets/favicon.ico',
    badge: '/assets/favicon.ico',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/assets/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/assets/icons/dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Kelsa Events', options)
  );
});
```

## 3.4 Real-Time Communication Patterns

```javascript
// WebSocket connection management
class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.messageQueue = [];
    this.eventListeners = new Map();
  }
  
  async connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.flushMessageQueue();
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        };
        
        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.handleReconnect();
        };
        
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, delay);
    }
  }
  
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(data);
    }
  }
  
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }
}
```

### 3.4.1 Server-Sent Events (SSE)

```javascript
// Server-Sent Events for real-time updates
class EventStreamManager {
  constructor(url) {
    this.url = url;
    this.eventSource = null;
    this.listeners = new Map();
  }
  
  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.eventSource = new EventSource(this.url);
        
        this.eventSource.onopen = () => {
          console.log('Event stream connected');
          resolve();
        };
        
        this.eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.emit('message', data);
        };
        
        this.eventSource.onerror = (error) => {
          console.error('Event stream error:', error);
          
          if (this.eventSource.readyState === EventSource.CLOSED) {
            reject(new Error('Event stream connection failed'));
          }
        };
        
        // Custom event handlers
        this.eventSource.addEventListener('notification', (event) => {
          const notification = JSON.parse(event.data);
          this.emit('notification', notification);
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
  
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// Usage
const eventStream = new EventStreamManager('/api/events');
eventStream.on('notification', (notification) => {
  showNotification(notification.message, notification.type);
});

await eventStream.connect();
```

This chapter demonstrates sophisticated asynchronous programming patterns that enable responsive, real-time web applications. The next chapter will explore performance optimization and debugging techniques for JavaScript applications.