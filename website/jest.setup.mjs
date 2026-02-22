// Jest setup file
import 'jest-environment-jsdom';
import { TextEncoder, TextDecoder } from 'util';

// Mock base URL for Vite environment
global.window.VITE_BASE_URL = '/smartgrind/';

// Mock Response and Request for Service Worker tests
global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.headers = new Map(Object.entries(init.headers || {}));
    this.ok = this.status >= 200 && this.status < 300;
    this.url = init.url || '';
  }
  
  async text() {
    return typeof this.body === 'string' ? this.body : '';
  }
  
  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
  }
  
  async blob() {
    // Create a Blob from the body content
    const content = typeof this.body === 'string' ? this.body : '';
    return {
      size: content.length,
      type: this.headers.get('Content-Type') || 'text/plain',
    };
  }

  async arrayBuffer() {
    // Convert body to ArrayBuffer
    if (this.body instanceof ReadableStream) {
      // Read from ReadableStream
      const reader = this.body.getReader();
      const chunks = [];
      let done = false;
      while (!done) {
        const result = await reader.read();
        done = result.done;
        if (result.value) {
          chunks.push(result.value);
        }
      }
      // Combine chunks
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      return combined.buffer;
    }
    const content = typeof this.body === 'string' ? this.body : '';
    const encoder = new TextEncoder();
    return encoder.encode(content).buffer;
  }
  
  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: Object.fromEntries(this.headers),
    });
  }
};

global.Request = class Request {
  constructor(input, init = {}) {
    if (typeof input === 'string') {
      this.url = input;
      this.method = init.method || 'GET';
      this.headers = new Map(Object.entries(init.headers || {}));
      this.body = init.body || null;
    } else {
      this.url = input.url;
      this.method = init.method || input.method || 'GET';
      this.headers = new Map(Object.entries(init.headers || input.headers || {}));
      this.body = init.body || input.body || null;
    }
  }
  
  async json() {
    if (typeof this.body === 'string') {
      return JSON.parse(this.body);
    }
    return this.body;
  }
  
  clone() {
    return new Request(this.url, {
      method: this.method,
      headers: Object.fromEntries(this.headers),
      body: this.body,
    });
  }
};

// Create a reusable mock factory
const createLocalStorageMock = () => {
  const mock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  return mock;
};

// Mock fetch globally
global.fetch = jest.fn();

// Set up localStorage mock
global.localStorage = createLocalStorageMock();

// Mock sessionStorage
global.sessionStorage = createLocalStorageMock();

// Mock navigator.clipboard
global.navigator = global.navigator || {};
Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(),
  },
  writable: true,
});

// Set on window.navigator
global.window.navigator = global.navigator;

// Spy on navigator.clipboard.writeText
jest.spyOn(global.navigator.clipboard, 'writeText');

// Mock window.history
global.window.history = {
  pushState: jest.fn(),
  replaceState: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  go: jest.fn(),
};

