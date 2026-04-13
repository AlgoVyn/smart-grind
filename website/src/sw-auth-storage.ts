/**
 * Writes auth token to IndexedDB so the Service Worker can use it for background sync.
 * The SW often does not receive HttpOnly cookies on fetch (e.g. SameSite=Strict).
 * Uses the same DB/store as the SW's auth-manager (smartgrind-auth / auth-tokens).
 */

import { promisifyRequest } from './utils/indexeddb-helper';

const AUTH_DB_NAME = 'smartgrind-auth';
const AUTH_DB_VERSION = 1;
const AUTH_STORE_NAME = 'auth-tokens';
const JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 1 week, match auth API

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(AUTH_DB_NAME, AUTH_DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(AUTH_STORE_NAME)) {
                db.createObjectStore(AUTH_STORE_NAME, { keyPath: 'key' });
            }
        };
    });
}

/**
 * Store the JWT so the Service Worker can send Authorization: Bearer for sync.
 * Call this after sign-in when you have the token (popup success or URL callback).
 */
export async function storeTokenForServiceWorker(token: string): Promise<void> {
    const expiresAt = Date.now() + JWT_EXPIRY_SECONDS * 1000;
    const db = await openDB();
    const tx = db.transaction(AUTH_STORE_NAME, 'readwrite');
    const store = tx.objectStore(AUTH_STORE_NAME);
    await promisifyRequest(store.put({ key: 'token', value: token }));
    await promisifyRequest(store.put({ key: 'tokenExpiresAt', value: String(expiresAt) }));
    db.close();
}

/**
 * Clear the token from IndexedDB so the SW stops using it (e.g. on sign-out).
 */
export async function clearTokenForServiceWorker(): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(AUTH_STORE_NAME, 'readwrite');
    const store = tx.objectStore(AUTH_STORE_NAME);
    await promisifyRequest(store.delete('token'));
    await promisifyRequest(store.delete('tokenExpiresAt'));
    await promisifyRequest(store.delete('refreshToken'));
    db.close();
}
