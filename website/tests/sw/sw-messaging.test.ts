/**
 * @jest-environment jsdom
 */

import {
    sendMessageToSW,
    isServiceWorkerAvailable,
    getServiceWorkerRegistration,
} from '../../src/sw/sw-messaging';
import { SYNC_CONFIG } from '../../src/config/sync-config';

describe('SW Messaging', () => {
    let mockController: {
        postMessage: jest.Mock;
        state: string;
    };
    let mockRegistration: {
        active: typeof mockController | null;
        installing: null;
        waiting: null;
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockController = {
            postMessage: jest.fn(),
            state: 'activated',
        };

        mockRegistration = {
            active: mockController,
            installing: null,
            waiting: null,
        };

        // Reset navigator.serviceWorker mock
        Object.defineProperty(navigator, 'serviceWorker', {
            value: {
                ready: Promise.resolve(mockRegistration),
                controller: mockController,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            },
            writable: true,
            configurable: true,
        });
    });

    describe('isServiceWorkerAvailable', () => {
        it('should return true when serviceWorker is available', () => {
            expect(isServiceWorkerAvailable()).toBe(true);
        });

        it('should return false when serviceWorker is not in navigator', () => {
            Object.defineProperty(navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            expect(isServiceWorkerAvailable()).toBe(false);
        });

        it('should return false when navigator.serviceWorker is null', () => {
            Object.defineProperty(navigator, 'serviceWorker', {
                value: null,
                writable: true,
                configurable: true,
            });

            expect(isServiceWorkerAvailable()).toBe(false);
        });
    });

    describe('getServiceWorkerRegistration', () => {
        it('should return registration when service worker is available', async () => {
            const result = await getServiceWorkerRegistration();
            
            expect(result).toBe(mockRegistration);
        });

        it('should return null when serviceWorker is not available', async () => {
            Object.defineProperty(navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            const result = await getServiceWorkerRegistration();
            
            expect(result).toBeNull();
        });
    });

    describe('sendMessageToSW', () => {
        it('should send message and receive response', async () => {
            const message = { type: 'TEST_MESSAGE', data: { test: true } };
            const expectedResponse = { success: true, data: 'response' };

            mockController.postMessage.mockImplementation((msg, transfer) => {
                const port = transfer[0];
                // Simulate response immediately for test stability
                port.postMessage(expectedResponse);
            });

            const result = await sendMessageToSW(message);
            
            expect(mockController.postMessage).toHaveBeenCalledWith(
                message,
                expect.arrayContaining([expect.anything()])
            );
            expect(result).toEqual(expectedResponse);
        });

        it('should return null when serviceWorker is not available', async () => {
            Object.defineProperty(navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            const result = await sendMessageToSW({ type: 'TEST' });
            
            expect(result).toBeNull();
        });

        it('should return null when no active service worker', async () => {
            mockRegistration.active = null;

            const result = await sendMessageToSW({ type: 'TEST' });
            
            expect(result).toBeNull();
        });

        it('should reject when postMessage throws', async () => {
            mockController.postMessage.mockImplementation(() => {
                throw new Error('Post message failed');
            });

            await expect(sendMessageToSW({ type: 'TEST' })).rejects.toThrow('Post message failed');
        });

        it('should handle message with operations array', async () => {
            const message = {
                type: 'QUEUE_OPERATIONS',
                operations: [
                    { type: 'MARK_SOLVED', data: { problemId: '1' }, timestamp: Date.now() },
                ],
            };

            mockController.postMessage.mockImplementation((msg, transfer) => {
                const port = transfer[0];
                port.postMessage({ queued: true, count: 1 });
            });

            const result = await sendMessageToSW(message);
            
            expect(result).toEqual({ queued: true, count: 1 });
        });

        it('should handle message with data property', async () => {
            const message = {
                type: 'SYNC_REQUEST',
                data: { force: true, priority: 'high' },
            };

            mockController.postMessage.mockImplementation((msg, transfer) => {
                const port = transfer[0];
                port.postMessage({ success: true, synced: 5 });
            });

            const result = await sendMessageToSW(message);
            
            expect(result).toEqual({ success: true, synced: 5 });
        });

        it('should handle empty message', async () => {
            const message = { type: 'EMPTY_TEST' };

            mockController.postMessage.mockImplementation((msg, transfer) => {
                const port = transfer[0];
                port.postMessage({ received: true });
            });

            const result = await sendMessageToSW(message);
            
            expect(result).toEqual({ received: true });
        });
    });

    describe('Edge cases', () => {
        it('should handle ready promise rejection', async () => {
            Object.defineProperty(navigator, 'serviceWorker', {
                value: {
                    ready: Promise.reject(new Error('SW registration failed')),
                },
                writable: true,
                configurable: true,
            });

            await expect(getServiceWorkerRegistration()).rejects.toThrow('SW registration failed');
        });
    });
});