// Mock window.location - use a mutable object that tests can modify
const mockLocation = {
  pathname: '/smartgrind/',
  search: '',
  href: 'http://localhost/smartgrind/',
  hash: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  protocol: 'http:',
  origin: 'http://localhost',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

// Try to delete the existing location property before redefining it
// This is necessary because window.location is read-only in jsdom
try {
  delete global.window.location;
} catch (e) {
  // If delete fails, the property is non-configurable
  // We'll use a different approach
}

// Try to define the property
try {
  Object.defineProperty(global.window, 'location', {
    value: mockLocation,
    writable: true,
    configurable: true,
  });
} catch (e) {
  // If that fails, try using a getter/setter approach
  try {
    Object.defineProperty(global.window, 'location', {
      get: () => mockLocation,
      set: (value) => {
        if (value && typeof value === 'object') {
          Object.assign(mockLocation, value);
        }
      },
      configurable: true,
    });
  } catch (e2) {
    // If all else fails, we can't mock location in this environment
    // Tests that need location mocking will need to handle this
    // Silently continue - tests will handle location mocking if needed
  }
}

// Mock window.open
global.window.open = jest.fn();



// Mock document.execCommand for clipboard fallback
global.document.execCommand = jest.fn(() => true);

// Spy on document.execCommand
jest.spyOn(global.document, 'execCommand');

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Mock all console methods to reduce noise
  log: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

// Mock crypto.subtle for JWT signing
const mockSign = jest.fn();
const mockImportKey = jest.fn();
const mockVerify = jest.fn();

global.crypto = global.crypto || {};
global.crypto.subtle = {
  importKey: mockImportKey,
  sign: mockSign,
  verify: mockVerify,
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock btoa and atob for base64 encoding - use actual implementations
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
global.atob = (str) => Buffer.from(str, 'base64').toString('binary');

// Mock WritableStream and ReadableStream for compression tests
class MockWritableStream {
  constructor(underlyingSink = {}) {
    this._sink = underlyingSink;
    this._locked = false;
    this._writer = null;
    this._chunks = [];
  }

  getWriter() {
    if (this._locked) {
      throw new TypeError('WritableStream is locked');
    }
    this._locked = true;
    const self = this;
    this._writer = {
      write: async (chunk) => {
        self._chunks.push(chunk);
        if (self._sink.write) {
          await self._sink.write(chunk);
        }
      },
      close: async () => {
        if (self._sink.close) {
          await self._sink.close();
        }
        self._locked = false;
        self._writer = null;
      },
      abort: async (reason) => {
        if (self._sink.abort) {
          await self._sink.abort(reason);
        }
        self._locked = false;
        self._writer = null;
      },
      releaseLock: () => {
        self._locked = false;
        self._writer = null;
      },
      _chunks: this._chunks,
    };
    return this._writer;
  }

  get locked() {
    return this._locked;
  }
}

class MockReadableStream {
  constructor(underlyingSource = {}) {
    this._source = underlyingSource;
    this._locked = false;
    this._reader = null;
    this._chunks = [];
    this._started = false;
    this._closed = false;
  }

  getReader() {
    if (this._locked) {
      throw new TypeError('ReadableStream is locked');
    }
    this._locked = true;
    
    // Start the source if not already started
    if (!this._started && this._source.start) {
      this._started = true;
      const controller = {
        enqueue: (chunk) => {
          this._chunks.push(chunk);
        },
        close: () => {
          this._closed = true;
        },
        error: (e) => {
          this._error = e;
        },
      };
      // Async start
      Promise.resolve().then(() => this._source.start(controller));
    }

    this._reader = {
      read: async () => {
        // Wait for chunks to be available
        while (this._chunks.length === 0 && !this._closed && !this._error) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        
        if (this._error) {
          throw this._error;
        }
        
        if (this._chunks.length > 0) {
          return { value: this._chunks.shift(), done: false };
        }
        
        return { value: undefined, done: true };
      },
      releaseLock: () => {
        this._locked = false;
        this._reader = null;
      },
      cancel: async () => {
        this._locked = false;
        this._reader = null;
      },
    };
    return this._reader;
  }

  get locked() {
    return this._locked;
  }
}

// Simple synchronous stream implementation for testing
class SimpleStream {
  constructor() {
    this._data = [];
    this._index = 0;
    this._closed = false;
  }
  
  write(data) {
    this._data.push(data);
  }
  
  close() {
    this._closed = true;
  }
  
  read() {
    if (this._index < this._data.length) {
      const data = this._data[this._index];
      this._index++;
      return { value: data, done: false };
    }
    if (this._closed) {
      return { value: undefined, done: true };
    }
    return { value: undefined, done: false };
  }
}

// Mock CompressionStream - simulates gzip by just passing through data (for testing)
global.CompressionStream = class MockCompressionStream {
  constructor(format) {
    const stream = new SimpleStream();
    let chunks = [];
    
    this.writable = {
      getWriter() {
        return {
          write(chunk) {
            chunks.push(chunk);
            return Promise.resolve();
          },
          close() {
            // Combine chunks and pass through directly (no compression)
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const combined = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
              combined.set(chunk, offset);
              offset += chunk.length;
            }
            stream.write(combined);
            stream.close();
            chunks = []; // Reset chunks
            return Promise.resolve();
          }
        };
      }
    };
    
    this.readable = {
      getReader() {
        return {
          read() {
            const result = stream.read();
            return Promise.resolve(result);
          }
        };
      }
    };
  }
};

// Mock DecompressionStream - simulates gunzip by passing through data (for testing)
global.DecompressionStream = class MockDecompressionStream {
  constructor(format) {
    const stream = new SimpleStream();
    let chunks = [];
    
    this.writable = {
      getWriter() {
        return {
          write(chunk) {
            chunks.push(chunk);
            return Promise.resolve();
          },
          close() {
            // Combine chunks and pass through directly (no decompression)
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const combined = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
              combined.set(chunk, offset);
              offset += chunk.length;
            }
            stream.write(combined);
            stream.close();
            chunks = []; // Reset chunks
            return Promise.resolve();
          }
        };
      }
    };
    
    this.readable = {
      getReader() {
        return {
          read() {
            const result = stream.read();
            return Promise.resolve(result);
          }
        };
      }
    };
  }
};

