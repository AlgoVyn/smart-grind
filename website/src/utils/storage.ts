// --- STORAGE UTILITY MODULE ---
// Centralized localStorage operations with error handling

/**
 * Safely parse JSON from localStorage with fallback
 * @param key - localStorage key
 * @param defaultValue - Default value if parsing fails or key doesn't exist
 * @returns Parsed value or default
 */
export const safeGetItem = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`[Storage] Failed to parse item for key "${key}":`, error);
        return defaultValue;
    }
};

/**
 * Safely set item to localStorage
 * @param key - localStorage key
 * @param value - Value to store (will be JSON stringified)
 * @returns true if successful, false otherwise
 */
export const safeSetItem = (key: string, value: unknown): boolean => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`[Storage] Failed to set item for key "${key}":`, error);
        return false;
    }
};

/**
 * Safely remove item from localStorage
 * @param key - localStorage key
 * @returns true if successful or item didn't exist, false on error
 */
export const safeRemoveItem = (key: string): boolean => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`[Storage] Failed to remove item for key "${key}":`, error);
        return false;
    }
};

/**
 * Get string value from localStorage (non-JSON)
 * @param key - localStorage key
 * @param defaultValue - Default string value
 * @returns Stored string or default
 */
export const getStringItem = (key: string, defaultValue: string): string => {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch {
        return defaultValue;
    }
};

/**
 * Set string value to localStorage (non-JSON)
 * @param key - localStorage key
 * @param value - String value to store
 * @returns true if successful, false otherwise
 */
export const setStringItem = (key: string, value: string): boolean => {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
};

/**
 * Storage key prefixes based on user type
 */
export const STORAGE_PREFIXES = {
    LOCAL: '',
    SIGNED_IN: 'SIGNED_IN_',
} as const;

/**
 * Generate storage key with optional prefix
 * @param baseKey - Base key name
 * @param isSignedIn - Whether user is signed in
 * @returns Full storage key
 */
export const getStorageKey = (baseKey: string, isSignedIn: boolean): string => {
    const prefix = isSignedIn ? STORAGE_PREFIXES.SIGNED_IN : STORAGE_PREFIXES.LOCAL;
    return `${prefix}${baseKey}`;
};

/**
 * Common storage keys used across the app
 */
export const STORAGE_KEYS = {
    USER_TYPE: 'smartgrind-user-type',
    PROBLEMS: (isSignedIn: boolean) => getStorageKey('smartgrind-problems', isSignedIn),
    DELETED_IDS: (isSignedIn: boolean) => getStorageKey('smartgrind-deleted-ids', isSignedIn),
    DISPLAY_NAME: (isSignedIn: boolean) => getStorageKey('smartgrind-display-name', isSignedIn),
    PREFERRED_AI: 'preferred-ai',
    USER_ID: 'userId',
} as const;
