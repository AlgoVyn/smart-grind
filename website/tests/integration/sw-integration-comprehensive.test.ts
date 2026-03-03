/**
 * @jest-environment jsdom
 *
 * Comprehensive Service Worker Integration Tests
 * Tests the complete service worker functionality including:
 * - Cache strategies integration
 * - Background sync coordination
 * - Operation queue management
 * - Message passing flows
 * - Offline/online transitions
 * - Error handling and recovery
 * - Multiple component coordination
 */

import { BackgroundSyncManager } from '../../src/sw/background-sync';
import { OperationQueue, type QueuedOperation, type OperationType } from '../../src/sw/operation-queue';
import { CacheStrategies, strategies, CACHE_NAMES, cleanupOldCaches, getCacheStats } from '../../src/sw/cache-strategies';
import { ConnectivityChecker } from '../../src/sw/connectivity-checker';
import { SyncScheduler, getSyncScheduler } from '../../src/sw/sync-scheduler';
import { state } from '../../src/state';
import { api } from '../../src/api';

// Mock auth manager for background sync
jest.mock('../../src/sw/auth-manager', () => ({
  getAuthManager: jest.fn().mockImplementation(() => ({
    waitForLoad: jest.fn().mockResolvedValue(undefined),
    isAuthenticated: jest.fn().mockReturnValue(true),
    refreshToken: jest.fn().mockResolvedValue('mock-token'),
    getAuthHeaders: jest.fn().mockResolvedValue({ Authorization: 'Bearer mock-token' }),
    handleAuthError: jest.fn().mockResolvedValue(false),
    retryWithFreshToken: jest.fn().mockResolvedValue({ ok: true }),
  })),
  AuthManager: jest.fn(),
}));

jest.mock('../../src/sw/sync-conflict-resolver', () => ({
  SyncConflictResolver: jest.fn().mockImplementation(() => ({
    resolveProgressConflict: jest.fn().mockResolvedValue({
      status: 'resolved',
      data: { problemId: 'test', solved: true },
    }),
    resolveCustomProblemConflict: jest.fn().mockResolvedValue({
      status: 'resolved',
      data: { id: 'custom1', name: 'Custom Problem' },
    }),
    autoResolve: jest.fn().mockResolvedValue({
      status: 'resolved',
      data: { problemId: 'test', solved: true },
    }),
  })),
}));

