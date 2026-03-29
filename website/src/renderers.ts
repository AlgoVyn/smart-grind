// --- RENDERERS MODULE ---
// UI rendering functions - re-exports from sub-modules

export { ICONS } from './renderers/icons';
export { mainViewRenderers } from './renderers/main-view';
export { problemCardRenderers } from './renderers/problem-cards';
export { htmlGenerators } from './renderers/html-generators';
export { sidebarRenderers } from './renderers/sidebar';
export { statsRenderers } from './renderers/stats';
export { sqlViewRenderers } from './renderers/sql-view';
export { combinedViewRenderers } from './renderers/combined-view';

import { errorBoundaryPresets } from './utils/error-boundary';

// Re-import for direct function exports and wrapper object
import { sidebarRenderers } from './renderers/sidebar';
import { mainViewRenderers } from './renderers/main-view';
import { statsRenderers } from './renderers/stats';
import { combinedViewRenderers } from './renderers/combined-view';
import { sqlViewRenderers } from './renderers/sql-view';
import { htmlGenerators } from './renderers/html-generators';
import { problemCardRenderers } from './renderers/problem-cards';

// Create error boundaries for main sections
const sidebarErrorBoundary = errorBoundaryPresets.sidebar(
    document.getElementById('topic-list') || document.body
);
const mainViewErrorBoundary = errorBoundaryPresets.mainView(
    document.getElementById('problems-container') || document.body
);

// Direct exports of commonly used functions with error boundary wrapping
export const renderSidebar = (...args: Parameters<typeof sidebarRenderers.renderSidebar>) =>
    sidebarErrorBoundary.execute(() => sidebarRenderers.renderSidebar(...args), 'renderSidebar');

export const setActiveTopic = sidebarRenderers.setActiveTopic;
export const setActiveAlgorithmCategory = sidebarRenderers.setActiveAlgorithmCategory;
export const setActiveSQLCategory = sidebarRenderers.setActiveSQLCategory;
export const setActiveAllButton = sidebarRenderers.setActiveAllButton;
export const createAllContentButton = sidebarRenderers.createAllContentButton;

export const renderMainView = (...args: Parameters<typeof mainViewRenderers.renderMainView>) =>
    mainViewErrorBoundary.execute(
        () => mainViewRenderers.renderMainView(...args),
        'renderMainView'
    );

export const renderAlgorithmsView = (
    ...args: Parameters<typeof mainViewRenderers.renderAlgorithmsView>
) =>
    mainViewErrorBoundary.execute(
        () => mainViewRenderers.renderAlgorithmsView(...args),
        'renderAlgorithmsView'
    );

export const updateStats = statsRenderers.updateStats;
export const renderCombinedView = combinedViewRenderers.renderCombinedView;
export const renderSQLView = sqlViewRenderers.renderSQLView;

// Backward-compatible renderers object for dynamic imports
export const renderers = {
    ...mainViewRenderers,
    ...problemCardRenderers,
    ...htmlGenerators,
    ...sidebarRenderers,
    ...statsRenderers,
    ...sqlViewRenderers,
    ...combinedViewRenderers,
};
