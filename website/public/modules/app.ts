// --- APP MODULE ---
// Additional app-level functions

import { state } from './state.js';
import { data } from './data.js';
import { api } from './api.js';
import { renderers } from './renderers.js';
import { ui } from './ui/ui.js';
import { utils } from './utils.js';

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

    const setupModal = state.elements['setupModal'];
    const appWrapper = state.elements['appWrapper'];
    const loadingScreen = state.elements['loadingScreen'];
    if (setupModal) {
        setupModal.classList.add('hidden');
    }
    if (appWrapper) {
        appWrapper.classList.remove('hidden');
    }
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }

    // Update auth UI
    ui.updateAuthUI();
};

// Export progress
export const exportProgress = () => {
    const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        problems: Object.fromEntries(state.problems),
        deletedIds: Array.from(state.deletedProblemIds),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartgrind-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    utils.showToast('Progress exported successfully!', 'success');
};

export const app = {
    initializeLocalUser,
    exportProgress,
};