global.WritableStream = MockWritableStream;
global.ReadableStream = MockReadableStream;

// ============================================
// Service Worker API Mocks
// ============================================

// Mock Cache API
class MockCache {
  constructor() {
    this.store = new Map();
  }
  
  async match(request) {
    const url = typeof request === 'string' ? request : request.url;
    return this.store.get(url) || undefined;
  }
  
  async add(request) {
    const url = typeof request === 'string' ? request : request.url;
    this.store.set(url, new Response('cached'));
  }
  
  async addAll(requests) {
    for (const request of requests) {
      await this.add(request);
    }
  }
  
  async put(request, response) {
    const url = typeof request === 'string' ? request : request.url;
    this.store.set(url, response);
  }
  
  async delete(request) {
    const url = typeof request === 'string' ? request : request.url;
    return this.store.delete(url);
  }
  
  async keys() {
    return Array.from(this.store.keys()).map(url => new Request(url));
  }
}

// Global cache storage to persist across tests
const globalCacheStorage = new Map();

// Mock CacheStorage
class MockCacheStorage {
  constructor() {
    // Use global storage to persist across instances
    this.caches = globalCacheStorage;
  }
  
  async open(cacheName) {
    if (!this.caches.has(cacheName)) {
      this.caches.set(cacheName, new MockCache());
    }
    return this.caches.get(cacheName);
  }
  
  async match(request, options) {
    for (const [name, cache] of this.caches) {
      if (!options || !options.cacheName || options.cacheName === name) {
        const match = await cache.match(request);
        if (match) return match;
      }
    }
    return undefined;
  }
  
  async has(cacheName) {
    return this.caches.has(cacheName);
  }
  
  async delete(cacheName) {
    return this.caches.delete(cacheName);
  }
  
  async keys() {
    return Array.from(this.caches.keys());
  }
}

// Mock IndexedDB
class MockIDBRequest {
  constructor(result = null, error = null) {
    this.result = result;
    this.error = error;
    this.readyState = 'done';
    this.onsuccess = null;
    this.onerror = null;
    this.onupgradeneeded = null;
  }
  
  _triggerSuccess() {
    if (this.onsuccess) {
      this.onsuccess({ target: this });
    }
  }
  
  _triggerError() {
    if (this.onerror) {
      this.onerror({ target: this });
    }
  }
}

class MockIDBObjectStore {
  constructor(name) {
    this.name = name;
    this.data = new Map();
    this.indexes = new Map();
    this.keyPath = 'id';
    this.autoIncrement = false;
  }
  
  add(value, key) {
    const id = key || value[this.keyPath];
    if (this.data.has(id)) {
      const request = new MockIDBRequest(null, new Error('Key already exists'));
      setTimeout(() => request._triggerError(), 0);
      return request;
    }
    this.data.set(id, value);
    const request = new MockIDBRequest(id);
    setTimeout(() => request._triggerSuccess(), 0);
    return request;
  }
  
  put(value, key) {
    const id = key || value[this.keyPath];
    this.data.set(id, value);
    const request = new MockIDBRequest(id);
    setTimeout(() => request._triggerSuccess(), 0);
    return request;
  }
  
