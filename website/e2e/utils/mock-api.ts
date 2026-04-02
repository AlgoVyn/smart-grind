/**
 * API Mocking Utilities
 * 
 * Provides consistent API mocking across all e2e tests.
 * Supports different scenarios: authenticated, offline, error states, etc.
 */

import { Page } from '@playwright/test';
import { mockAPIResponses, mockUser, testScenarios, mockFlashcards } from '../fixtures/test-data';

export type MockScenario = 'default' | 'authenticated' | 'offline' | 'error' | 'fresh' | 'completed';

interface MockOptions {
  scenario?: MockScenario;
  customResponses?: Record<string, unknown>;
  delay?: number;
  errorRate?: number;
}

/**
 * Setup API mocks for a test page
 */
export async function setupAPIMocks(page: Page, options: MockOptions = {}): Promise<void> {
  const { scenario = 'default', customResponses = {}, delay = 0 } = options;

  // Auth endpoints
  await page.route('**/smartgrind/api/auth**', async (route) => {
    const url = route.request().url();
    
    if (scenario === 'error') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Authentication failed' }),
      });
      return;
    }

    if (url.includes('action=token')) {
      await delayResponse(route, delay);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(customResponses.auth || mockAPIResponses.auth.token),
      });
      return;
    }

    await route.continue();
  });

  // User endpoints
  await page.route('**/smartgrind/api/user**', async (route) => {
    const method = route.request().method();
    const url = route.request().url();

    if (scenario === 'error' && method === 'POST') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to save' }),
      });
      return;
    }

    if (url.includes('action=csrf')) {
      await delayResponse(route, delay);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAPIResponses.csrf),
      });
      return;
    }

    if (method === 'GET') {
      let response = mockAPIResponses.user;
      
      if (scenario === 'fresh') {
        response = testScenarios.freshUser;
      } else if (scenario === 'completed') {
        response = testScenarios.completedUser;
      }

      // Include flashcards data in the response
      const flashcardsResponse = {
        ...response,
        flashcards: mockFlashcards.map(fc => ({
          ...fc,
          nextReviewDate: new Date().toISOString().split('T')[0], // Ensure cards are due for review
        })),
      };

      await delayResponse(route, delay);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(customResponses.user || flashcardsResponse),
      });
      return;
    }

    if (method === 'POST') {
      await delayResponse(route, delay);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAPIResponses.save),
      });
      return;
    }

    await route.continue();
  });

  // Topics endpoint
  await page.route('**/smartgrind/api/topics**', async (route) => {
    await delayResponse(route, delay);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(customResponses.topics || mockAPIResponses.topics),
    });
  });

  // Sync endpoint
  await page.route('**/smartgrind/api/sync**', async (route) => {
    if (scenario === 'offline') {
      await route.abort('internetdisconnected');
      return;
    }

    await delayResponse(route, delay);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(customResponses.sync || mockAPIResponses.sync),
    });
  });

  // Delete endpoint
  await page.route('**/smartgrind/api/delete**', async (route) => {
    await delayResponse(route, delay);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  // Reset endpoint
  await page.route('**/smartgrind/api/reset**', async (route) => {
    await delayResponse(route, delay);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  // Flashcards markdown files
  await page.route('**/smartgrind/flashcards/*.md', async (route) => {
    const url = route.request().url();
    const cardId = url.split('/').pop()?.replace('.md', '') || 'unknown';
    
    // Return mock markdown content for any flashcard
    await route.fulfill({
      status: 200,
      contentType: 'text/markdown',
      body: `---
title: "Flashcard: ${cardId}"
difficulty: easy
type: algorithm
category: general
---

## Question

What is the ${cardId} pattern/algorithm?

## Answer

This is a sample answer for ${cardId}. The actual implementation would depend on the specific problem requirements.

## Key Points

- Important concept 1
- Important concept 2
- Time complexity: O(n)
- Space complexity: O(1)
`,
    });
  });
}

/**
 * Setup offline mode simulation
 */
export async function setupOfflineMode(page: Page, context: { setOffline: (offline: boolean) => Promise<void> }): Promise<void> {
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
}

/**
 * Restore online mode
 */
export async function restoreOnlineMode(page: Page, context: { setOffline: (offline: boolean) => Promise<void> }): Promise<void> {
  await context.setOffline(false);
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
}

/**
 * Mock service worker for tests
 */
export async function mockServiceWorker(page: Page): Promise<void> {
  await page.addInitScript(() => {
    // Store original register
    const originalRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
    
    // Mock SW registration
    navigator.serviceWorker.register = async (url: string | URL, options?: RegistrationOptions) => {
      const urlString = url.toString();
      
      if (urlString.includes('sw.js')) {
        // Return a mock registration object
        const mockRegistration = {
          scope: '/smartgrind/',
          active: {
            postMessage: (data: unknown) => {
              // Simulate SW message handling
              if (typeof data === 'object' && data !== null) {
                const msg = data as { type?: string };
                if (msg.type === 'SYNC_NOW') {
                  // Simulate sync completion
                  setTimeout(() => {
                    window.dispatchEvent(new MessageEvent('message', {
                      data: { type: 'SYNC_COMPLETE', success: true }
                    }));
                  }, 100);
                }
              }
            },
            state: 'activated',
          },
          installing: null,
          waiting: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          update: () => Promise.resolve(),
          unregister: () => Promise.resolve(true),
          sync: {
            register: () => Promise.resolve(),
            getTags: () => Promise.resolve([]),
          },
          pushManager: null,
        };

        // Simulate successful registration
        setTimeout(() => {
          window.dispatchEvent(new MessageEvent('message', {
            data: { type: 'SW_REGISTERED' }
          }));
        }, 50);

        return mockRegistration as unknown as ServiceWorkerRegistration;
      }

      return originalRegister(url, options);
    };

    // Mock navigator.serviceWorker.ready
    Object.defineProperty(navigator.serviceWorker, 'ready', {
      value: Promise.resolve({
        postMessage: () => {},
        state: 'activated',
      }),
    });
  });
}

/**
 * Wait for API call to complete
 */
export async function waitForAPICall(page: Page, urlPattern: string | RegExp, timeout = 5000): Promise<void> {
  await page.waitForResponse(response => {
    const url = response.url();
    if (typeof urlPattern === 'string') {
      return url.includes(urlPattern);
    }
    return urlPattern.test(url);
  }, { timeout });
}

/**
 * Get request count for a specific endpoint
 */
export async function getRequestCount(page: Page, urlPattern: string | RegExp): Promise<number> {
  let count = 0;
  
  page.on('request', request => {
    const url = request.url();
    const matches = typeof urlPattern === 'string' 
      ? url.includes(urlPattern) 
      : urlPattern.test(url);
    if (matches) count++;
  });

  return count;
}

// Helper function to add delay to responses
async function delayResponse(route: import('@playwright/test').Route, delay: number): Promise<void> {
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
