/**
 * Tests for Error Tracker
 * @module tests/utils/error-tracker
 */

import { errorTracker } from '../../src/utils/error-tracker';

describe('ErrorTracker', () => {
    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('consent management', () => {
        it('should return unknown when no consent set', () => {
            expect(errorTracker.getConsentStatus()).toBe('unknown');
            expect(errorTracker.hasConsent()).toBe(false);
        });

        it('should grant consent', () => {
            errorTracker.grantConsent();
            expect(errorTracker.getConsentStatus()).toBe('granted');
            expect(errorTracker.hasConsent()).toBe(true);
        });

        it('should revoke consent', () => {
            errorTracker.grantConsent();
            errorTracker.revokeConsent();
            expect(errorTracker.getConsentStatus()).toBe('denied');
            expect(errorTracker.hasConsent()).toBe(false);
        });

        it('should handle localStorage errors gracefully', () => {
            // Mock localStorage to throw
            const originalGetItem = Storage.prototype.getItem;
            Storage.prototype.getItem = jest.fn(() => {
                throw new Error('Storage error');
            });

            expect(errorTracker.hasConsent()).toBe(false);
            expect(errorTracker.getConsentStatus()).toBe('unknown');

            Storage.prototype.getItem = originalGetItem;
        });
    });

    describe('captureException', () => {
        it('should log errors to console', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            
            errorTracker.captureException(new Error('Test error'));
            
            expect(consoleErrorSpy).toHaveBeenCalledWith('[Error]', expect.any(Error), undefined);
            
            consoleErrorSpy.mockRestore();
        });

        it('should include context when provided', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            const context = { userId: '123', action: 'test' };
            
            errorTracker.captureException(new Error('Test error'), context);
            
            expect(consoleErrorSpy).toHaveBeenCalledWith('[Error]', expect.any(Error), context);
            
            consoleErrorSpy.mockRestore();
        });

        it('should handle non-Error objects', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            
            errorTracker.captureException('String error');
            
            expect(consoleErrorSpy).toHaveBeenCalledWith('[Error]', 'String error', undefined);
            
            consoleErrorSpy.mockRestore();
        });
    });
});