  get(key) {
    const request = new MockIDBRequest(this.data.get(key));
    setTimeout(() => request._triggerSuccess(), 0);
    return request;
  }
  
  getAll() {
    const request = new MockIDBRequest(Array.from(this.data.values()));
    setTimeout(() => request._triggerSuccess(), 0);
    return request;
  }
  
  delete(key) {
    this.data.delete(key);
    const request = new MockIDBRequest(undefined);
    setTimeout(() => request._triggerSuccess(), 0);
    return request;
  }
  
  clear() {
    this.data.clear();
    const request = new MockIDBRequest(undefined);
    setTimeout(() => request._triggerSuccess(), 0);
    return request;
  }
  
  openCursor() {
    const entries = Array.from(this.data.entries());
    let index = 0;
    
    const request = new MockIDBRequest();
    
    const cursor = {
      continue: () => {
        index++;
        if (index < entries.length) {
          request.result.value = entries[index][1];
          request.result.key = entries[index][0];
          request.result.continue = cursor.continue;
          if (request.onsuccess) request.onsuccess({ target: request });
        } else {
          request.result = null;
          if (request.onsuccess) request.onsuccess({ target: request });
        }
      },
      value: entries[0]?.[1],
      key: entries[0]?.[0],
    };
    
    request.result = cursor;
    setTimeout(() => {
      if (entries.length > 0 && request.onsuccess) {
        request.onsuccess({ target: request });
      } else if (request.onsuccess) {
        request.result = null;
        request.onsuccess({ target: request });
      }
    }, 0);
    
    return request;
  }
  
  createIndex(name, keyPath, options = {}) {
    const indexData = new Map();
    // Populate index data from store data
    for (const [id, value] of this.data) {
      const indexKey = value[keyPath];
      if (indexKey !== undefined) {
        if (!indexData.has(indexKey)) {
          indexData.set(indexKey, []);
        }
        indexData.get(indexKey).push(value);
      }
    }
    
    this.indexes.set(name, { keyPath, options, data: indexData });
    
    return {
      get: (key) => {
        const items = indexData.get(key) || [];
        const request = new MockIDBRequest(items[0]);
        setTimeout(() => request._triggerSuccess(), 0);
        return request;
      },
      getAll: (key) => {
        const items = key !== undefined ? (indexData.get(key) || []) : Array.from(this.data.values());
        const request = new MockIDBRequest(items);
        setTimeout(() => request._triggerSuccess(), 0);
        return request;
      },
      openCursor: () => this.openCursor(),
    };
  }
  
  index(name) {
    const indexDef = this.indexes.get(name);
    if (indexDef) {
      // Rebuild index data from current store data dynamically
      const rebuildIndexData = () => {
        const indexData = new Map();
        for (const [id, value] of this.data) {
          const indexKey = value[indexDef.keyPath];
          if (indexKey !== undefined) {
            if (!indexData.has(indexKey)) {
              indexData.set(indexKey, []);
            }
            indexData.get(indexKey).push(value);
          }
        }
        return indexData;
      };
      
      return {
        get: (key) => {
          const indexData = rebuildIndexData();
          const items = indexData.get(key) || [];
          const request = new MockIDBRequest(items[0]);
          setTimeout(() => request._triggerSuccess(), 0);
          return request;
        },
        getAll: (key) => {
          const indexData = rebuildIndexData();
          if (key !== undefined) {
            const items = indexData.get(key) || [];
            const request = new MockIDBRequest(items);
            setTimeout(() => request._triggerSuccess(), 0);
            return request;
          } else {
            // Return all values if no key specified
            const allValues = Array.from(this.data.values());
            const request = new MockIDBRequest(allValues);
            setTimeout(() => request._triggerSuccess(), 0);
            return request;
          }
        },
        openCursor: (range) => {
          const indexData = rebuildIndexData();
          const entries = Array.from(indexData.entries());
          let currentIndex = 0;
          
          const request = new MockIDBRequest();
          
          const advance = () => {
            if (currentIndex < entries.length) {
              const [key, values] = entries[currentIndex];
              request.result = {
                key,
                value: values[0],
                continue: () => {
                  currentIndex++;
                  advance();
                },
              };
              if (request.onsuccess) request.onsuccess({ target: request });
            } else {
              request.result = null;
              if (request.onsuccess) request.onsuccess({ target: request });
            }
          };
          
          setTimeout(advance, 0);
          return request;
        },
      };
    }
    
    // Return default index if not found
    return {
      get: () => {
        const request = new MockIDBRequest();
        setTimeout(() => request._triggerSuccess(), 0);
        return request;
      },
      getAll: (key) => {
        if (key === undefined) {
          const allValues = Array.from(this.data.values());
          const request = new MockIDBRequest(allValues);
          setTimeout(() => request._triggerSuccess(), 0);
          return request;
        }
        const request = new MockIDBRequest([]);
        setTimeout(() => request._triggerSuccess(), 0);
        return request;
      },
      openCursor: () => {
        const request = new MockIDBRequest();
        setTimeout(() => request._triggerSuccess(), 0);
        return request;
      },
    };
  }
}

