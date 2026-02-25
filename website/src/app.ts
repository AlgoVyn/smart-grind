// --- APP MODULE ---
// Additional app-level functions

import { state } from './state';
import { data } from './data';
import { api } from './api';
import { renderers } from './renderers';
import { ui } from './ui/ui';
import { showToast } from './utils';
import { fetchCsrfToken, getCsrfToken, getCachedCsrfToken, clearCsrfToken } from './utils/csrf';

// Re-export CSRF functions for backward compatibility
export { fetchCsrfToken, getCsrfToken, getCachedCsrfToken, clearCsrfToken };

// Initialize local user
export const initializeLocalUser = async () => {
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
        return data.replace(/[\x00-\x1F\x7F]/g, '').substring(0, 10000);
    }
    if (Array.isArray(data)) {
        return data.map(sanitizeExportData);
    }
    if (typeof data === 'object' && data !== null) {
        const sanitized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data)) {
            // Sanitize keys too
            const safeKey = key.replace(/[^\w\s-]/g, '').substring(0, 100);
            sanitized[safeKey] = sanitizeExportData(value);
        }
        return sanitized;
    }
    return data;
};

// Export progress
export const exportProgress = () => {
    // Sanitize data before export to prevent XSS via exported files
    const rawExportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        problems: Object.fromEntries(state.problems),
        deletedIds: [...state.deletedProblemIds],
    };

    // Deep sanitize all user-provided data
    const exportData = sanitizeExportData(rawExportData) as typeof rawExportData;

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartgrind-progress-${new Date().toISOString().split('T')[0]}.json`;
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
    const allProblems = [...state.problems.values()];
    const categoryProblems =
        categoryId === 'all'
            ? allProblems
            : allProblems.filter(
                  (p) =>
                      p.topic === categoryId ||
                      data.topicsData.find((t) => t.id === categoryId)?.title === p.topic
              );

    const total = categoryProblems.length;
    const solved = categoryProblems.filter((p) => p.status === 'solved').length;
    const unsolved = total - solved;
    const now = new Date().toISOString().split('T')[0] || '';
    const due = categoryProblems.filter((p) => {
        if (p.status !== 'solved') return false;
        return p.nextReviewDate && p.nextReviewDate <= now;
    }).length;
    const progress = total > 0 ? Math.round((solved / total) * 100) : 0;

    return { total, solved, unsolved, due, progress };
};

/**
 * Get all problems for a specific category
 * @param categoryId - The category/topic ID
 * @returns Array of problems in the category
 */
export const getProblemsByCategory = (categoryId: string) => {
    const allProblems = [...state.problems.values()];
    if (categoryId === 'all') {
        return allProblems;
    }
    const topic = data.topicsData.find((t) => t.id === categoryId);
    const topicTitle = topic?.title || categoryId;
    return allProblems.filter((p) => p.topic === topicTitle);
};

/**
 * Get all problems
 * @returns Array of all problems
 */
export const getAllProblems = () => {
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
