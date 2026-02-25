// --- SERVICE WORKER MESSAGING MODULE ---
// Centralized service worker communication with timeout handling

import { SYNC_CONFIG } from '../config/sync-config';
import { APIOperation } from '../types/sync';

/**
 * Service Worker message interface
 */
interface SWMessage {
    type: string;
    data?: unknown;
    operations?: APIOperation[];
}

/**
 * Creates a timeout promise for service worker operations
 * @param ms - Timeout in milliseconds
 * @param messageType - Type of message for error context
 * @returns Promise that rejects after timeout
 */
const createTimeoutPromise = (ms: number, messageType: string): Promise<never> => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Service Worker message timed out type=${messageType}`));
        }, ms);
    });
};

/**
 * Sends a message to the service worker with timeout handling
 * @param message - Message to send to the service worker
 * @returns Response from service worker or null if unavailable
 */
export async function sendMessageToSW(message: SWMessage): Promise<unknown> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) {
        return null;
    }

    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) {
        return null;
    }

    const messagePromise = new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => resolve(event.data);
        try {
            registration.active?.postMessage(message, [channel.port2]);
        } catch (error) {
            reject(error);
        }
    });

    const timeoutPromise = createTimeoutPromise(
        SYNC_CONFIG.TIMEOUTS.SERVICE_WORKER_MESSAGE,
        message.type
    );

    return Promise.race([messagePromise, timeoutPromise]);
}

/**
 * Checks if service worker is available
 * @returns true if service worker is supported and registered
 */
export function isServiceWorkerAvailable(): boolean {
    return 'serviceWorker' in navigator && !!navigator.serviceWorker;
}

/**
 * Gets the active service worker registration
 * @returns ServiceWorkerRegistration or null if unavailable
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (!isServiceWorkerAvailable()) {
        return null;
    }
    return navigator.serviceWorker.ready;
}