class MockIDBTransaction {
  constructor(db, stores, mode = 'readonly') {
    this.objectStoreNames = Array.isArray(stores) ? stores : [stores];
    this.mode = mode;
    this.oncomplete = null;
    this.onerror = null;
    this.onabort = null;
    this._db = db;
    this._stores = new Map();
  }
  
  objectStore(name) {
    if (!this._stores.has(name)) {
      // Use the database's store to persist data
      const dbStore = this._db._stores.get(name);
      if (dbStore) {
        this._stores.set(name, dbStore);
      } else {
        // Create new store if it doesn't exist in DB
        const newStore = new MockIDBObjectStore(name);
        this._db._stores.set(name, newStore);
        this._stores.set(name, newStore);
      }
    }
    return this._stores.get(name);
  }
  
  _complete() {
    if (this.oncomplete) this.oncomplete();
  }
}

class MockIDBDatabase {
  constructor(name, version = 1) {
    this.name = name;
    this.version = version;
    this._storeNames = new Set();
    this._stores = new Map();
    
    // Create objectStoreNames with contains method
    this.objectStoreNames = {
      contains: (name) => this._storeNames.has(name),
      item: (index) => Array.from(this._storeNames)[index],
      get length() { return this._storeNames.size; },
      [Symbol.iterator]: function* () {
        yield* Array.from(this._storeNames);
      }
    };
  }
  
  createObjectStore(name, options = {}) {
    const store = new MockIDBObjectStore(name);
    store.keyPath = options.keyPath || 'id';
    store.autoIncrement = options.autoIncrement || false;
    this._stores.set(name, store);
    this._storeNames.add(name);
    return store;
  }
  
  deleteObjectStore(name) {
    this._stores.delete(name);
    this._storeNames.delete(name);
  }
  
  transaction(stores, mode = 'readonly') {
    const tx = new MockIDBTransaction(this, stores, mode);
    // Auto-complete transaction after a tick
    setTimeout(() => tx._complete(), 0);
    return tx;
  }
  
  close() {}
}

// Global database storage to persist across tests
const globalDatabaseStorage = new Map();

class MockIDBFactory {
  constructor() {
    // Use global storage to persist across instances
    this._databases = globalDatabaseStorage;
  }
  
  open(name, version) {
    const request = new MockIDBRequest();
    
    setTimeout(() => {
      let db = this._databases.get(name);
      let upgradeNeeded = false;
      
      if (!db) {
        db = new MockIDBDatabase(name, version || 1);
        this._databases.set(name, db);
        upgradeNeeded = true;
      } else if (version && version > db.version) {
        db.version = version;
        upgradeNeeded = true;
      }
      
      request.result = db;
      
      if (upgradeNeeded && request.onupgradeneeded) {
        request.onupgradeneeded({ target: request });
      }
      
      if (request.onsuccess) {
        request.onsuccess({ target: request });
      }
    }, 0);
    
    return request;
  }
  
  deleteDatabase(name) {
    this._databases.delete(name);
    const request = new MockIDBRequest();
    setTimeout(() => request._triggerSuccess(), 0);
    return request;
  }
  
