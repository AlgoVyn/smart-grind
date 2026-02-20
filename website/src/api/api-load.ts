// --- API LOAD MODULE ---
// Data loading operations

import { UserData, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
// renderers import removed to break cycle
import { syncPlan, mergeStructure } from './api-sync';
import { validateResponseOrigin, getErrorMessage } from './api-utils';

/**
 * Gets response text with automatic decompression handling.
 */
async function getResponseText(response: Response): Promise<string> {
    const contentEncoding = response.headers.get('Content-Encoding');

    if (!contentEncoding || contentEncoding === 'identity') {
        return response.text();
    }

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (bytes.length === 0) return '';

    const firstChar = bytes[0]!;
    if (firstChar === 0x7b || firstChar === 0x5b || (firstChar >= 32 && firstChar < 127)) {
        return new TextDecoder().decode(bytes);
    }

    try {
        let format: CompressionFormat;
        if (contentEncoding === 'gzip') format = 'gzip';
        else if (contentEncoding === 'deflate') format = 'deflate';
        else if (contentEncoding === 'br') format = 'br' as CompressionFormat;
        else return new TextDecoder().decode(bytes);

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
            if (!done && result.value) chunks.push(result.value);
        }

        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }

        return new TextDecoder().decode(result);
    } catch (_err) {
        return new TextDecoder().decode(bytes);
    }
}

/**
 * Handles API response errors by throwing appropriate error messages.
 */
export const _handleApiError = (response: Response): never => {
    throw new Error(
        getErrorMessage(response.status, `Failed to load data: ${response.statusText}`)
    );
};

/**
 * Processes the loaded user data and updates the application state.
 */
export const _processUserData = (userData: UserData): void => {
    state.problems = new Map(Object.entries(userData.problems || {}));
    state.problems.forEach((p: Problem) => {
        p.loading = false;
        p.noteVisible = false;
    });
    state.deletedProblemIds = new Set(userData.deletedIds || []);
};

/**
 * Initializes the UI components after data has been loaded.
 */
export const _initializeUI = async (): Promise<void> => {
    const { ui } = await import('../ui/ui');
    const { renderers } = await import('../renderers');
    renderers.renderSidebar();
    renderers.renderMainView('all');
    renderers.updateStats();
    ui.initScrollButton();

    state.elements.setupModal?.classList.add('hidden');
    state.elements.appWrapper?.classList.remove('hidden');
};

/**
 * Loads user data from the API and initializes the application.
 */
export const loadData = async (): Promise<void> => {
    const { loadingScreen, appWrapper } = state.elements;
    loadingScreen?.classList.remove('hidden');

    try {
        const response = await fetch(`${data.API_BASE}/user`, { credentials: 'include' });
        validateResponseOrigin(response);
        if (!response.ok) _handleApiError(response);

        const responseText = await getResponseText(response);
        const userData: UserData = JSON.parse(responseText);
        _processUserData(userData);

        data.resetTopicsData();
        await syncPlan();
        mergeStructure();

        await _initializeUI();
    } catch (e) {
        const { ui } = await import('../ui/ui');
        const message = e instanceof Error ? e.message : String(e);
        ui.showAlert(`Failed to load data: ${message}`);

        const isAuthError =
            message.includes('Authentication failed') ||
            message.includes('No authentication token');
        const modalEl = state.elements[isAuthError ? 'signinModal' : 'setupModal'];
        modalEl?.classList.remove('hidden');
        appWrapper?.classList.add('hidden');
    } finally {
        state.elements.loadingScreen?.classList.add('hidden');
    }
};
