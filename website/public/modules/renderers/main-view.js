// --- MAIN VIEW RENDERERS MODULE ---
// Main view rendering functions

export const mainViewRenderers = {
    // Helper to set view title and action buttons
    _setViewTitle: (filterTopicId) => {
        const title = filterTopicId === 'all' ? 'All Problems' :
            window.SmartGrind.data.topicsData.find(t => t.id === filterTopicId)?.title || 'Unknown Topic';
        window.SmartGrind.state.elements.currentViewTitle.innerText = title;

        // Remove existing action button container
        const existingContainer = window.SmartGrind.state.elements.currentViewTitle.nextElementSibling;
        if (existingContainer?.classList.contains('category-action-container')) {
            existingContainer.remove();
        }

        // Add action buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'category-action-container ml-2 flex gap-1';

        if (filterTopicId === 'all') {
            // Reset All button for "All Problems" view
            const resetAllBtn = document.createElement('button');
            resetAllBtn.className = 'category-action-btn p-1 rounded hover:bg-blue-500/10 text-theme-muted hover:text-blue-400 transition-colors';
            resetAllBtn.title = 'Reset All Problems';
            resetAllBtn.innerHTML = window.SmartGrind.ICONS.reset;
            resetAllBtn.onclick = () => window.SmartGrind.api.resetAll();
            buttonContainer.appendChild(resetAllBtn);
        } else {
            // Reset and Delete buttons for specific topics
            // Reset button
            const resetBtn = document.createElement('button');
            resetBtn.className = 'category-action-btn p-1 rounded hover:bg-blue-500/10 text-theme-muted hover:text-blue-400 transition-colors';
            resetBtn.title = 'Reset Category Problems';
            resetBtn.innerHTML = window.SmartGrind.ICONS.reset;
            resetBtn.onclick = () => window.SmartGrind.api.resetCategory(filterTopicId);
            buttonContainer.appendChild(resetBtn);

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'category-action-btn p-1 rounded hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-colors';
            deleteBtn.title = 'Delete Category';
            deleteBtn.innerHTML = window.SmartGrind.ICONS.delete;
            deleteBtn.onclick = () => window.SmartGrind.api.deleteCategory(filterTopicId);
            buttonContainer.appendChild(deleteBtn);
        }

        window.SmartGrind.state.elements.currentViewTitle.insertAdjacentElement('afterend', buttonContainer);
    },

    // Render main problem view
    renderMainView: (filterTopicId) => {
        window.SmartGrind.state.ui.activeTopicId = filterTopicId || window.SmartGrind.state.ui.activeTopicId;
        const container = window.SmartGrind.state.elements.problemsContainer;
        container.innerHTML = '';

        window.SmartGrind.renderers._setViewTitle(window.SmartGrind.state.ui.activeTopicId);

        const today = window.SmartGrind.utils.getToday();
        const visibleCountRef = { count: 0 };

        const relevantTopics = window.SmartGrind.state.ui.activeTopicId === 'all' ?
            window.SmartGrind.data.topicsData :
            window.SmartGrind.data.topicsData.filter(t => t.id === window.SmartGrind.state.ui.activeTopicId);

        relevantTopics.forEach(topic => {
            const topicSection = window.SmartGrind.renderers._renderTopicSection(topic, window.SmartGrind.state.ui.activeTopicId, today, visibleCountRef);
            if (topicSection) container.appendChild(topicSection);
        });

        const currentFilter = window.SmartGrind.state.ui.currentFilter;
        const shouldShowEmptyState = visibleCountRef.count === 0 && currentFilter === 'review';
        window.SmartGrind.state.elements.emptyState.classList.toggle('hidden', !shouldShowEmptyState);
        
        // Ensure empty state is hidden when there are visible problems
        if (visibleCountRef.count > 0) {
            window.SmartGrind.state.elements.emptyState.classList.add('hidden');
        }
        window.SmartGrind.renderers.updateStats();
    }
};