  // Helper method to clear all databases (for testing)
  _clearAll() {
    this._databases.clear();
  }
}

// Mock IDBKeyRange for range queries
global.IDBKeyRange = {
  only: (value) => ({ lower: value, upper: value, lowerOpen: false, upperOpen: false, includes: (v) => v === value }),
  lowerBound: (lower, open = false) => ({ lower, upper: null, lowerOpen: open, upperOpen: false, includes: (v) => open ? v > lower : v >= lower }),
  upperBound: (upper, open = false) => ({ lower: null, upper, lowerOpen: false, upperOpen: open, includes: (v) => open ? v < upper : v <= upper }),
  bound: (lower, upper, lowerOpen = false, upperOpen = false) => ({ 
    lower, 
    upper, 
    lowerOpen, 
    upperOpen, 
    includes: (v) => {
      const aboveLower = lowerOpen ? v > lower : v >= lower;
      const belowUpper = upperOpen ? v < upper : v <= upper;
      return aboveLower && belowUpper;
    }
  }),
};

// Mock Service Worker Global Scope
class MockServiceWorkerGlobalScope {
  constructor() {
    this.caches = new MockCacheStorage();
    this.clients = {
      matchAll: jest.fn().mockResolvedValue([]),
      claim: jest.fn().mockResolvedValue(undefined),
      get: jest.fn().mockResolvedValue(null),
    };
    this.registration = {
      sync: {
        register: jest.fn().mockResolvedValue(undefined),
        getTags: jest.fn().mockResolvedValue([]),
      },
      pushManager: {
        subscribe: jest.fn().mockResolvedValue({}),
        getSubscription: jest.fn().mockResolvedValue(null),
      },
      update: jest.fn().mockResolvedValue(undefined),
      unregister: jest.fn().mockResolvedValue(true),
      scope: '/smartgrind/',
    };
    this.skipWaiting = jest.fn().mockResolvedValue(undefined);
    this.addEventListener = jest.fn();
    this.removeEventListener = jest.fn();
    this.dispatchEvent = jest.fn();
  }
}

// Mock FetchEvent
class MockFetchEvent {
  constructor(request) {
    this.request = request;
    this.respondWith = jest.fn();
    this.waitUntil = jest.fn();
    this.clientId = 'test-client-id';
    this.resultingClientId = 'test-resulting-client-id';
    this.replacesClientId = '';
    this.preloadResponse = Promise.resolve(undefined);
  }
}

// Mock SyncEvent
class MockSyncEvent {
  constructor(tag) {
    this.tag = tag;
    this.lastChance = false;
    this.waitUntil = jest.fn();
  }
}

// Mock ExtendableEvent
class MockExtendableEvent {
  constructor(type) {
    this.type = type;
    this.waitUntil = jest.fn();
  }
}

// Mock MessageEvent for SW
class MockExtendableMessageEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.data = init.data;
    this.source = init.source || null;
    this.origin = init.origin || 'http://localhost';
    this.waitUntil = jest.fn();
  }
}

// Mock Notification
class MockNotification {
  constructor(title, options = {}) {
    this.title = title;
    this.body = options.body || '';
    this.icon = options.icon || '';
    this.tag = options.tag || '';
    this.data = options.data || {};
    this.requireInteraction = options.requireInteraction || false;
    this.silent = options.silent || false;
    this.timestamp = Date.now();
    this.close = jest.fn();
  }
  
  static requestPermission() {
    return Promise.resolve('granted');
  }
  
  static get permission() {
    return 'granted';
  }
}

// Mock PushEvent
class MockPushEvent {
  constructor(data) {
    this.data = {
      json: () => JSON.parse(data),
      text: () => data,
      arrayBuffer: () => new TextEncoder().encode(data),
      blob: () => new Blob([data]),
    };
    this.waitUntil = jest.fn();
  }
}

