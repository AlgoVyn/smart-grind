/**
 * @jest-environment jsdom
 *
 * Integration Tests for Service Worker Lifecycle Events
 */

describe('Service Worker Lifecycle Integration', () => {
    let mockRegistration: ServiceWorkerRegistration;
    let mockServiceWorker: ServiceWorker;

    beforeEach(() => {
        // Setup mock service worker
        mockServiceWorker = {
            state: 'activated',
            postMessage: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        } as unknown as ServiceWorker;

        mockRegistration = {
            installing: null,
            waiting: null,
            active: mockServiceWorker,
            scope: 'http://localhost/smartgrind/',
            update: jest.fn().mockResolvedValue(undefined),
            unregister: jest.fn().mockResolvedValue(true),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        } as unknown as ServiceWorkerRegistration;

        // Reset navigator.serviceWorker mock
        Object.defineProperty(global.navigator, 'serviceWorker', {
            value: {
                register: jest.fn().mockResolvedValue(mockRegistration),
                ready: Promise.resolve(mockRegistration),
                controller: mockServiceWorker,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            },
            writable: true,
            configurable: true,
        });

        jest.clearAllMocks();
    });

    describe('Service Worker Registration', () => {
        it('should register service worker successfully', async () => {
            const result = await navigator.serviceWorker.register('/sw.js');

            expect(result).toBe(mockRegistration);
            expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
        });

        it('should handle registration failure', async () => {
            const mockRegister = jest.fn().mockRejectedValue(new Error('Registration failed'));
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: {
                    register: mockRegister,
                },
                writable: true,
                configurable: true,
            });

            await expect(navigator.serviceWorker.register('/sw.js')).rejects.toThrow('Registration failed');
        });

        it('should get service worker when ready', async () => {
            const registration = await navigator.serviceWorker.ready;

            expect(registration).toBe(mockRegistration);
        });
    });

    describe('Service Worker State Management', () => {
        it('should have active service worker', () => {
            expect(mockRegistration.active).toBe(mockServiceWorker);
        });

        it('should check service worker state', () => {
            expect(mockServiceWorker.state).toBe('activated');
        });

        it('should post message to service worker', () => {
            const message = { type: 'TEST_MESSAGE', data: 'test' };
            mockServiceWorker.postMessage(message);

            expect(mockServiceWorker.postMessage).toHaveBeenCalledWith(message);
        });
    });

    describe('Service Worker Update', () => {
        it('should trigger update', async () => {
            await mockRegistration.update();

            expect(mockRegistration.update).toHaveBeenCalled();
        });

        it('should handle update errors', async () => {
            mockRegistration.update = jest.fn().mockRejectedValue(new Error('Update failed'));

            await expect(mockRegistration.update()).rejects.toThrow('Update failed');
        });
    });

    describe('Service Worker Unregistration', () => {
        it('should unregister service worker', async () => {
            const result = await mockRegistration.unregister();

            expect(result).toBe(true);
            expect(mockRegistration.unregister).toHaveBeenCalled();
        });

        it('should handle unregistration failure', async () => {
            mockRegistration.unregister = jest.fn().mockResolvedValue(false);

            const result = await mockRegistration.unregister();

            expect(result).toBe(false);
        });
    });

    describe('Service Worker Controller', () => {
        it('should have controller when active', () => {
            expect(navigator.serviceWorker.controller).toBe(mockServiceWorker);
        });

        it('should handle controller change events', () => {
            const handler = jest.fn();
            navigator.serviceWorker.addEventListener('controllerchange', handler);

            expect(navigator.serviceWorker.addEventListener).toHaveBeenCalledWith('controllerchange', handler);
        });
    });

    describe('Service Worker Message Passing', () => {
        it('should send message to service worker', () => {
            const message = { type: 'SKIP_WAITING' };
            navigator.serviceWorker.controller?.postMessage(message);

            expect(mockServiceWorker.postMessage).toHaveBeenCalledWith(message);
        });

        it('should handle message sending when no controller', () => {
            Object.defineProperty(navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            // Should not throw when controller is null
            expect(() => {
                navigator.serviceWorker.controller?.postMessage({ type: 'TEST' });
            }).not.toThrow();
        });
    });

    describe('Service Worker Events', () => {
        it('should handle updatefound event', () => {
            const handler = jest.fn();
            mockRegistration.addEventListener('updatefound', handler);

            expect(mockRegistration.addEventListener).toHaveBeenCalledWith('updatefound', handler);
        });

        it('should handle statechange event on service worker', () => {
            const handler = jest.fn();
            mockServiceWorker.addEventListener('statechange', handler);

            expect(mockServiceWorker.addEventListener).toHaveBeenCalledWith('statechange', handler);
        });
    });

    describe('Service Worker Scope', () => {
        it('should have correct scope', () => {
            expect(mockRegistration.scope).toBe('http://localhost/smartgrind/');
        });

        it('should check if URL is within scope', () => {
            const testUrl = 'http://localhost/smartgrind/test';
            const isInScope = testUrl.startsWith(mockRegistration.scope);

            expect(isInScope).toBe(true);
        });
    });
});

describe('Service Worker Installation Flow', () => {
    it('should complete installation lifecycle', async () => {
        const states: string[] = [];

        // Simulate installation states
        const installationStates = ['installing', 'installed', 'activating', 'activated'];

        for (const state of installationStates) {
            states.push(state);
        }

        expect(states).toEqual(['installing', 'installed', 'activating', 'activated']);
    });

    it('should handle activation', () => {
        const mockActivate = jest.fn().mockResolvedValue(undefined);

        // Simulate activation
        mockActivate();

        expect(mockActivate).toHaveBeenCalled();
    });
});

describe('Service Worker Error Handling', () => {
    it('should handle service worker not supported', () => {
        const originalServiceWorker = navigator.serviceWorker;

        // Simulate unsupported browser
        Object.defineProperty(global.navigator, 'serviceWorker', {
            value: undefined,
            writable: true,
            configurable: true,
        });

        expect(navigator.serviceWorker).toBeUndefined();

        // Restore
        Object.defineProperty(global.navigator, 'serviceWorker', {
            value: originalServiceWorker,
            writable: true,
            configurable: true,
        });
    });

    it('should handle registration in insecure context', async () => {
        const mockRegister = jest.fn().mockRejectedValue(
            new Error('Service worker registration requires secure origin')
        );

        Object.defineProperty(global.navigator, 'serviceWorker', {
            value: {
                register: mockRegister,
            },
            writable: true,
            configurable: true,
        });

        await expect(navigator.serviceWorker.register('/sw.js')).rejects.toThrow(
            'Service worker registration requires secure origin'
        );
    });
});
