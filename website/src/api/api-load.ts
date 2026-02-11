// --- API LOAD MODULE ---
// Data loading operations

import { UserData, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { renderers } from '../renderers';
import { ui } from '../ui/ui';
import { syncPlan, mergeStructure } from './api-sync';

/**
 * Gets response text with automatic decompression handling.
 * Browsers should auto-decompress, but we handle edge cases.
 */
async function getResponseText(response: Response): Promise<string> {
    const contentEncoding = response.headers.get('Content-Encoding');

    // No compression - just get text
    if (!contentEncoding || contentEncoding === 'identity') {
        return response.text();
    }

    // Read as arrayBuffer first to handle binary data properly
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check if data looks like JSON (starts with { or [)
    // or if it's plain text (printable ASCII)
    if (bytes.length === 0) {
        return '';
    }
    const firstChar = bytes[0]!;
    if (firstChar === 0x7b || firstChar === 0x5b || (firstChar >= 32 && firstChar < 127)) {
        // Looks like uncompressed text/JSON
        return new TextDecoder().decode(bytes);
    }

    // Data appears compressed, try manual decompression
    try {
        // Handle all supported compression formats including Brotli
        let format: CompressionFormat;
        if (contentEncoding === 'gzip') {
            format = 'gzip';
        } else if (contentEncoding === 'deflate') {
            format = 'deflate';
        } else if (contentEncoding === 'br') {
            // Brotli compression - supported by modern browsers
            format = 'br' as CompressionFormat;
        } else {
            // Unknown encoding - return as text and let it fail clearly
            return new TextDecoder().decode(bytes);
        }

        // Create stream from buffer
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(bytes);
                controller.close();
            },
        });

        const ds = new DecompressionStream(format);
        const decompressedStream = stream.pipeThrough(ds);
        const reader = decompressedStream.getReader();
        const chunks: Uint8Array[] = [];
        let done = false;

        while (!done) {
            const result = await reader.read();
            done = result.done;
            if (!done && result.value) {
                chunks.push(result.value);
            }
        }

        // Combine chunks
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }

        return new TextDecoder().decode(result);
    } catch (err) {
        console.warn('Manual decompression failed:', err);
        // Return as text even if it looks wrong
        return new TextDecoder().decode(bytes);
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
        // Browser automatically handles decompression based on Content-Encoding
        const response = await fetch(`${data.API_BASE}/user`, {
            credentials: 'include',
        });
        _validateResponseOrigin(response);
        if (!response.ok) _handleApiError(response);

        // Handle response - browser automatically decompresses
        const responseText = await getResponseText(response);
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