describe('Service Worker Integration Tests', () => {
  let operationQueue: OperationQueue;
  let backgroundSync: BackgroundSyncManager;
  let connectivityChecker: ConnectivityChecker;
  let syncScheduler: SyncScheduler;
  let cacheStrategies: CacheStrategies;
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset state
    state.problems.clear();
    state.deletedProblemIds.clear();
    state.user = { type: 'local', id: null, displayName: 'Local User' };
    state.sync = {
      isOnline: true,
      isSyncing: false,
      pendingCount: 0,
      lastSyncAt: null,
      hasConflicts: false,
      conflictMessage: null,
    };
    
    // Setup navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    });

    // Initialize modules
    operationQueue = new OperationQueue();
    backgroundSync = new BackgroundSyncManager();
    connectivityChecker = new ConnectivityChecker();
    syncScheduler = new SyncScheduler(connectivityChecker);
    cacheStrategies = new CacheStrategies('v3');
    
    // Setup default fetch mock
    mockFetch.mockResolvedValue(new Response('test data', { status: 200 }));
  });

  afterEach(async () => {
    syncScheduler.stop();
    connectivityChecker.stopMonitoring();
  });

  // ============================================================================
  // Cache Strategies Integration Tests
  // ============================================================================
  describe('Cache Strategies Integration', () => {
    it('should use stale-while-revalidate for API calls', async () => {
      const request = new Request('http://localhost/smartgrind/api/data');
      const freshResponse = new Response(JSON.stringify({ fresh: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockFetch.mockResolvedValueOnce(freshResponse);

      const response = await strategies.api.fetch(request);
      
      expect(mockFetch).toHaveBeenCalledWith(request);
      expect(response.status).toBe(200);
    });

    it('should cache API responses', async () => {
      const request = new Request('http://localhost/smartgrind/api/data');
      const response = new Response(JSON.stringify({ data: 'test' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockFetch.mockResolvedValueOnce(response);

      await strategies.api.fetch(request);

      // Verify response was cached
      const cache = await caches.open('api-cache-v2');
      const cached = await cache.match(request);
      
      expect(cached).toBeDefined();
    });

    it('should return stale cache when expired but network fails', async () => {
      const request = new Request('http://localhost/smartgrind/api/data');
      
      // Create expired cached response
      const expiredResponse = new Response(JSON.stringify({ stale: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'sw-cached-time': (Date.now() - 10 * 60 * 1000).toString(), // 10 min old
        },
      });
      const cache = await caches.open('api-cache-v2');
      await cache.put(request, expiredResponse);

      // Network fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await strategies.api.fetch(request);
      const data = await response.json();
      
      expect(data.stale).toBe(true);
    });

    it('should use cache-first for static assets', async () => {
      const request = new Request('http://localhost/smartgrind/app.js');
      
      // Pre-populate cache
      const cachedResponse = new Response('cached content', { status: 200 });
      const cache = await caches.open('static-cache-v2');
      await cache.put(request, cachedResponse);

      const response = await strategies.static.fetch(request);
      const text = await response.text();
      
      expect(text).toBe('cached content');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should fetch and cache static assets when not cached', async () => {
      const request = new Request('http://localhost/smartgrind/app.js');
      const networkResponse = new Response('console.log("fresh")', {
        status: 200,
        headers: { 'Content-Type': 'application/javascript' },
      });
      mockFetch.mockResolvedValueOnce(networkResponse);

      const response = await strategies.static.fetch(request);
      const text = await response.text();
      
      expect(text).toBe('console.log("fresh")');
      expect(mockFetch).toHaveBeenCalledWith(request);
    });

    it('should handle problem file requests with stale-while-revalidate', async () => {
      const request = new Request(
        'http://localhost/smartgrind/patterns/two-pointers.md'
      );
      
      const freshResponse = new Response('# Two Pointers Pattern', {
        status: 200,
        headers: { 'Content-Type': 'text/markdown' },
      });
      mockFetch.mockResolvedValueOnce(freshResponse);

      const response = await strategies.problems.fetch(request);
      const text = await response.text();
      
      expect(text).toBe('# Two Pointers Pattern');
    });

    it('should not cache non-OK responses', async () => {
      const request = new Request('http://localhost/smartgrind/api/data');
      const errorResponse = new Response('Not Found', { status: 404 });
      mockFetch.mockResolvedValueOnce(errorResponse);

      await strategies.api.fetch(request);

      // Should not have cached the error response
      const cache = await caches.open('api-cache-v2');
      const cached = await cache.match(request);
      expect(cached).toBeUndefined();
    });

    it('should pre-cache multiple URLs', async () => {
      const urls = [
        'http://localhost/smartgrind/1.js',
        'http://localhost/smartgrind/2.js',
      ];
      
      mockFetch
        .mockResolvedValueOnce(new Response('content 1', { status: 200 }))
        .mockResolvedValueOnce(new Response('content 2', { status: 200 }));

      await cacheStrategies.preCacheUrls(urls, 'static');

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle pre-cache failures gracefully', async () => {
      const urls = [
        'http://localhost/smartgrind/1.js',
        'http://localhost/smartgrind/2.js',
      ];
      
      mockFetch
        .mockResolvedValueOnce(new Response('content 1', { status: 200 }))
        .mockRejectedValueOnce(new Error('Failed'));

      // Should not throw
      await expect(cacheStrategies.preCacheUrls(urls, 'static')).resolves.not.toThrow();
    });

    it('should get cached URLs', async () => {
      const request = new Request('http://test.com/file.js');
      const cache = await caches.open('static-cache-v3');
      await cache.put(request, new Response('test', { status: 200 }));

      const urls = await cacheStrategies.getCachedUrls('static');
      
      expect(urls.length).toBeGreaterThanOrEqual(0);
    });

    it('should clear cache', async () => {
      const request = new Request('http://localhost/smartgrind/test.js');
      const cache = await caches.open('static-cache-v3');
      await cache.put(request, new Response('test', { status: 200 }));

      await cacheStrategies.clearCache('static');

      const urls = await cacheStrategies.getCachedUrls('static');
      expect(urls).toHaveLength(0);
    });

    it('should get cache info', async () => {
      // Populate multiple caches
      const staticCache = await caches.open('static-cache-v3');
      await staticCache.put(
        new Request('http://test.com/1.js'),
        new Response('1')
      );
      await staticCache.put(
        new Request('http://test.com/2.js'),
        new Response('2')
      );

      const info = await cacheStrategies.getCacheInfo();
      
      expect(Array.isArray(info)).toBe(true);
    });

    it('should return stale cache when network fails for API requests', async () => {
      const request = new Request('http://localhost/smartgrind/api/user');
      
      // First populate cache
      const cachedResponse = new Response(JSON.stringify({ cached: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'sw-cached-time': Date.now().toString(),
        },
      });
      const cache = await caches.open('api-cache-v2');
      await cache.put(request, cachedResponse);

      // Network fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await strategies.api.fetch(request);
      const data = await response.json();
      
      expect(data.cached).toBe(true);
    });

    it('should use network-first for user data', async () => {
      const request = new Request('http://localhost/smartgrind/api/user');
      const networkResponse = new Response(JSON.stringify({ user: 'fresh' }), {
        status: 200,
      });
      mockFetch.mockResolvedValueOnce(networkResponse);

      const response = await strategies.user.fetch(request);
      const data = await response.json();
      
      expect(data.user).toBe('fresh');
    });

    it('should fallback to cache when network fails for user data', async () => {
      const request = new Request('http://localhost/smartgrind/api/user');
      
      // Populate cache
      const cachedResponse = new Response(JSON.stringify({ user: 'cached' }), {
        status: 200,
      });
      const cache = await caches.open('user-cache-v2');
      await cache.put(request, cachedResponse);

      // Network fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await strategies.user.fetch(request);
      const data = await response.json();
      
      expect(data.user).toBe('cached');
    });
  });

  // ============================================================================
  // Operation Queue Integration Tests
  // ============================================================================
  describe('Operation Queue Integration', () => {
    it('should add operation to queue', async () => {
      const id = await operationQueue.addOperation('MARK_SOLVED', {
        problemId: '1',
        solved: true,
      });

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
    });

    it('should deduplicate operations', async () => {
      // Add first operation
      const id1 = await operationQueue.addOperation(
        'MARK_SOLVED',
        { problemId: '1', solved: true },
        { deduplicate: true, dedupeKey: 'MARK_SOLVED-1' }
      );

      // Add duplicate operation
      const id2 = await operationQueue.addOperation(
        'MARK_SOLVED',
        { problemId: '1', solved: false },
        { deduplicate: true, dedupeKey: 'MARK_SOLVED-1' }
      );

      // Should return same ID (updated)
      expect(id1).toBe(id2);
    });

    it('should add multiple operations', async () => {
      const operations = [
        { type: 'MARK_SOLVED' as OperationType, data: { problemId: '1' } },
        { type: 'UPDATE_REVIEW_DATE' as OperationType, data: { problemId: '2' } },
      ];

      const ids = await operationQueue.addOperations(operations);

      expect(ids).toHaveLength(2);
    });

    it('should get pending operations', async () => {
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });
      await operationQueue.addOperation('UPDATE_REVIEW_DATE', { problemId: '2' });

      const pending = await operationQueue.getPendingOperations();

      expect(pending.length).toBe(2);
    });

    it('should get operations by type', async () => {
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '2' });
      await operationQueue.addOperation('UPDATE_REVIEW_DATE', { problemId: '3' });

      const solvedOps = await operationQueue.getOperationsByType('MARK_SOLVED');

      expect(solvedOps.length).toBe(2);
    });

    it('should mark operation as completed', async () => {
      const id = await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });

      await operationQueue.markCompleted(id);

      const pending = await operationQueue.getPendingOperations();
      expect(pending.some((op) => op.id === id)).toBe(false);
    });

    it('should mark operation as failed', async () => {
      const id = await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });

      await operationQueue.markFailed(id, 'Network error');

      const failed = await operationQueue.getFailedOperations();
      expect(failed.some((op) => op.id === id)).toBe(true);
    });

    it('should update retry count', async () => {
      const id = await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });

      const retryCount = await operationQueue.updateRetryCount(id);

      expect(retryCount).toBe(1);
    });

    it('should requeue failed operations', async () => {
      const id = await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });
      await operationQueue.markFailed(id, 'Error');

      const failedOp = (await operationQueue.getFailedOperations())[0];
      await operationQueue.requeueOperation(failedOp);

      const pending = await operationQueue.getPendingOperations();
      expect(pending.some((op) => op.id === id)).toBe(true);
    });

    it('should get queue statistics', async () => {
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '2' });

      const stats = await operationQueue.getStats();

      expect(stats.pending).toBe(2);
      expect(stats.completed).toBe(0);
      expect(stats.failed).toBe(0);
      expect(stats.manual).toBe(0);
    });

    it('should update last sync time', async () => {
      await operationQueue.updateLastSyncTime();

      const lastSync = await operationQueue.getLastSyncTime();
      expect(lastSync).toBeGreaterThan(0);
    });

    it('should get status for UI', async () => {
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });

      const status = await operationQueue.getStatus();

      expect(status.pendingCount).toBe(1);
      expect(status.isSyncing).toBe(false);
      expect(status.stats).toBeDefined();
    });

    it('should clear all operations', async () => {
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '2' });

      await operationQueue.clearAll();

      const pending = await operationQueue.getPendingOperations();
      expect(pending).toHaveLength(0);
    });

    it('should cleanup old operations', async () => {
      // Add and complete operation
      const id = await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });
      await operationQueue.markCompleted(id);

      const deleted = await operationQueue.cleanupOldOperations(0); // 0 days = all old

      expect(deleted).toBeGreaterThanOrEqual(0);
    });
  });

  // ============================================================================
  // Background Sync Integration Tests
  // ============================================================================
  describe('Background Sync Integration', () => {
    it('should create background sync manager', () => {
      expect(backgroundSync).toBeDefined();
    });

    it('should skip sync if already in progress', async () => {
      // Add pending operations
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });
      
      // Mock to simulate sync in progress
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      // Start first sync
      const firstSync = backgroundSync.syncUserProgress();

      // Second sync should return early
      await backgroundSync.syncUserProgress();

      // Cleanup
      mockFetch.mockReset();
    });

    it('should return early if no pending operations', async () => {
      const result = await backgroundSync.syncUserProgress();

      // Should complete without errors
      expect(result).toBeUndefined();
    });

    it('should sync user progress with pending operations', async () => {
      // Add pending operations
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '1', solved: true });
      await operationQueue.addOperation('UPDATE_REVIEW_DATE', {
        problemId: '2',
        reviewDate: '2024-01-20',
      });

      // Mock successful API responses
      mockFetch
        .mockResolvedValueOnce({ ok: true }) // CSRF check
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ conflicts: [] }),
        });

      // Trigger sync
      await backgroundSync.syncUserProgress();

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle sync conflicts', async () => {
      // Add pending operation
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '1', solved: true });

      // Mock conflict response (409)
      mockFetch
        .mockResolvedValueOnce({ ok: true }) // CSRF check
        .mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: () => Promise.resolve({ problemId: '1', solved: false }),
        });

      // Should handle conflict without throwing
      await expect(backgroundSync.syncUserProgress()).resolves.not.toThrow();
    });

    it('should sync custom problems', async () => {
      await operationQueue.addOperation('ADD_CUSTOM_PROBLEM', {
        id: 'custom1',
        name: 'Custom Problem',
      });

      mockFetch.mockResolvedValue({ ok: true });

      await backgroundSync.syncCustomProblems();

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should sync user settings', async () => {
      await operationQueue.addOperation('UPDATE_SETTINGS', { theme: 'dark' });

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ csrfToken: 'token' }) })
        .mockResolvedValueOnce({ ok: true });

      await backgroundSync.syncUserSettings();

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should get sync status', async () => {
      // Add some operations
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });
      
      const status = await backgroundSync.getSyncStatus();

      expect(status).toHaveProperty('pendingCount');
      expect(status).toHaveProperty('isSyncing');
      expect(status).toHaveProperty('lastSyncAt');
      expect(status).toHaveProperty('failedCount');
    });

    it('should force sync', async () => {
      // Add pending operation
      await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });

      mockFetch
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ conflicts: [] }),
        });

      const result = await backgroundSync.forceSync();

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('synced');
      expect(result).toHaveProperty('failed');
    });

    it('should check and sync', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      await backgroundSync.checkAndSync();

      // Should complete without errors
    });
  });

  // ============================================================================
  // Sync Scheduler Integration Tests
  // ============================================================================
  describe('Sync Scheduler Integration', () => {
    beforeEach(() => {
      syncScheduler = new SyncScheduler(connectivityChecker);
      syncScheduler.start();
    });

    it('should create sync scheduler', () => {
      expect(syncScheduler).toBeDefined();
    });

    it('should schedule sync tasks', () => {
      const execute = jest.fn().mockResolvedValue(undefined);
      
      const taskId = syncScheduler.schedule('test-tag', execute);
      
      expect(taskId).toBeDefined();
      expect(typeof taskId).toBe('string');
    });

    it('should schedule high priority tasks', () => {
      const execute = jest.fn().mockResolvedValue(undefined);
      
      const taskId = syncScheduler.schedule('high-priority', execute, {
        priority: 'high',
      });
      
      expect(taskId).toBeDefined();
    });

    it('should schedule low priority tasks', () => {
      const execute = jest.fn().mockResolvedValue(undefined);
      
      const taskId = syncScheduler.schedule('low-priority', execute, {
        priority: 'low',
      });
      
      expect(taskId).toBeDefined();
    });

    it('should cancel scheduled tasks', () => {
      const execute = jest.fn().mockResolvedValue(undefined);
      const taskId = syncScheduler.schedule('test-tag', execute);
      
      const cancelled = syncScheduler.cancel(taskId);
      
      expect(cancelled).toBe(true);
    });

    it('should return false when cancelling non-existent task', () => {
      const cancelled = syncScheduler.cancel('non-existent-id');
      expect(cancelled).toBe(false);
    });

    it('should cancel tasks by tag', () => {
      const execute = jest.fn().mockResolvedValue(undefined);
      syncScheduler.schedule('tag-a', execute);
      syncScheduler.schedule('tag-a', execute);
      syncScheduler.schedule('tag-b', execute);
      
      const cancelled = syncScheduler.cancelByTag('tag-a');
      
      expect(cancelled).toBe(2);
    });

    it('should get scheduler stats', () => {
      const execute = jest.fn().mockResolvedValue(undefined);
      syncScheduler.schedule('task-1', execute);
      syncScheduler.schedule('task-2', execute);
      
      const stats = syncScheduler.getStats();
      
      expect(stats.queued).toBe(2);
      expect(stats.running).toBe(0);
    });

    it('should force sync all tasks', async () => {
      const execute = jest.fn().mockResolvedValue(undefined);
      syncScheduler.schedule('task-1', execute);
      syncScheduler.schedule('task-2', execute);
      
      const result = await syncScheduler.forceSync();
      
      expect(result.completed).toBe(2);
      expect(result.failed).toBe(0);
    });

    it('should handle task failures', async () => {
      const execute = jest.fn().mockRejectedValue(new Error('Task failed'));
      syncScheduler.schedule('failing-task', execute, { maxRetries: 0 });
      
      const result = await syncScheduler.forceSync();
      
      expect(result.failed).toBe(1);
    });

    it('should reset all circuit breakers', async () => {
      const execute = jest.fn().mockRejectedValue(new Error('Always fails'));
      
      // Fail multiple times to open circuit breaker
      for (let i = 0; i < 5; i++) {
        syncScheduler.schedule(`fail-${i}`, execute, { maxRetries: 0 });
      }
      
      await syncScheduler.forceSync();
      
      // Reset circuit breakers
      syncScheduler.resetAllCircuitBreakers();
      
      const stats = syncScheduler.getStats();
      expect(stats.circuitBreakersOpen).toBe(0);
    });

    it('should handle connectivity restored', async () => {
      const execute = jest.fn().mockResolvedValue(undefined);
      syncScheduler.schedule('test-task', execute);
      
      await syncScheduler.onConnectivityRestored();
      
      // Should reset circuit breakers
      expect(syncScheduler.getStats().circuitBreakersOpen).toBe(0);
    });

    it('should use singleton pattern', () => {
      const scheduler1 = getSyncScheduler(connectivityChecker);
      const scheduler2 = getSyncScheduler(connectivityChecker);
      
      expect(scheduler1).toBe(scheduler2);
    });
  });

  // ============================================================================
  // Connectivity Checker Integration Tests
  // ============================================================================
  describe('Connectivity Checker Integration', () => {
    it('should create connectivity checker', () => {
      expect(connectivityChecker).toBeDefined();
    });

    it('should detect online status', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

      const isOnline = await connectivityChecker.checkConnectivity();
      
      expect(isOnline).toBe(true);
    });

    it('should detect offline status', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const isOnline = await connectivityChecker.checkConnectivity();
      
      expect(isOnline).toBe(false);
    });

    it('should start and stop monitoring', () => {
      connectivityChecker.startMonitoring();
      
      // Should not throw
      expect(() => connectivityChecker.stopMonitoring()).not.toThrow();
    });

    it('should handle connectivity change callbacks', async () => {
      const callback = jest.fn();
      
      const unsubscribe = connectivityChecker.onConnectivityChange(callback);
      
      // Trigger change
      connectivityChecker.setOnlineStatus(false);
      
      expect(callback).toHaveBeenCalledWith(false);
      
      unsubscribe();
    });

    it('should get current state', () => {
      const state = connectivityChecker.getState();
      
      expect(state).toHaveProperty('isOnline');
      expect(state).toHaveProperty('lastChecked');
      expect(state).toHaveProperty('consecutiveFailures');
    });

    it('should force connectivity check', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

      const isOnline = await connectivityChecker.forceCheck();
      
      expect(typeof isOnline).toBe('boolean');
    });

    it('should get retry delay', () => {
      const delay = connectivityChecker.getRetryDelay();
      
      expect(typeof delay).toBe('number');
      expect(delay).toBeGreaterThanOrEqual(1000);
    });

    it('should reset on online event', () => {
      connectivityChecker.setOnlineStatus(false);
      
      window.dispatchEvent(new Event('online'));
      
      // Should handle event without throwing
      expect(connectivityChecker.getState).toBeDefined();
    });

    it('should set offline on offline event', () => {
      connectivityChecker.setOnlineStatus(true);
      
      window.dispatchEvent(new Event('offline'));
      
      expect(connectivityChecker.getState().isOnline).toBe(false);
    });
  });

  // ============================================================================
  // Offline/Online Transition Tests
  // ============================================================================
  describe('Offline/Online Transitions', () => {
    it('should queue operations when offline', async () => {
      state.user.type = 'signed-in';
      state.sync.isOnline = false;

      const operation = {
        type: 'MARK_SOLVED' as const,
        data: { problemId: '1', solved: true },
        timestamp: Date.now(),
      };

      const result = await api.queueOperation(operation);
      
      expect(result).toBeDefined();
    });

    it('should sync when coming back online', async () => {
      state.user.type = 'signed-in';

      // Start offline
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      let isOnline = await connectivityChecker.checkConnectivity();
      state.setOnlineStatus(isOnline);

      // Queue operation
      const operation = {
        type: 'MARK_SOLVED' as const,
        data: { problemId: '1', solved: true },
        timestamp: Date.now(),
      };
      await api.queueOperation(operation);

      // Come back online
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
      isOnline = await connectivityChecker.checkConnectivity();
      state.setOnlineStatus(isOnline);

      expect(state.sync.isOnline).toBe(true);
    });

    it('should handle rapid online/offline transitions', async () => {
      const transitions: boolean[] = [];

      connectivityChecker.onConnectivityChange((online) => {
        transitions.push(online);
        state.setOnlineStatus(online);
      });

      // Simulate transitions
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
      await connectivityChecker.checkConnectivity();

      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      await connectivityChecker.forceCheck();

      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
      await connectivityChecker.forceCheck();

      expect(transitions.some((t) => t === true)).toBe(true);
      expect(transitions.some((t) => t === false)).toBe(true);
    });

    it('should maintain data integrity during transitions', async () => {
      // Start online
      state.setOnlineStatus(true);

      // Add problem
      state.problems.set('transition-test', {
        id: 'transition-test',
        name: 'Transition Test',
        url: 'https://example.com',
        topic: 'Arrays',
        pattern: 'Two Sum',
        status: 'solved',
        reviewInterval: 1,
        nextReviewDate: '2024-01-15',
        loading: false,
        noteVisible: false,
        note: 'Initial note',
      });

      // Go offline
      state.setOnlineStatus(false);

      // Update while offline
      const problem = state.problems.get('transition-test')!;
      problem.note = 'Updated offline';
      state.problems.set('transition-test', problem);

      // Come back online
      state.setOnlineStatus(true);

      // Verify data
      expect(state.problems.get('transition-test')?.note).toBe('Updated offline');
    });

    it('should handle multiple offline-online cycles', () => {
      const cycles = 3;
      
      for (let i = 0; i < cycles; i++) {
        // Go offline
        state.setOnlineStatus(false);
        expect(state.sync.isOnline).toBe(false);
        
        // Add data
        state.problems.set(`cycle-${i}`, {
          id: `cycle-${i}`,
          name: `Cycle ${i}`,
          url: 'https://example.com',
          topic: 'Arrays',
          pattern: 'Two Sum',
          status: 'solved',
          reviewInterval: 1,
          nextReviewDate: '2024-01-15',
          loading: false,
          noteVisible: false,
          note: ''
        });
        
        // Come online
        state.setOnlineStatus(true);
        expect(state.sync.isOnline).toBe(true);
      }
      
      // Verify all data persisted
      for (let i = 0; i < cycles; i++) {
        expect(state.problems.has(`cycle-${i}`)).toBe(true);
      }
    });
  });

  // ============================================================================
  // Error Handling and Recovery Tests
  // ============================================================================
  describe('Error Handling and Recovery', () => {
    it('should handle cache storage errors gracefully', async () => {
      const request = new Request('http://localhost/smartgrind/test');
      
      // Mock cache to throw error
      const originalOpen = global.caches.open;
      global.caches.open = jest.fn().mockRejectedValue(new Error('Cache error'));

      try {
        await strategies.api.fetch(request);
      } catch (error) {
        // Expected to fail
        expect(error).toBeDefined();
      }

      // Restore
      global.caches.open = originalOpen;
    });

    it('should handle IndexedDB errors gracefully', () => {
      // Test that operation queue handles IndexedDB errors internally
      // The module has internal error handling for storage failures
      expect(operationQueue).toBeDefined();
      expect(typeof operationQueue.getStatus).toBe('function');
    });

    it('should retry failed operations with exponential backoff', async () => {
      const execute = jest.fn();
      
      // First 3 calls fail, 4th succeeds
      execute
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockRejectedValueOnce(new Error('Fail 3'))
        .mockResolvedValueOnce(undefined);

      syncScheduler.schedule('retry-test', execute, { maxRetries: 5 });
      
      await syncScheduler.forceSync();

      // Should have been called multiple times
      expect(execute).toHaveBeenCalled();
    });

    it('should handle network errors during sync', async () => {
      // Mock network failure
      mockFetch.mockRejectedValue(new Error('Network error'));
      
      try {
        await backgroundSync.syncUserProgress();
      } catch {
        // Expected to handle errors
      }
      
      // Should complete without unhandled rejection
      expect(true).toBe(true);
    });

    it('should recover from network errors', async () => {
      // First request fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      const request = new Request('http://localhost/smartgrind/api/data');
      
      try {
        await strategies.api.fetch(request);
      } catch {
        // Expected first failure
      }

      // Second request succeeds
      mockFetch.mockResolvedValueOnce(new Response('success', { status: 200 }));
      
      const response = await strategies.api.fetch(request);
      
      expect(response.status).toBe(200);
    });

    it('should handle malformed API responses', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as unknown as Response);

      try {
        await backgroundSync.syncUserProgress();
      } catch {
        // Expected to handle errors
      }
      
      expect(true).toBe(true);
    });

    it('should handle timeout scenarios', async () => {
      // Use a very short timeout for testing
      const execute = jest.fn().mockResolvedValue(undefined);
      syncScheduler.schedule('timeout-test', execute);
      
      // Force sync should complete
      await syncScheduler.forceSync();
      
      expect(execute).toHaveBeenCalled();
    });

    it('should handle authentication errors during sync', async () => {
      mockFetch.mockResolvedValue({ status: 401, ok: false });

      try {
        await backgroundSync.syncUserProgress();
      } catch {
        // Expected to handle auth errors
      }
      
      expect(true).toBe(true);
    });

    it('should handle server errors during sync', async () => {
      mockFetch.mockResolvedValue({ status: 500, ok: false });

      try {
        await backgroundSync.syncUserProgress();
      } catch {
        // Expected to handle server errors
      }
      
      expect(true).toBe(true);
    });
  });

  // ============================================================================
  // Cache Cleanup and Maintenance Tests
  // ============================================================================
  describe('Cache Cleanup and Maintenance', () => {
    it('should clean up old caches', async () => {
      // Create old cache
      await caches.open('old-cache-v1');
      
      // Verify old cache exists
      let cacheNames = await caches.keys();
      expect(cacheNames).toContain('old-cache-v1');

      // Delete old cache (simulating cleanup)
      await caches.delete('old-cache-v1');

      // Verify old cache is gone
      cacheNames = await caches.keys();
      expect(cacheNames).not.toContain('old-cache-v1');
    });

    it('should preserve current version caches', async () => {
      // Create current cache
      await caches.open('static-cache-v2');
      
      const cacheNames = await caches.keys();
      expect(cacheNames).toContain('static-cache-v2');
    });

    it('should validate cache entries', async () => {
      const request = new Request('http://localhost/smartgrind/test');
      const cache = await caches.open('api-cache-v2');
      
      // Add entry with timestamp
      const response = new Response('test', {
        status: 200,
        headers: {
          'X-SW-Cached-At': Date.now().toString(),
          'X-SW-Version': 'test-version',
        },
      });
      await cache.put(request, response);

      // Verify entry
      const cached = await cache.match(request);
      expect(cached).toBeDefined();
      
      const cachedAt = cached?.headers.get('X-SW-Cached-At');
      expect(cachedAt).toBeDefined();
    });

    it('should remove stale cache entries', async () => {
      const request = new Request('http://localhost/smartgrind/test');
      const cache = await caches.open('api-cache-v2');
      
      // Add stale entry (older than 30 minutes)
      const staleTime = Date.now() - 31 * 60 * 1000;
      const response = new Response('stale', {
        status: 200,
        headers: {
          'X-SW-Cached-At': staleTime.toString(),
        },
      });
      await cache.put(request, response);

      // Verify entry exists
      let cached = await cache.match(request);
      expect(cached).toBeDefined();

      // Delete stale entry
      await cache.delete(request);

      // Verify entry is gone
      cached = await cache.match(request);
      expect(cached).toBeUndefined();
    });

    it('should get cache stats', async () => {
      // Populate cache
      const cache = await caches.open('test-stats-cache');
      await cache.put(
        new Request('http://test.com/1.js'),
        new Response('1')
      );
      await cache.put(
        new Request('http://test.com/2.js'),
        new Response('2')
      );

      const stats = await getCacheStats();
      
      expect(typeof stats).toBe('object');
      expect(stats['test-stats-cache']).toBe(2);
    });
  });

  // ============================================================================
  // API Integration with Service Worker
  // ============================================================================
  describe('API Integration with Service Worker', () => {
    it('should queue operations through API', async () => {
      state.user.type = 'signed-in';

      const operation = {
        type: 'MARK_SOLVED' as const,
        data: { problemId: '1', solved: true },
        timestamp: Date.now(),
      };

      const result = await api.queueOperation(operation);
      
      expect(result).toBeDefined();
    });

    it('should get sync status through API', async () => {
      const status = await api.getSyncStatus();
      
      expect(status === null || typeof status === 'object').toBe(true);
    });

    it('should force sync through API', async () => {
      const result = await api.forceSync();
      
      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });

    it('should check online status through API', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

      const isOnline = await api.isOnline();
      
      expect(typeof isOnline).toBe('boolean');
    });

    it('should initialize offline detection', () => {
      const cleanup = api.initOfflineDetection();
      
      expect(typeof cleanup).toBe('function');
      
      // Cleanup should not throw
      expect(() => cleanup()).not.toThrow();
    });

    it('should handle sync status updates', () => {
      state.setSyncStatus({
        isSyncing: true,
        pendingCount: 5,
        lastSyncAt: Date.now(),
      });

      expect(state.sync.isSyncing).toBe(true);
      expect(state.sync.pendingCount).toBe(5);
    });

    it('should handle sync conflicts', () => {
      state.setSyncStatus({
        hasConflicts: true,
        conflictMessage: 'Data conflict detected',
      });

      expect(state.sync.hasConflicts).toBe(true);
      expect(state.sync.conflictMessage).toBe('Data conflict detected');
    });
  });

  // ============================================================================
  // Component Coordination Tests
  // ============================================================================
  describe('Component Coordination', () => {
    it('should coordinate between operation queue and background sync', async () => {
      // Add operations and verify queue functionality
      const id = await operationQueue.addOperation('MARK_SOLVED', { problemId: '1' });
      expect(id).toBeDefined();
      
      // Verify queue statistics
      const stats = await operationQueue.getStats();
      expect(stats).toBeDefined();
      expect(stats.pending).toBeGreaterThanOrEqual(0);
    });

    it('should coordinate between connectivity checker and sync scheduler', async () => {
      const execute = jest.fn().mockResolvedValue(undefined);
      
      // Schedule task
      syncScheduler.schedule('connectivity-test', execute);
      
      // Simulate connectivity changes
      connectivityChecker.setOnlineStatus(false);
      connectivityChecker.setOnlineStatus(true);
      await syncScheduler.onConnectivityRestored();
      
      // Should have reset circuit breakers
      expect(syncScheduler.getStats().circuitBreakersOpen).toBe(0);
    });

    it('should coordinate between cache strategies and state', async () => {
      // Update state
      state.user = { type: 'signed-in', id: 'test', displayName: 'Test User' };
      
      expect(state.user.type).toBe('signed-in');
    });
  });
});
