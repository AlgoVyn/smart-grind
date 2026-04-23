/**
 * Writes auth token to IndexedDB so the Service Worker can use it for background sync.
 * The SW often does not receive HttpOnly cookies on fetch (e.g. SameSite=Strict).
 * Uses the same DB/store as the SW's auth-manager (smartgrind-auth / auth-tokens).
 */

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
 * Promisify a transaction to wait for completion (atomic operation).
 * All operations in the transaction will either all succeed or all fail.
 */
function promisifyTransaction(tx: IDBTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
    });
}

/**
 * Store the JWT so the Service Worker can send Authorization: Bearer for sync.
 * Call this after sign-in when you have the token (popup success or URL callback).
 *
 * SECURITY: Uses atomic transaction - token and expiry are written together.
 * If either write fails, both are rolled back to prevent inconsistent state.
 */
export async function storeTokenForServiceWorker(token: string): Promise<void> {
    const expiresAt = Date.now() + JWT_EXPIRY_SECONDS * 1000;
    const db = await openDB();

    try {
        const tx = db.transaction(AUTH_STORE_NAME, 'readwrite');
        const store = tx.objectStore(AUTH_STORE_NAME);

        // Queue both operations in the same transaction
        store.put({ key: 'token', value: token });
        store.put({ key: 'tokenExpiresAt', value: String(expiresAt) });

        // Wait for the entire transaction to complete atomically
        await promisifyTransaction(tx);
    } finally {
        db.close();
    }
}

/**
 * Clear the token from IndexedDB so the SW stops using it (e.g. on sign-out).
 *
 * SECURITY: Uses atomic transaction - all token data is deleted together.
 * If any delete fails, the transaction rolls back to prevent partial cleanup.
 */
export async function clearTokenForServiceWorker(): Promise<void> {
    const db = await openDB();

    try {
        const tx = db.transaction(AUTH_STORE_NAME, 'readwrite');
        const store = tx.objectStore(AUTH_STORE_NAME);

        // Queue all deletions in the same transaction
        store.delete('token');
        store.delete('tokenExpiresAt');
        store.delete('refreshToken');

        // Wait for the entire transaction to complete atomically
        await promisifyTransaction(tx);
    } finally {
        db.close();
    }
}
