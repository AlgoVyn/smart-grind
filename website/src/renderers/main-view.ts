// --- MAIN VIEW RENDERERS MODULE ---
// Main view rendering functions

import { Topic } from '../types';
import { state } from '../state';
import { data } from '../data';
import { utils } from '../utils';
import { renderers } from '../renderers';
import { api } from '../api';
import { ICONS } from './icons';
import { ui } from '../ui/ui';

export const mainViewRenderers = {
    // Helper to create an action button
    _createActionButton: (icon: string, title: string, hoverColor: string, onClick: () => void) => {
        const button = document.createElement('button');
        button.className = `category-action-btn p-1 rounded hover:${hoverColor} text-theme-muted hover:text-${hoverColor.split('-')[1]}-400 transition-colors`;
        button.title = title;
        button.innerHTML = icon;
        button.onclick = onClick;
        return button;
    },

    // Helper to remove existing action button container
    _removeExistingActionContainer: () => {
        const currentViewTitle = state.elements['currentViewTitle'];
        if (currentViewTitle) {
            const existingContainer = currentViewTitle.nextElementSibling;
            if (existingContainer?.classList.contains('category-action-container')) {
                existingContainer.remove();
            }
        }
    },

    // Helper to set view title and action buttons
    _setViewTitle: (filterTopicId: string) => {
        const title =
            filterTopicId === 'all'
                ? 'All Problems'
                : data.topicsData.find((t: Topic) => t.id === filterTopicId)?.title ||
                  'Unknown Topic';
        const currentViewTitle = state.elements['currentViewTitle'];
        if (currentViewTitle) {
            currentViewTitle.innerText = title;
        }

        renderers._removeExistingActionContainer();

        // Add action buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'category-action-container ml-2 flex gap-1';

        if (filterTopicId === 'all') {
            // Reset All button for "All Problems" view
            const resetAllBtn = renderers._createActionButton(
                ICONS.reset,
                'Reset All Problems',
                'bg-blue-500/10',
                () => api.resetAll()
            );
            buttonContainer.appendChild(resetAllBtn);
        } else {
            // Reset and Delete buttons for specific topics
            const resetBtn = renderers._createActionButton(
                ICONS.reset,
                'Reset Category Problems',
                'bg-blue-500/10',
                () => api.resetCategory(filterTopicId)
            );
            buttonContainer.appendChild(resetBtn);

            const deleteBtn = renderers._createActionButton(
                ICONS.delete,
                'Delete Category',
                'bg-red-500/10',
                () => api.deleteCategory(filterTopicId)
            );
            buttonContainer.appendChild(deleteBtn);
        }

        if (currentViewTitle) {
            currentViewTitle.insertAdjacentElement('afterend', buttonContainer);
        }
    },

    // Render main problem view
    renderMainView: (filterTopicId: string) => {
        state.ui.activeTopicId = filterTopicId || state.ui.activeTopicId;
        const container = state.elements['problemsContainer'];
        if (container) {
            container.innerHTML = '';
        }

        renderers._setViewTitle(state.ui.activeTopicId);

        // Update date filter visibility and populate dates when in review or solved mode
        const showDateFilter =
            state.ui.currentFilter === 'review' || state.ui.currentFilter === 'solved';
        ui.toggleDateFilterVisibility(showDateFilter);
        if (showDateFilter) {
            ui.populateDateFilter();
        }

        const today = utils.getToday();
        const visibleCountRef = { count: 0 };

        const relevantTopics =
            state.ui.activeTopicId === 'all'
                ? data.topicsData
                : data.topicsData.filter((t: Topic) => t.id === state.ui.activeTopicId);

        relevantTopics.forEach((topic: Topic) => {
            const topicSection = renderers._renderTopicSection(
                topic,
                state.ui.activeTopicId,
                today,
                visibleCountRef
            );
            if (topicSection && container) {
                container.appendChild(topicSection);
            }
        });

        // Show empty state only when in review filter and no problems are visible
        const shouldShowEmptyState =
            visibleCountRef.count === 0 && state.ui.currentFilter === 'review';
        const emptyState = state.elements['emptyState'];
        if (emptyState) {
            emptyState.classList.toggle('hidden', !shouldShowEmptyState);
        }
        renderers.updateStats();
    },
};
