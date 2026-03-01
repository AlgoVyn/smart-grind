/**
 * @jest-environment jsdom
 */

import {
    storeTokenForServiceWorker,
    clearTokenForServiceWorker,
} from '../src/sw-auth-storage';

describe('SW Auth Storage', () => {
    beforeEach(() => {
        // Clear IndexedDB before each test
        (global.indexedDB as unknown as { _clearAll: () => void })._clearAll();
        jest.clearAllMocks();
    });

    describe('storeTokenForServiceWorker', () => {
        it('should store token and expiry in IndexedDB', async () => {
            const token = 'test-jwt-token-12345';
            
            await storeTokenForServiceWorker(token);
            
            // Verify by trying to read back from DB
            const db = await openAuthDB();
            const tx = db.transaction('auth-tokens', 'readonly');
            const store = tx.objectStore('auth-tokens');
            
            const tokenResult = await getFromStore(store, 'token');
            const expiryResult = await getFromStore(store, 'tokenExpiresAt');
            
            expect(tokenResult?.value).toBe(token);
            expect(expiryResult?.value).toBeDefined();
            
            // Verify expiry is a valid timestamp in the future
            const expiryTime = parseInt(expiryResult?.value as string, 10);
            expect(expiryTime).toBeGreaterThan(Date.now());
            expect(expiryTime).toBeLessThan(Date.now() + 25 * 60 * 60 * 1000); // Less than 25 hours
            
            db.close();
        });

        it('should overwrite existing token', async () => {
            const firstToken = 'first-token';
            const secondToken = 'second-token';
            
            await storeTokenForServiceWorker(firstToken);
            await storeTokenForServiceWorker(secondToken);
            
            const db = await openAuthDB();
            const tx = db.transaction('auth-tokens', 'readonly');
            const store = tx.objectStore('auth-tokens');
            
            const result = await getFromStore(store, 'token');
            expect(result?.value).toBe(secondToken);
            
            db.close();
        });

        it('should handle token with special characters', async () => {
            const token = 'test.token+with/special=chars&symbols';
            
            await storeTokenForServiceWorker(token);
            
            const db = await openAuthDB();
            const tx = db.transaction('auth-tokens', 'readonly');
            const store = tx.objectStore('auth-tokens');
            
            const result = await getFromStore(store, 'token');
            expect(result?.value).toBe(token);
            
            db.close();
        });

        it('should handle empty token', async () => {
            await storeTokenForServiceWorker('');
            
            const db = await openAuthDB();
            const tx = db.transaction('auth-tokens', 'readonly');
            const store = tx.objectStore('auth-tokens');
            
            const result = await getFromStore(store, 'token');
            expect(result?.value).toBe('');
            
            db.close();
        });

        it('should handle long token', async () => {
            const longToken = 'a'.repeat(10000);
            
            await storeTokenForServiceWorker(longToken);
            
            const db = await openAuthDB();
            const tx = db.transaction('auth-tokens', 'readonly');
            const store = tx.objectStore('auth-tokens');
            
            const result = await getFromStore(store, 'token');
            expect(result?.value).toBe(longToken);
            
            db.close();
        });
    });

    describe('clearTokenForServiceWorker', () => {
        it('should remove token, expiry, and refresh token from IndexedDB', async () => {
            // First store some data
            await storeTokenForServiceWorker('test-token');
            
            // Manually add refresh token
            const db = await openAuthDB();
            const tx = db.transaction('auth-tokens', 'readwrite');
            const store = tx.objectStore('auth-tokens');
            await putToStore(store, 'refreshToken', 'refresh-token-value');
            db.close();
            
            // Now clear
            await clearTokenForServiceWorker();
            
            // Verify all are gone
            const db2 = await openAuthDB();
            const tx2 = db2.transaction('auth-tokens', 'readonly');
            const store2 = tx2.objectStore('auth-tokens');
            
            const tokenResult = await getFromStore(store2, 'token');
            const expiryResult = await getFromStore(store2, 'tokenExpiresAt');
            const refreshResult = await getFromStore(store2, 'refreshToken');
            
            expect(tokenResult).toBeNull();
            expect(expiryResult).toBeNull();
            expect(refreshResult).toBeNull();
            
            db2.close();
        });

        it('should not throw when clearing non-existent tokens', async () => {
            await expect(clearTokenForServiceWorker()).resolves.not.toThrow();
        });

        it('should handle partial clear (only some keys exist)', async () => {
            // Only store token, not expiry or refresh
            const db = await openAuthDB();
            const tx = db.transaction('auth-tokens', 'readwrite');
            const store = tx.objectStore('auth-tokens');
            await putToStore(store, 'token', 'partial-token');
            db.close();
            
            // Should not throw
            await expect(clearTokenForServiceWorker()).resolves.not.toThrow();
            
            // Verify token is gone
            const db2 = await openAuthDB();
            const tx2 = db2.transaction('auth-tokens', 'readonly');
            const store2 = tx2.objectStore('auth-tokens');
            const result = await getFromStore(store2, 'token');
            expect(result).toBeNull();
            db2.close();
        });
    });

    describe('Database operations', () => {
        it('should create database with correct version', async () => {
            const db = await openAuthDB();
            
            expect(db.name).toBe('smartgrind-auth');
            expect(db.version).toBe(1);
            expect(db.objectStoreNames.contains('auth-tokens')).toBe(true);
            
            db.close();
        });

        it('should handle database open error gracefully', async () => {
            // Mock indexedDB to simulate error
            const originalIndexedDB = global.indexedDB;
            global.indexedDB = {
                open: jest.fn().mockReturnValue({
                    set onerror(handler: () => void) {
                        setTimeout(() => handler(), 0);
                    },
                    error: new Error('Database open failed'),
                }),
            } as unknown as IDBFactory;
            
            await expect(storeTokenForServiceWorker('token')).rejects.toThrow('Database open failed');
            
            // Restore
            global.indexedDB = originalIndexedDB;
        });
    });

    describe('Token lifecycle', () => {
        it('should handle store then clear then store cycle', async () => {
            // Store first token
            await storeTokenForServiceWorker('token-1');
            
            // Clear
            await clearTokenForServiceWorker();
            
            // Store second token
            await storeTokenForServiceWorker('token-2');
            
            // Verify second token is present
            const db = await openAuthDB();
            const tx = db.transaction('auth-tokens', 'readonly');
            const store = tx.objectStore('auth-tokens');
            
            const result = await getFromStore(store, 'token');
            expect(result?.value).toBe('token-2');
            
            db.close();
        });

        it('should handle multiple consecutive stores', async () => {
            const tokens = ['token-1', 'token-2', 'token-3', 'token-4', 'token-5'];
            
            for (const token of tokens) {
                await storeTokenForServiceWorker(token);
            }
            
            const db = await openAuthDB();
            const tx = db.transaction('auth-tokens', 'readonly');
            const store = tx.objectStore('auth-tokens');
            
            const result = await getFromStore(store, 'token');
            expect(result?.value).toBe('token-5'); // Last one stored
            
            db.close();
        });
    });
});

// Helper functions for tests
async function openAuthDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('smartgrind-auth', 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('auth-tokens')) {
                db.createObjectStore('auth-tokens', { keyPath: 'key' });
            }
        };
    });
}

function getFromStore(
    store: IDBObjectStore,
    key: string
): Promise<{ key: string; value: string } | undefined> {
    return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function putToStore(store: IDBObjectStore, key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = store.put({ key, value });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
