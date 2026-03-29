// --- ERROR TRACKER ---
// Simple error logging utility

const CONSENT_KEY = 'error-tracking-consent';

export const errorTracker = {
    hasConsent(): boolean {
        try {
            return localStorage.getItem(CONSENT_KEY) === 'granted';
        } catch {
            return false;
        }
    },

    grantConsent(): void {
        try {
            localStorage.setItem(CONSENT_KEY, 'granted');
        } catch {
            // Ignore
        }
    },

    revokeConsent(): void {
        try {
            localStorage.setItem(CONSENT_KEY, 'denied');
        } catch {
            // Ignore
        }
    },

    getConsentStatus(): 'granted' | 'denied' | 'unknown' {
        try {
            const value = localStorage.getItem(CONSENT_KEY);
            if (value === 'granted') return 'granted';
            if (value === 'denied') return 'denied';
            return 'unknown';
        } catch {
            return 'unknown';
        }
    },

    captureException(error: unknown, context?: Record<string, unknown>): void {
        console.error('[Error]', error, context);
    },
};
