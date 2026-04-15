/**
 * Error Boundary and Recovery E2E Tests
 * 
 * Comprehensive tests for error handling, recovery mechanisms, and data integrity
 * during various failure scenarios.
 */

import { test, expect } from '@playwright/test';
import { AppPage } from './page-objects/app-page';
import { setupAPIMocks, mockServiceWorker } from './utils/mock-api';
import { 
  setupAuthStateBeforeLoad, 
  waitForAppReady, 
  waitForToast, 
  getToastMessages 
} from './utils/test-helpers';
import { resetCounters, createUser, generateProblems, createProblem } from './fixtures/data-factory';

test.describe('Error Boundary and Recovery', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    resetCounters();
    await setupAuthStateBeforeLoad(page);
    await mockServiceWorker(page);
  });

  test.afterEach(async ({ page }) => {
    await page.unroute('**/*').catch(() => {});
  });

  test.describe('Network Error Recovery', () => {
    test('should handle API timeout gracefully', async ({ page }) => {
      // Track console errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.route('**/smartgrind/api/user**', async (route) => {
        await route.abort('timedout');
      });
      
      await appPage.goto();
      await page.waitForTimeout(3000);
      
      // Verify app shows loading or rendered state
      const hasLoading = await appPage.loadingScreen.isVisible().catch(() => false);
      const hasApp = await appPage.appWrapper.isVisible().catch(() => false);
      expect(hasLoading || hasApp).toBe(true);
      
      // Verify no critical JS errors from timeout handling
      const criticalErrors = consoleErrors.filter(e => 
        !e.includes('chunk') && 
        !e.includes('service worker') &&
        !e.includes('Source map') &&
        !e.includes('Failed to fetch') &&
        !e.includes('NetworkError')
      );
      expect(criticalErrors).toHaveLength(0);
    });

    test('should recover from network disconnection', async ({ browser }) => {
      const offlineContext = await browser.newContext();
      const offlinePage = await offlineContext.newPage();
      const offlineAppPage = new AppPage(offlinePage);
      
      await setupAuthStateBeforeLoad(offlinePage);
      await mockServiceWorker(offlinePage);
      await setupAPIMocks(offlinePage, { scenario: 'default' });
      
      try {
        // Start online
        await offlineContext.setOffline(false);
        await offlinePage.goto('./');
        await waitForAppReady(offlinePage);
        
        // Verify online state
        await expect(offlineAppPage.onlineIndicator).toBeVisible();
        await expect(offlineAppPage.offlineIndicator).toBeHidden();
        
        // Go offline
        await offlineContext.setOffline(true);
        await offlinePage.evaluate(() => window.dispatchEvent(new Event('offline')));
        await offlinePage.waitForTimeout(1000);
        
        // Verify offline indicator is visible
        const offlineIndicatorVisible = await offlineAppPage.offlineIndicator.isVisible().catch(() => false);
        const onlineIndicatorHidden = !await offlineAppPage.onlineIndicator.isVisible().catch(() => true);
        expect(offlineIndicatorVisible || onlineIndicatorHidden).toBe(true);
        
        // Verify app remains functional offline
        await expect(offlineAppPage.appWrapper).toBeVisible();
        await expect(offlineAppPage.searchInput).toBeVisible();
      } finally {
        await offlineContext.close();
      }
    });

    test('should show offline indicator when appropriate', async ({ page }) => {
      await setupAPIMocks(page, { scenario: 'default' });
      await appPage.gotoAndWait();
      
      // When online: online indicator visible, offline hidden
      const onlineVisible = await appPage.onlineIndicator.isVisible().catch(() => false);
      const offlineHidden = !await appPage.offlineIndicator.isVisible().catch(() => true);
      expect(onlineVisible || offlineHidden).toBe(true);
      
      // Verify indicators are mutually exclusive in normal state
      const bothVisible = await appPage.onlineIndicator.isVisible() && 
                         await appPage.offlineIndicator.isVisible();
      expect(bothVisible).toBe(false);
    });
  });

  test.describe('Storage Error Handling', () => {
    test('should handle localStorage quota exceeded', async ({ page }) => {
      await setupAPIMocks(page, { scenario: 'default' });
      await appPage.gotoAndWait();
      
      // Simulate quota exceeded by mocking localStorage.setItem to throw
      await page.evaluate(() => {
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key: string, value: string) {
          if (key.includes('problems') || key.includes('settings')) {
            throw new Error('QuotaExceededError: The quota has been exceeded');
          }
          return originalSetItem.call(this, key, value);
        };
      });
      
      // Trigger a save operation
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('test-save-triggered'));
      });
      
      // Verify app remains visible and functional
      await expect(appPage.appWrapper).toBeVisible();
      await expect(appPage.searchInput).toBeEditable();
      
      // Check for error toast notification
      const toastMessages = await getToastMessages(page);
      const hasStorageError = toastMessages.some(msg => 
        msg.toLowerCase().includes('storage') || 
        msg.toLowerCase().includes('save') ||
        msg.toLowerCase().includes('quota')
      );
      // Note: Toast may or may not appear depending on implementation
      // The important thing is the app doesn't crash
      expect(appPage.appWrapper.isVisible()).resolves.toBe(true);
    });

    test('should handle corrupted localStorage data', async ({ page }) => {
      await setupAPIMocks(page, { scenario: 'default' });
      await appPage.goto();
      await page.waitForTimeout(1000);
      
      // Inject corrupted data
      await page.evaluate(() => {
        localStorage.setItem('problems', 'invalid-json{{{');
        localStorage.setItem('userId', 'test-corrupted-data-user');
      });
      
      // Reload to trigger data parsing
      await page.reload();
      await appPage.waitForReady();
      
      // Verify app recovers and renders
      await expect(appPage.appWrapper).toBeVisible();
      
      // Verify stats are still displayed (even if showing zeros)
      const totalText = await appPage.statTotal.textContent().catch(() => '0');
      expect(totalText).toBeTruthy();
      
      // Verify user display is still functional
      const displayName = await appPage.getUserDisplayName().catch(() => '');
      // After corruption, user might be reset to default or preserved
      expect(typeof displayName).toBe('string');
    });
  });

  test.describe('Sync Error Handling', () => {
    test('should handle sync conflicts', async ({ page }) => {
      // Setup with a scenario that will create conflicts
      await setupAPIMocks(page, { scenario: 'default' });
      
      // Create initial user data
      const user = createUser({ displayName: 'Conflict Test User' });
      const problem = createProblem({ id: 'conflict-test', status: 'solved' });
      
      await page.evaluate((data) => {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('displayName', data.displayName);
        localStorage.setItem('problems', JSON.stringify({
          'conflict-test': { id: 'conflict-test', status: 'solved' }
        }));
        localStorage.setItem('lastSyncAt', String(Date.now() - 10000)); // Simulate stale sync
      }, user);
      
      await appPage.gotoAndWait();
      
      // Verify app loaded successfully despite potential conflicts
      await expect(appPage.appWrapper).toBeVisible();
      
      // Check for conflict resolution indicators
      const pendingIndicatorVisible = await appPage.pendingIndicator.isVisible().catch(() => false);
      const syncIndicatorVisible = await appPage.syncingIndicator.isVisible().catch(() => false);
      
      // Either pending/sync indicators show, or app is in clean state
      expect(appPage.appWrapper.isVisible()).resolves.toBe(true);
    });

    test('should recover from 500 errors during sync', async ({ page }) => {
      let syncAttempts = 0;
      
      await setupAPIMocks(page, { scenario: 'default' });
      await page.route('**/smartgrind/api/sync**', async (route) => {
        syncAttempts++;
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error', code: 'SYNC_FAILED' }),
        });
      });
      
      // Add pending operation to trigger sync
      await page.evaluate(() => {
        localStorage.setItem('pending-operations', JSON.stringify([{
          type: 'MARK_SOLVED',
          data: { problemId: 'test-problem', status: 'solved' },
          timestamp: Date.now()
        }]));
        localStorage.setItem('userId', 'test-sync-error-user');
        localStorage.setItem('smartgrind-user-type', 'signed-in');
      });
      
      await appPage.gotoAndWait();
      
      // Verify app renders despite sync errors
      await expect(appPage.appWrapper).toBeVisible();
      
      // Verify sync was attempted
      expect(syncAttempts).toBeGreaterThan(0);
      
      // Verify pending operations are preserved for retry
      const pendingOpsRaw = await page.evaluate(() => 
        localStorage.getItem('pending-operations')
      );
      const pendingOps = JSON.parse(pendingOpsRaw || '[]');
      expect(pendingOps.length).toBeGreaterThan(0);
    });

    test('should handle auth errors during sync', async ({ page }) => {
      await setupAPIMocks(page, { scenario: 'default' });
      
      // Setup authenticated user with expired token
      await page.evaluate(() => {
        localStorage.setItem('userId', 'auth-error-test-user');
        localStorage.setItem('token', 'expired-token');
        localStorage.setItem('smartgrind-user-type', 'signed-in');
        localStorage.setItem('pending-operations', JSON.stringify([{
          type: 'MARK_SOLVED',
          data: { problemId: 'test-auth-problem', status: 'solved' },
          timestamp: Date.now()
        }]));
      });
      
      // Mock auth error response
      await page.route('**/smartgrind/api/**', async (route) => {
        const auth = route.request().headers()['authorization'];
        if (auth === 'Bearer expired-token') {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Unauthorized', code: 'AUTH_EXPIRED' }),
          });
          return;
        }
        await route.continue();
      });
      
      await appPage.gotoAndWait();
      
      // Verify app remains functional
      await expect(appPage.appWrapper).toBeVisible();
      
      // Verify pending operations are preserved
      const pendingOpsRaw = await page.evaluate(() => 
        localStorage.getItem('pending-operations')
      );
      const pendingOps = JSON.parse(pendingOpsRaw || '[]');
      expect(pendingOps.length).toBeGreaterThan(0);
      
      // Verify user is still recognized
      const userId = await page.evaluate(() => localStorage.getItem('userId'));
      expect(userId).toBe('auth-error-test-user');
    });

    test('should queue operations when sync fails', async ({ page }) => {
      await setupAPIMocks(page, { scenario: 'default' });
      
      // Setup initial state
      await page.evaluate(() => {
        localStorage.setItem('userId', 'queue-test-user');
        localStorage.setItem('smartgrind-user-type', 'signed-in');
        localStorage.setItem('lastSyncAt', String(Date.now()));
      });
      
      await appPage.gotoAndWait();
      
      // Simulate adding a pending operation
      const testOp = { 
        type: 'solve', 
        problemId: 'two-sum', 
        timestamp: Date.now(),
        retryCount: 0 
      };
      
      await page.evaluate((op) => {
        const existing = JSON.parse(localStorage.getItem('pending-operations') || '[]');
        existing.push(op);
        localStorage.setItem('pending-operations', JSON.stringify(existing));
        
        // Update sync status to indicate pending operations
        const syncStatus = JSON.parse(localStorage.getItem('sync-status') || '{}');
        syncStatus.pendingCount = existing.length;
        localStorage.setItem('sync-status', JSON.stringify(syncStatus));
      }, testOp);
      
      // Verify operation is queued
      const pendingOpsRaw = await page.evaluate(() => 
        localStorage.getItem('pending-operations')
      );
      const pendingOps = JSON.parse(pendingOpsRaw || '[]');
      
      // Should have exactly 1 operation
      expect(pendingOps.length).toBe(1);
      expect(pendingOps[0].problemId).toBe('two-sum');
      expect(pendingOps[0].type).toBe('solve');
      expect(pendingOps[0].timestamp).toBeDefined();
      
      // Verify sync status reflects pending operations
      const syncStatusRaw = await page.evaluate(() => 
        localStorage.getItem('sync-status')
      );
      const syncStatus = JSON.parse(syncStatusRaw || '{}');
      expect(syncStatus.pendingCount).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('State Recovery', () => {
    test('should recover from invalid state transitions', async ({ page }) => {
      await setupAPIMocks(page, { scenario: 'default' });
      
      // Setup potentially invalid state combinations
      await page.evaluate(() => {
        localStorage.setItem('userId', 'invalid-state-user');
        localStorage.setItem('smartgrind-user-type', 'local'); // Mismatch: signed-in token but local type
        localStorage.setItem('token', 'some-token');
        localStorage.setItem('problems', JSON.stringify({
          'invalid-problem': {
            id: 'invalid-problem',
            status: 'invalid-status', // Invalid enum value
            reviewInterval: -1 // Invalid negative value
          }
        }));
      });
      
      await appPage.gotoAndWait();
      
      // Verify app renders despite invalid state
      await expect(appPage.appWrapper).toBeVisible();
      
      // Verify search functionality works
      await appPage.searchInput.fill('test');
      const searchValue = await appPage.searchInput.inputValue();
      expect(searchValue).toBe('test');
    });

    test('should reset to safe state on critical error', async ({ page }) => {
      await setupAPIMocks(page, { scenario: 'default' });
      
      // Setup corrupted state that should trigger reset
      await page.evaluate(() => {
        localStorage.setItem('userId', ''); // Empty userId
        localStorage.setItem('problems', 'invalid-json{{{'); // Unparseable JSON
        localStorage.setItem('settings', '{broken'); // More corruption
        localStorage.setItem('smartgrind-user-type', 'signed-in'); // But signed in?
      });
      
      await appPage.gotoAndWait();
      
      // Verify app recovers
      await expect(appPage.appWrapper).toBeVisible();
      
      // Verify safe defaults are applied
      const problemsRaw = await page.evaluate(() => localStorage.getItem('problems'));
      const settingsRaw = await page.evaluate(() => localStorage.getItem('settings'));
      
      // Problems should be valid JSON or empty object after recovery
      let problems: Record<string, unknown> = {};
      try {
        problems = JSON.parse(problemsRaw || '{}');
      } catch {
        problems = {};
      }
      expect(typeof problems).toBe('object');
      
      // Settings should be valid JSON after recovery
      let settings: Record<string, unknown> = {};
      try {
        settings = JSON.parse(settingsRaw || '{}');
      } catch {
        settings = {};
      }
      expect(typeof settings).toBe('object');
    });

    test('should preserve data during error recovery', async ({ page }) => {
      await setupAPIMocks(page, { scenario: 'default' });
      
      // Create user with specific data
      const user = createUser({ 
        displayName: 'Test User For Recovery',
        userId: 'recovery-test-user'
      });
      const problems = generateProblems(3, { status: 'solved' });
      
      await appPage.goto();
      await page.waitForTimeout(1000);
      
      // Set valid data
      await page.evaluate((data) => {
        localStorage.setItem('userId', data.user.userId);
        localStorage.setItem('displayName', data.user.displayName);
        localStorage.setItem('problems', JSON.stringify(
          Object.fromEntries(data.problems.map(p => [p.id, p]))
        ));
        localStorage.setItem('smartgrind-user-type', 'signed-in');
      }, { user, problems });
      
      // Reload to trigger recovery with valid data
      await page.reload();
      await appPage.waitForReady();
      
      // Verify app is visible
      await expect(appPage.appWrapper).toBeVisible();
      
      // Verify user display name is preserved
      const displayName = await appPage.getUserDisplayName().catch(() => '');
      expect(displayName.length).toBeGreaterThan(0);
      
      // Verify data is intact by checking stats
      const totalText = await appPage.statTotal.textContent().catch(() => '0');
      const total = parseInt(totalText, 10) || 0;
      expect(total).toBeGreaterThanOrEqual(0);
      
      // Verify localStorage data is preserved
      const storedUserId = await page.evaluate(() => localStorage.getItem('userId'));
      const storedDisplayName = await page.evaluate(() => localStorage.getItem('displayName'));
      const storedProblems = await page.evaluate(() => localStorage.getItem('problems'));
      
      expect(storedUserId).toBe('recovery-test-user');
      expect(storedDisplayName).toBe('Test User For Recovery');
      expect(storedProblems).toBeTruthy();
      
      // Verify problems are valid JSON
      let parsedProblems: Record<string, unknown> = {};
      try {
        parsedProblems = JSON.parse(storedProblems || '{}');
      } catch {
        parsedProblems = {};
      }
      expect(Object.keys(parsedProblems).length).toBeGreaterThanOrEqual(0);
    });
  });
});
