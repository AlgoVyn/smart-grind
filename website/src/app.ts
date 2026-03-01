// --- APP MODULE ---
// Additional app-level functions

import { state } from './state';
import { data } from './data';
import { api } from './api';
import { renderers } from './renderers';
import { ui } from './ui/ui';
import { showToast } from './utils';
import { fetchCsrfToken, getCsrfToken, getCachedCsrfToken, clearCsrfToken } from './utils/csrf';
import type { Problem } from './types';

// Re-export CSRF functions for backward compatibility
export { fetchCsrfToken, getCsrfToken, getCachedCsrfToken, clearCsrfToken };

// Export data limits for sanitization
const EXPORT_LIMITS = {
    /** Maximum length for string values in exported data (10KB) */
    MAX_STRING_LENGTH: 10000,
    /** Maximum length for object keys in exported data */
    MAX_KEY_LENGTH: 100,
} as const;

// Control characters regex: matches ASCII control characters (0x00-0x1F) and DEL (0x7F)
const CONTROL_CHARS_REGEX = /[\x00-\x1F\x7F]/g;
// Safe key regex: only allows word characters, whitespace, and hyphens
const SAFE_KEY_REGEX = /[^\w\s-]/g;

// Initialize local user
export const initializeLocalUser = async (): Promise<void> => {
    state.user.type = 'local';
    localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');

    state.loadFromStorage();
    const displayName = state.user.displayName;
    const userDisplay = state.elements['userDisplay'];
    if (userDisplay) {
        userDisplay.innerText = displayName;
    }

    // Reset topicsData to original static data
    data.resetTopicsData();

    try {
        // Sync with static plan to ensure all problems exist
        await api.syncPlan();
    } catch (e) {
        console.error('Error syncing plan:', e);
        const message = e instanceof Error ? e.message : String(e);
        ui.showAlert(`Failed to sync problems: ${message}`);
    }

    // Merge dynamically added problems into topicsData structure
    api.mergeStructure();

    renderers.renderSidebar();
    renderers.renderMainView('all'); // Show all by default
    renderers.updateStats();

    // Initialize scroll button after DOM is ready
    ui.initScrollButton();

    // Toggle visibility of modal elements
    state.elements['setupModal']?.classList.add('hidden');
    state.elements['appWrapper']?.classList.remove('hidden');
    state.elements['loadingScreen']?.classList.add('hidden');

    // Update auth UI
    ui.updateAuthUI();
};

/**
 * Sanitizes export data to prevent XSS in exported JSON.
 * Removes any potentially dangerous content from user data.
 */
const sanitizeExportData = (data: unknown): unknown => {
    if (typeof data === 'string') {
        // Remove control characters and limit length (more permissive than sanitizeInput for export)
        return data.replace(CONTROL_CHARS_REGEX, '').slice(0, EXPORT_LIMITS.MAX_STRING_LENGTH);
    }
    if (Array.isArray(data)) {
        return data.map(sanitizeExportData);
    }
    if (data && typeof data === 'object') {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key.replace(SAFE_KEY_REGEX, '').slice(0, EXPORT_LIMITS.MAX_KEY_LENGTH),
                sanitizeExportData(value),
            ])
        );
    }
    return data;
};

// Export progress
export const exportProgress = (): void => {
    const rawExportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        problems: Object.fromEntries(state.problems),
        deletedIds: [...state.deletedProblemIds],
    };

    const exportData = sanitizeExportData(rawExportData) as typeof rawExportData;
    const dateStr = new Date().toISOString().split('T')[0];
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `smartgrind-progress-${dateStr}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Progress exported successfully!', 'success');
};

/**
 * Get statistics for a specific category
 * @param categoryId - The category/topic ID
 * @returns Statistics object with total, solved, unsolved, due counts and progress percentage
 */
export const getCategoryStats = (
    categoryId: string
): { total: number; solved: number; unsolved: number; due: number; progress: number } => {
    // Get topic title for category matching
    const topicTitle = data.topicsData.find((t) => t.id === categoryId)?.title;

    // Calculate stats by iterating Map directly (avoids unnecessary array copy for filtered categories)
    let total = 0;
    let solved = 0;
    let due = 0;
    const now = new Date().toISOString().split('T')[0] || '';

    for (const p of state.problems.values()) {
        // Check if problem matches category (if not 'all')
        if (categoryId !== 'all' && p.topic !== categoryId && p.topic !== topicTitle) {
            continue;
        }

        total++;
        if (p.status === 'solved') {
            solved++;
            if (p.nextReviewDate && p.nextReviewDate <= now) {
                due++;
            }
        }
    }

    return {
        total,
        solved,
        unsolved: total - solved,
        due,
        progress: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
};

/**
 * Get all problems for a specific category
 * @param categoryId - The category/topic ID
 * @returns Array of problems in the category
 */
export const getProblemsByCategory = (categoryId: string): Problem[] => {
    if (categoryId === 'all') {
        // Only convert to array when returning all problems
        return [...state.problems.values()];
    }

    const topic = data.topicsData.find((t) => t.id === categoryId);
    const topicTitle = topic?.title || categoryId;

    // Filter by iterating Map directly (avoids copying all problems)
    const result: Problem[] = [];
    for (const p of state.problems.values()) {
        if (p.topic === topicTitle) {
            result.push(p);
        }
    }
    return result;
};

/**
 * Get all problems
 * @returns Array of all problems
 */
export const getAllProblems = (): Problem[] => {
    return [...state.problems.values()];
};

export const app = {
    initializeLocalUser,
    exportProgress,
    fetchCsrfToken,
    getCsrfToken,
    clearCsrfToken,
    getCategoryStats,
    getProblemsByCategory,
    getAllProblems,
};
