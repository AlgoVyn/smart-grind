// --- APP MODULE ---
// Additional app-level functions

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.app = {};

// Initialize local user
window.SmartGrind.app.initializeLocalUser = async () => {
    window.SmartGrind.state.user.type = 'local';
    localStorage.setItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');

    window.SmartGrind.state.loadFromStorage();
    const displayName = window.SmartGrind.state.user.displayName;
    window.SmartGrind.state.elements.userDisplay.innerText = displayName;

    // Reset topicsData to original static data
    window.SmartGrind.data.resetTopicsData();

    try {
        // Sync with static plan to ensure all problems exist
        await window.SmartGrind.api.syncPlan();
    } catch (e) {
        console.error('Error syncing plan:', e);
        const message = e instanceof Error ? e.message : String(e);
        window.SmartGrind.ui.showAlert(`Failed to sync problems: ${message}`);
    }

    // Merge dynamically added problems into topicsData structure
    window.SmartGrind.api.mergeStructure();

    window.SmartGrind.renderers.renderSidebar();
    window.SmartGrind.renderers.renderMainView('all'); // Show all by default
    window.SmartGrind.renderers.updateStats();

    // Initialize scroll button after DOM is ready
    window.SmartGrind.ui.initScrollButton();

    window.SmartGrind.state.elements.setupModal.classList.add('hidden');
    window.SmartGrind.state.elements.appWrapper.classList.remove('hidden');
    window.SmartGrind.state.elements.loadingScreen.classList.add('hidden');

    // Update auth UI
    window.SmartGrind.ui.updateAuthUI();
};

// Export progress
window.SmartGrind.app.exportProgress = () => {
    const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        problems: Object.fromEntries(window.SmartGrind.state.problems),
        deletedIds: Array.from(window.SmartGrind.state.deletedProblemIds)
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

    window.SmartGrind.utils.showToast('Progress exported successfully!', 'success');
};