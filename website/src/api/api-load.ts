// --- API LOAD MODULE ---
// Data loading operations

import { UserData, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { renderers } from '../renderers';
import { ui } from '../ui/ui';
import { syncPlan, mergeStructure } from './api-sync';

/**
 * Decompresses response data if it's compressed
 * Handles Brotli, gzip, and deflate-raw compression
 */
async function decompressResponse(response: Response): Promise<string> {
    const contentEncoding = response.headers.get('Content-Encoding');

    // If no compression, return text directly
    if (!contentEncoding || contentEncoding === 'identity') {
        return response.text();
    }

    try {
        // Get the response body as a stream
        const body = response.body;
        if (!body) {
            return response.text();
        }

        // Create decompression stream based on encoding
        let decompressionStream: DecompressionStream;
        if (contentEncoding === 'br') {
            decompressionStream = new DecompressionStream('br' as CompressionFormat);
        } else if (contentEncoding === 'gzip') {
            decompressionStream = new DecompressionStream('gzip');
        } else if (contentEncoding === 'deflate') {
            decompressionStream = new DecompressionStream('deflate');
        } else {
            // Unknown encoding, try text
            return response.text();
        }

        // Decompress the stream
        const decompressedStream = body.pipeThrough(decompressionStream);
        const reader = decompressedStream.getReader();
        const chunks: Uint8Array[] = [];

        let done = false;
        while (!done) {
            const result = await reader.read();
            done = result.done;
            if (result.value) {
                chunks.push(result.value);
            }
        }

        // Combine chunks and decode
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const decompressed = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            decompressed.set(chunk, offset);
            offset += chunk.length;
        }

        return new TextDecoder().decode(decompressed);
    } catch (error) {
        console.warn('Decompression failed, falling back to text:', error);
        // Fallback to text if decompression fails
        return response.text();
    }
}

/**
 * Validates that the API response originates from the expected origin
 * @param response - The fetch response to validate
 */
const _validateResponseOrigin = (response: Response): void => {
    const allowedOrigins = [
        window.location.origin,
        'https://smartgrind.com',
        'https://www.smartgrind.com',
    ];

    const responseOrigin = response.headers.get('Origin') || response.url;

    // For same-origin requests, no additional validation needed
    if (response.url.startsWith(window.location.origin)) {
        return;
    }

    // Validate cross-origin responses
    if (!allowedOrigins.some((origin) => responseOrigin.includes(origin))) {
        console.warn('Response from unexpected origin:', responseOrigin);
    }
};

/**
 * Handles API response errors by throwing appropriate error messages.
 * @param {Response} response - The fetch response object.
 * @throws {Error} Throws an error with a user-friendly message based on status.
 */
export const _handleApiError = (response: Response): never => {
    const errorMap: Record<number, string> = {
        401: 'Authentication failed. Please sign in again.',
        404: 'User data not found. Starting with fresh data.',
        500: 'Server error. Please try again later.',
    };
    throw new Error(errorMap[response.status] || `Failed to load data: ${response.statusText}`);
};

/**
 * Processes the loaded user data and updates the application state.
 * @param {Object} userData - The user data object from the API.
 * @param {Object} userData.problems - Map of problem IDs to problem objects.
 * @param {string[]} userData.deletedIds - Array of deleted problem IDs.
 */
export const _processUserData = (userData: UserData): void => {
    state.problems = new Map(Object.entries(userData.problems || {}));
    state.problems.forEach((p: Problem) => {
        p.loading = false;
        // Reset note visibility to ensure notes are closed by default on page reload
        p.noteVisible = false;
    });
    state.deletedProblemIds = new Set(userData.deletedIds || []);
};

/**
 * Initializes the UI components after data has been loaded.
 * Renders sidebar, main view, updates stats, and hides loading screen.
 */
export const _initializeUI = () => {
    renderers.renderSidebar();
    renderers.renderMainView('all');
    renderers.updateStats();
    ui.initScrollButton();
    const setupModal = state.elements['setupModal'];
    const appWrapper = state.elements['appWrapper'];
    if (setupModal) {
        setupModal.classList.add('hidden');
    }
    if (appWrapper) {
        appWrapper.classList.remove('hidden');
    }
};

/**
 * Loads user data from the API and initializes the application.
 * Handles authentication, data processing, syncing, and UI initialization.
 * @throws {Error} Throws an error if loading fails.
 */
export const loadData = async (): Promise<void> => {
    const loadingScreen = state.elements['loadingScreen'];
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }

    try {
        const response = await fetch(`${data.API_BASE}/user`, {
            credentials: 'include',
        });
        _validateResponseOrigin(response);
        if (!response.ok) _handleApiError(response);

        // Handle potentially compressed response
        const responseText = await decompressResponse(response);
        const userData: UserData = JSON.parse(responseText);
        _processUserData(userData);

        data.resetTopicsData();
        await syncPlan();
        mergeStructure();

        _initializeUI();
    } catch (e) {
        console.error('Load data error:', e);
        const message = e instanceof Error ? e.message : String(e);
        ui.showAlert(`Failed to load data: ${message}`);
        const isAuthError =
            message.includes('Authentication failed') ||
            message.includes('No authentication token');
        const modalEl = state.elements[isAuthError ? 'signinModal' : 'setupModal'];
        if (modalEl) {
            modalEl.classList.remove('hidden');
        }
        const appWrapper = state.elements['appWrapper'];
        if (appWrapper) {
            appWrapper.classList.add('hidden');
        }
    } finally {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }
};