// Mock PushSubscription
class MockPushSubscription {
  constructor() {
    this.endpoint = 'https://fcm.googleapis.com/fcm/send/test-endpoint';
    this.expirationTime = null;
    this.options = {
      userVisibleOnly: true,
      applicationServerKey: null,
    };
    this.getKey = jest.fn(() => new ArrayBuffer(16));
    this.toJSON = jest.fn(() => ({
      endpoint: this.endpoint,
      expirationTime: this.expirationTime,
      keys: {},
    }));
    this.unsubscribe = jest.fn().mockResolvedValue(true);
  }
}

// Set up global Service Worker APIs
global.caches = new MockCacheStorage();
global.indexedDB = new MockIDBFactory();

// Mock ServiceWorkerRegistration on navigator
Object.defineProperty(global.navigator, 'serviceWorker', {
  value: {
    register: jest.fn().mockResolvedValue({
      scope: '/smartgrind/',
      active: null,
      installing: null,
      waiting: null,
      update: jest.fn().mockResolvedValue(undefined),
      unregister: jest.fn().mockResolvedValue(true),
      sync: {
        register: jest.fn().mockResolvedValue(undefined),
        getTags: jest.fn().mockResolvedValue([]),
      },
      pushManager: {
        subscribe: jest.fn().mockResolvedValue(new MockPushSubscription()),
        getSubscription: jest.fn().mockResolvedValue(null),
      },
    }),
    ready: Promise.resolve({
      scope: '/smartgrind/',
      postMessage: jest.fn(),
    }),
    controller: null,
    getRegistration: jest.fn().mockResolvedValue(null),
    getRegistrations: jest.fn().mockResolvedValue([]),
    startMessages: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  writable: true,
  configurable: true,
});

// Mock Notification API
global.Notification = MockNotification;

// Export mock classes for use in tests
global.MockCache = MockCache;
global.MockCacheStorage = MockCacheStorage;
global.MockIDBFactory = MockIDBFactory;
global.MockIDBDatabase = MockIDBDatabase;
global.MockIDBObjectStore = MockIDBObjectStore;
global.MockIDBTransaction = MockIDBTransaction;
global.MockIDBRequest = MockIDBRequest;
global.MockServiceWorkerGlobalScope = MockServiceWorkerGlobalScope;
global.MockFetchEvent = MockFetchEvent;
global.MockSyncEvent = MockSyncEvent;
global.MockExtendableEvent = MockExtendableEvent;
global.MockExtendableMessageEvent = MockExtendableMessageEvent;
global.MockPushEvent = MockPushEvent;
global.MockPushSubscription = MockPushSubscription;

// Mock DOMPurify - simulates sanitization behavior for testing
jest.mock('dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: (html, options = {}) => {
      // Default allowed tags if not specified
      const allowedTags = options.ALLOWED_TAGS || [];
      
      // If no restrictions, pass through (for backward compatibility)
      if (allowedTags.length === 0) {
        return html;
      }
      
      // Simple mock sanitization: remove tags not in the allowed list
      // This is a simplified version for testing - real DOMPurify is more comprehensive
      
      // Remove script tags entirely (including content)
      let result = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      
      // Remove style tags entirely (including content)
      result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
      
      // For non-allowed tags, remove the tag but keep content
      // Build a regex to match any tag not in the allowed list
      const allTags = ['script', 'style', 'a', 'div', 'span', 'p', 'img', 'iframe', 'form', 'input', 'button', 'object', 'embed', 'svg', 'math', 'table', 'tr', 'td', 'th', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'b', 'i', 'u', 'br', 'strong', 'em'];
      const tagsToRemove = allTags.filter(tag => !allowedTags.includes(tag));
      
      for (const tag of tagsToRemove) {
        // Self-closing tags
        result = result.replace(new RegExp(`<${tag}[^>]*\\s*\\/>`, 'gi'), '');
        // Opening and closing tags - keep content
        result = result.replace(new RegExp(`<${tag}[^>]*>`, 'gi'), '');
        result = result.replace(new RegExp(`<\\/${tag}>`, 'gi'), '');
      }
      
      // Remove javascript: URLs
      result = result.replace(/javascript:/gi, '');
      
      // Remove on* event handlers
      result = result.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
      
      return result;
    },
  },
}));

// Clear storage before each test
beforeEach(() => {
  globalDatabaseStorage.clear();
  globalCacheStorage.clear();
});
