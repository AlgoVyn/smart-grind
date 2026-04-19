// --- API LOAD MODULE ---
// Data loading operations

import { UserData, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { syncPlan, mergeStructure } from './api-sync';
import { validateResponseOrigin, getErrorMessage } from './api-utils';
import { showAlert } from '../ui/ui-modals';
import { renderers } from '../renderers';
import { initScrollButton } from '../ui/ui-scroll';
import { hideEl, showEl } from '../utils';

/**
 * Gets response text with automatic decompression handling.
 * Supports gzip, deflate, and brotli compression formats.
 * Automatically detects uncompressed responses and handles them appropriately.
 * @param response - The fetch Response object to process
 * @returns Promise resolving to the decompressed response text
 */
export async function _getResponseText(response: Response): Promise<string> {
    const contentEncoding = response.headers.get('Content-Encoding');

    if (!contentEncoding || contentEncoding === 'identity') {
        return response.text();
    }

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (bytes.length === 0) return '';

    // Check if already uncompressed (JSON starts with { or [, or ASCII text)
    const firstChar = bytes[0]!;
    if (firstChar === 0x7b || firstChar === 0x5b || (firstChar >= 32 && firstChar < 127)) {
        return new TextDecoder().decode(bytes);
    }

    // Map content encoding to compression format
    const formatMap: Record<string, CompressionFormat | undefined> = {
        gzip: 'gzip',
        deflate: 'deflate',
        br: 'br' as CompressionFormat,
    };
    const format = formatMap[contentEncoding];
    if (!format) return new TextDecoder().decode(bytes);

    try {
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(bytes);
                controller.close();
            },
        });

        const ds = new DecompressionStream(format);
        const reader = stream.pipeThrough(ds).getReader();
        const chunks: Uint8Array[] = [];

        // Read all chunks from the decompression stream
        let readResult = await reader.read();
        while (!readResult.done) {
            if (readResult.value) chunks.push(readResult.value);
            readResult = await reader.read();
        }

        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }

        return new TextDecoder().decode(result);
    } catch {
        return new TextDecoder().decode(bytes);
    }
}

/**
 * Handles API response errors by throwing appropriate error messages.
 * Maps HTTP status codes to user-friendly error messages.
 * @param response - The fetch Response object with an error status
 * @throws {Error} Always throws an error with a descriptive message
 */
export const _handleApiError = (response: Response): never => {
    throw new Error(
        getErrorMessage(response.status, `Failed to load data: ${response.statusText}`)
    );
};

/**
 * Processes the loaded user data and updates the application state.
 * Preserves existing local state when offline to prevent data loss.
 * Normalizes problem data by setting UI-specific flags (loading, noteVisible).
 * @param userData - The user data object containing problems and deletedIds
 * @param isOfflineFallback - Whether this is an offline fallback load (preserves local state if true)
 */
export const _processUserData = (userData: UserData, isOfflineFallback = false): void => {
    // If we're using offline fallback and already have local data, preserve it
    if (isOfflineFallback && state.problems.size > 0) {
        console.log('[API Load] Preserving local state during offline reload');
        return;
    }

    const problemsMap = new Map(Object.entries(userData.problems || {}));
    problemsMap.forEach((p: Problem) => {
        p.loading = false;
        p.noteVisible = false;
    });
    state.replaceProblems(problemsMap);
    state.replaceDeletedIds(new Set(userData.deletedIds || []));
};

/**
 * Initializes the UI components after data has been loaded.
 * Renders the sidebar, main view, and statistics. Shows the appropriate
 * view based on current navigation state (category selected or combined view).
 */
export const _initializeUI = async (): Promise<void> => {
    renderers.renderSidebar();
    // Check if any specific category is selected, otherwise show combined view
    const hasActiveCategory =
        state.ui.activeTopicId ||
        state.ui.activeAlgorithmCategoryId ||
        state.ui.activeSQLCategoryId;
    if (hasActiveCategory) {
        renderers.renderMainView(state.ui.activeTopicId || 'all');
    } else {
        renderers.renderCombinedView();
    }
    renderers.updateStats();
    initScrollButton();

    hideEl(state.elements['setupModal']);
    showEl(state.elements['appWrapper']);
};

/**
 * Loads user data from the API and initializes the application.
 *
 * This is the main entry point for application initialization. It:
 * 1. Shows the loading screen
 * 2. Fetches user data from the remote API with credentials
 * 3. Processes and normalizes the loaded data
 * 4. Syncs the problem plan and merges structure
 * 5. Initializes the UI components
 *
 * Falls back to localStorage data when offline to preserve state.
 * Handles authentication errors by showing the sign-in modal.
 *
 * @returns Promise that resolves when loading and initialization complete
 * @throws {Error} Does not throw - errors are handled internally with user alerts
 */
export const loadData = async (): Promise<void> => {
    const loadingScreen = state.elements['loadingScreen'] as HTMLElement | null;
    const appWrapper = state.elements['appWrapper'] as HTMLElement | null;
    showEl(loadingScreen);

    try {
        const response = await fetch(`${data.API_BASE}/user`, { credentials: 'include' });
        validateResponseOrigin(response);
        if (!response.ok) _handleApiError(response);

        const responseText = await _getResponseText(response);
        const userData: UserData = JSON.parse(responseText);
        _processUserData(userData, false);

        data.resetTopicsData();
        await syncPlan();
        mergeStructure();

        await _initializeUI();
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const isNetworkError =
            message.includes('fetch') || message.includes('network') || !navigator.onLine;

        // If network error and we have local data, preserve it and continue
        if (isNetworkError && state.problems.size > 0) {
            console.log('[API Load] Network error - preserving local state');
            // Don't show error alert for offline mode with existing data
            data.resetTopicsData();
            await syncPlan();
            mergeStructure();
            await _initializeUI();
            return;
        }

        showAlert(`Failed to load data: ${message}`);

        const isAuthError =
            message.includes('Authentication failed') ||
            message.includes('No authentication token');
        const modalEl = state.elements[
            isAuthError ? 'signinModal' : 'setupModal'
        ] as HTMLElement | null;
        showEl(modalEl);
        hideEl(appWrapper);
    } finally {
        hideEl(state.elements['loadingScreen']);
    }
};
