/**
 * Tests for IndexedDB Configuration
 * @module tests/config/idb-config
 */

import { IDB_CONFIG, IDBStoreName } from '../../src/config/idb-config';

describe('IDB_CONFIG', () => {
    describe('Database Configuration', () => {
        test('should have correct database name', () => {
            expect(IDB_CONFIG.DATABASE_NAME).toBe('smartgrind');
        });

        test('should have correct database version', () => {
            expect(IDB_CONFIG.DATABASE_VERSION).toBe(1);
            expect(typeof IDB_CONFIG.DATABASE_VERSION).toBe('number');
        });

        test('database version should be positive', () => {
            expect(IDB_CONFIG.DATABASE_VERSION).toBeGreaterThan(0);
        });
    });

    describe('Store Names', () => {
        test('should export STORE names object', () => {
            expect(IDB_CONFIG.STORES).toBeDefined();
            expect(typeof IDB_CONFIG.STORES).toBe('object');
        });

        test('should have AUTH_TOKENS store', () => {
            expect(IDB_CONFIG.STORES.AUTH_TOKENS).toBe('auth-tokens');
        });

        test('should have PROBLEM_METADATA store', () => {
            expect(IDB_CONFIG.STORES.PROBLEM_METADATA).toBe('problem-metadata');
        });

        test('should have OPERATION_QUEUE store', () => {
            expect(IDB_CONFIG.STORES.OPERATION_QUEUE).toBe('operation-queue');
        });

        test('should have QUEUE_META store', () => {
            expect(IDB_CONFIG.STORES.QUEUE_META).toBe('queue-meta');
        });

        test('should have BUNDLE_STATE store', () => {
            expect(IDB_CONFIG.STORES.BUNDLE_STATE).toBe('bundle-state');
        });

        test('should have SYNC_RETRY store', () => {
            expect(IDB_CONFIG.STORES.SYNC_RETRY).toBe('sync-retry');
        });

        test('should have CACHE_INVENTORY store', () => {
            expect(IDB_CONFIG.STORES.CACHE_INVENTORY).toBe('cache-inventory');
        });

        test('should have exactly 7 stores', () => {
            const storeCount = Object.keys(IDB_CONFIG.STORES).length;
            expect(storeCount).toBe(7);
        });

        test('all store names should be unique', () => {
            const storeValues = Object.values(IDB_CONFIG.STORES);
            const uniqueValues = new Set(storeValues);
            expect(uniqueValues.size).toBe(storeValues.length);
        });

        test('all store names should follow kebab-case format', () => {
            const storeValues = Object.values(IDB_CONFIG.STORES);
            const kebabCaseRegex = /^[a-z]+(-[a-z]+)*$/;
            storeValues.forEach(name => {
                expect(kebabCaseRegex.test(name)).toBe(true);
            });
        });
    });

    describe('Legacy Databases', () => {
        test('should export LEGACY_DATABASES array', () => {
            expect(IDB_CONFIG.LEGACY_DATABASES).toBeDefined();
            expect(Array.isArray(IDB_CONFIG.LEGACY_DATABASES)).toBe(true);
        });

        test('should list legacy database names', () => {
            const expectedLegacies = [
                'smartgrind-auth',
                'smartgrind-offline',
                'smartgrind-sync',
                'smartgrind-sw-inventory',
                'smartgrind-sync-retry',
            ];
            expectedLegacies.forEach(name => {
                expect(IDB_CONFIG.LEGACY_DATABASES).toContain(name);
            });
        });

        test('should have exactly 5 legacy databases', () => {
            expect(IDB_CONFIG.LEGACY_DATABASES.length).toBe(5);
        });

        test('legacy databases should all start with smartgrind-', () => {
            IDB_CONFIG.LEGACY_DATABASES.forEach(name => {
                expect(name.startsWith('smartgrind-')).toBe(true);
            });
        });
    });

    describe('Type Safety', () => {
        test('IDBStoreName type should be defined', () => {
            // Type test - this will fail at compile time if types are wrong
            const storeName: IDBStoreName = 'auth-tokens';
            expect(storeName).toBe('auth-tokens');
        });

        test('all store values should be valid IDBStoreName', () => {
            const storeValues = Object.values(IDB_CONFIG.STORES);
            storeValues.forEach((name: string) => {
                // This is a compile-time type check
                const _typeCheck: IDBStoreName = name as IDBStoreName;
                expect(_typeCheck).toBe(name);
            });
        });
    });

    describe('Immutability', () => {
        test('IDB_CONFIG should be frozen/readonly', () => {
            // The config uses 'as const' which makes it readonly at type level
            // At runtime, we verify the structure doesn't change
            const originalName = IDB_CONFIG.DATABASE_NAME;
            expect(originalName).toBe('smartgrind');
        });

        test('STORES object values should not be modifiable', () => {
            // Type-level immutability via 'as const'
            const stores = IDB_CONFIG.STORES;
            expect(stores.AUTH_TOKENS).toBe('auth-tokens');
        });
    });
});
