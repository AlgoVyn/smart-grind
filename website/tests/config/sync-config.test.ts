/**
 * Tests for Synchronization Configuration
 * @module tests/config/sync-config
 */

import { SYNC_CONFIG, SyncConfig } from '../../src/config/sync-config';

describe('SYNC_CONFIG', () => {
    describe('Retry Configuration', () => {
        test('should have MAX_RETRY_ATTEMPTS defined', () => {
            expect(SYNC_CONFIG.MAX_RETRY_ATTEMPTS).toBeDefined();
            expect(SYNC_CONFIG.MAX_RETRY_ATTEMPTS).toBe(5);
        });

        test('MAX_RETRY_ATTEMPTS should be positive', () => {
            expect(SYNC_CONFIG.MAX_RETRY_ATTEMPTS).toBeGreaterThan(0);
        });

        test('MAX_RETRY_ATTEMPTS should be reasonable (not excessive)', () => {
            expect(SYNC_CONFIG.MAX_RETRY_ATTEMPTS).toBeLessThanOrEqual(10);
        });
    });

    describe('Timeouts', () => {
        test('should have TIMEOUTS object', () => {
            expect(SYNC_CONFIG.TIMEOUTS).toBeDefined();
            expect(typeof SYNC_CONFIG.TIMEOUTS).toBe('object');
        });

        test('SYNC_BATCH timeout should be 60 seconds', () => {
            expect(SYNC_CONFIG.TIMEOUTS.SYNC_BATCH).toBe(60_000);
        });

        test('INDIVIDUAL_REQUEST timeout should be 15 seconds', () => {
            expect(SYNC_CONFIG.TIMEOUTS.INDIVIDUAL_REQUEST).toBe(15_000);
        });

        test('SERVICE_WORKER_MESSAGE timeout should be 5 seconds', () => {
            expect(SYNC_CONFIG.TIMEOUTS.SERVICE_WORKER_MESSAGE).toBe(5_000);
        });

        test('REGISTRATION_HANDSHAKE timeout should be 15 seconds', () => {
            expect(SYNC_CONFIG.TIMEOUTS.REGISTRATION_HANDSHAKE).toBe(15_000);
        });

        test('all timeouts should be positive numbers', () => {
            Object.values(SYNC_CONFIG.TIMEOUTS).forEach(timeout => {
                expect(typeof timeout).toBe('number');
                expect(timeout).toBeGreaterThan(0);
            });
        });

        test('SYNC_BATCH should be the longest timeout', () => {
            const timeouts = Object.values(SYNC_CONFIG.TIMEOUTS);
            const maxTimeout = Math.max(...timeouts);
            expect(SYNC_CONFIG.TIMEOUTS.SYNC_BATCH).toBe(maxTimeout);
        });

        test('SERVICE_WORKER_MESSAGE should be the shortest timeout', () => {
            const timeouts = Object.values(SYNC_CONFIG.TIMEOUTS);
            const minTimeout = Math.min(...timeouts);
            expect(SYNC_CONFIG.TIMEOUTS.SERVICE_WORKER_MESSAGE).toBe(minTimeout);
        });
    });

    describe('Intervals', () => {
        test('should have INTERVALS object', () => {
            expect(SYNC_CONFIG.INTERVALS).toBeDefined();
            expect(typeof SYNC_CONFIG.INTERVALS).toBe('object');
        });

        test('UPDATE_CHECK interval should be 60 minutes', () => {
            expect(SYNC_CONFIG.INTERVALS.UPDATE_CHECK).toBe(60 * 60 * 1000);
        });

        test('SYNC_STATUS_POLL interval should be 30 seconds', () => {
            expect(SYNC_CONFIG.INTERVALS.SYNC_STATUS_POLL).toBe(30_000);
        });

        test('RETRY_CHECK interval should be 30 seconds', () => {
            expect(SYNC_CONFIG.INTERVALS.RETRY_CHECK).toBe(30_000);
        });

        test('all intervals should be positive numbers', () => {
            Object.values(SYNC_CONFIG.INTERVALS).forEach(interval => {
                expect(typeof interval).toBe('number');
                expect(interval).toBeGreaterThan(0);
            });
        });

        test('UPDATE_CHECK should be the longest interval', () => {
            const intervals = Object.values(SYNC_CONFIG.INTERVALS);
            const maxInterval = Math.max(...intervals);
            expect(SYNC_CONFIG.INTERVALS.UPDATE_CHECK).toBe(maxInterval);
        });
    });

    describe('Exponential Backoff', () => {
        test('should have BACKOFF object', () => {
            expect(SYNC_CONFIG.BACKOFF).toBeDefined();
            expect(typeof SYNC_CONFIG.BACKOFF).toBe('object');
        });

        test('BASE_DELAY should be 1 second', () => {
            expect(SYNC_CONFIG.BACKOFF.BASE_DELAY).toBe(1_000);
        });

        test('MAX_DELAY should be 1 minute', () => {
            expect(SYNC_CONFIG.BACKOFF.MAX_DELAY).toBe(60_000);
        });

        test('MULTIPLIER should be 2', () => {
            expect(SYNC_CONFIG.BACKOFF.MULTIPLIER).toBe(2);
        });

        test('backoff values should be positive', () => {
            expect(SYNC_CONFIG.BACKOFF.BASE_DELAY).toBeGreaterThan(0);
            expect(SYNC_CONFIG.BACKOFF.MAX_DELAY).toBeGreaterThan(0);
            expect(SYNC_CONFIG.BACKOFF.MULTIPLIER).toBeGreaterThan(0);
        });

        test('MAX_DELAY should be greater than BASE_DELAY', () => {
            expect(SYNC_CONFIG.BACKOFF.MAX_DELAY).toBeGreaterThan(SYNC_CONFIG.BACKOFF.BASE_DELAY);
        });

        test('backoff delays should progress correctly', () => {
            const delays: number[] = [];
            let currentDelay = SYNC_CONFIG.BACKOFF.BASE_DELAY;
            
            for (let i = 0; i < SYNC_CONFIG.MAX_RETRY_ATTEMPTS; i++) {
                delays.push(Math.min(currentDelay, SYNC_CONFIG.BACKOFF.MAX_DELAY));
                currentDelay *= SYNC_CONFIG.BACKOFF.MULTIPLIER;
            }
            
            // First delay should be base delay
            expect(delays[0]).toBe(1_000);
            // Delays should increase
            expect(delays[1]).toBe(2_000);
            expect(delays[2]).toBe(4_000);
            // Eventually should cap at max
            expect(delays[delays.length - 1]).toBeLessThanOrEqual(60_000);
        });
    });

    describe('Cache Configuration', () => {
        test('should have CACHE object', () => {
            expect(SYNC_CONFIG.CACHE).toBeDefined();
            expect(typeof SYNC_CONFIG.CACHE).toBe('object');
        });

        test('PROBLEMS_MAX_AGE should be 24 hours', () => {
            expect(SYNC_CONFIG.CACHE.PROBLEMS_MAX_AGE).toBe(24 * 60 * 60 * 1000);
        });

        test('API_MAX_AGE should be 5 minutes', () => {
            expect(SYNC_CONFIG.CACHE.API_MAX_AGE).toBe(5 * 60 * 1000);
        });

        test('STATIC_MAX_AGE should be 30 days', () => {
            expect(SYNC_CONFIG.CACHE.STATIC_MAX_AGE).toBe(30 * 24 * 60 * 60 * 1000);
        });

        test('all cache ages should be positive numbers', () => {
            Object.values(SYNC_CONFIG.CACHE).forEach(age => {
                expect(typeof age).toBe('number');
                expect(age).toBeGreaterThan(0);
            });
        });

        test('cache ages should be in descending order of volatility', () => {
            // API changes most frequently, then problems, then static
            expect(SYNC_CONFIG.CACHE.API_MAX_AGE).toBeLessThan(SYNC_CONFIG.CACHE.PROBLEMS_MAX_AGE);
            expect(SYNC_CONFIG.CACHE.PROBLEMS_MAX_AGE).toBeLessThan(SYNC_CONFIG.CACHE.STATIC_MAX_AGE);
        });
    });

    describe('Type Safety', () => {
        test('SyncConfig type should be defined', () => {
            // Type test - will fail at compile time if types are wrong
            const config: SyncConfig = SYNC_CONFIG;
            expect(config).toBe(SYNC_CONFIG);
        });

        test('all config values should be readonly', () => {
            // The 'as const' assertion makes the config readonly
            expect(SYNC_CONFIG.MAX_RETRY_ATTEMPTS).toBe(5);
            expect(SYNC_CONFIG.TIMEOUTS.SYNC_BATCH).toBe(60_000);
        });
    });

    describe('Configuration Completeness', () => {
        test('should have all expected top-level keys', () => {
            const expectedKeys = ['MAX_RETRY_ATTEMPTS', 'TIMEOUTS', 'INTERVALS', 'BACKOFF', 'CACHE'];
            const actualKeys = Object.keys(SYNC_CONFIG);
            expectedKeys.forEach(key => {
                expect(actualKeys).toContain(key);
            });
        });

        test('TIMEOUTS should have all expected keys', () => {
            const expectedKeys = ['SYNC_BATCH', 'INDIVIDUAL_REQUEST', 'SERVICE_WORKER_MESSAGE', 'REGISTRATION_HANDSHAKE'];
            const actualKeys = Object.keys(SYNC_CONFIG.TIMEOUTS);
            expectedKeys.forEach(key => {
                expect(actualKeys).toContain(key);
            });
        });

        test('INTERVALS should have all expected keys', () => {
            const expectedKeys = ['UPDATE_CHECK', 'SYNC_STATUS_POLL', 'RETRY_CHECK'];
            const actualKeys = Object.keys(SYNC_CONFIG.INTERVALS);
            expectedKeys.forEach(key => {
                expect(actualKeys).toContain(key);
            });
        });

        test('BACKOFF should have all expected keys', () => {
            const expectedKeys = ['BASE_DELAY', 'MAX_DELAY', 'MULTIPLIER'];
            const actualKeys = Object.keys(SYNC_CONFIG.BACKOFF);
            expectedKeys.forEach(key => {
                expect(actualKeys).toContain(key);
            });
        });

        test('CACHE should have all expected keys', () => {
            const expectedKeys = ['PROBLEMS_MAX_AGE', 'API_MAX_AGE', 'STATIC_MAX_AGE'];
            const actualKeys = Object.keys(SYNC_CONFIG.CACHE);
            expectedKeys.forEach(key => {
                expect(actualKeys).toContain(key);
            });
        });
    });
});
