// --- STORAGE UTILITIES ---
// Pure localStorage helpers with no application dependencies.
// Safe to import from any module (breaks circular dependency with state.ts).

/** Returns true if the error is a storage quota error that should be re-thrown. */
const isQuotaError = (error: unknown): boolean =>
    error instanceof Error &&
    (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED');

export const safeGetItem = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item && item !== '[object Object]' ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
};

/**
 * Safely stores a value in localStorage with JSON serialization.
 *
 * @returns true if storage succeeded, false on non-quota errors
 * @throws {Error} QuotaExceededError or NS_ERROR_DOM_QUOTA_REACHED when storage quota is exceeded.
 */
export const safeSetItem = (key: string, value: unknown): boolean => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        if (isQuotaError(error)) throw error;
        return false;
    }
};

export const safeRemoveItem = (key: string): boolean => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
};

export const getStringItem = (key: string, defaultValue: string): string => {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch {
        return defaultValue;
    }
};

/**
 * Safely stores a string value in localStorage.
 *
 * @returns true if storage succeeded, false on non-quota errors
 * @throws {Error} QuotaExceededError or NS_ERROR_DOM_QUOTA_REACHED when storage quota is exceeded.
 */
export const setStringItem = (key: string, value: string): boolean => {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        if (isQuotaError(error)) throw error;
        return false;
    }
};
