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

// Error Boundaries for safe rendering
export {
    RendererErrorBoundary,
    createRendererErrorBoundaries,
    withErrorBoundary,
    type ErrorBoundaryOptions,
    type ErrorInfo,
    type RenderResult,
} from './lib/renderer-error-boundary';

import { sidebarRenderers } from './renderers/sidebar';
import { mainViewRenderers } from './renderers/main-view';
import { statsRenderers } from './renderers/stats';
import { combinedViewRenderers } from './renderers/combined-view';
import { sqlViewRenderers } from './renderers/sql-view';
import { htmlGenerators } from './renderers/html-generators';
import { problemCardRenderers } from './renderers/problem-cards';
import {
    RendererErrorBoundary,
    createRendererErrorBoundaries,
} from './lib/renderer-error-boundary';

// Direct exports of commonly used functions
export const renderSidebar = sidebarRenderers.renderSidebar;
export const setActiveTopic = sidebarRenderers.setActiveTopic;
export const setActiveAlgorithmCategory = sidebarRenderers.setActiveAlgorithmCategory;
export const setActiveSQLCategory = sidebarRenderers.setActiveSQLCategory;
export const setActiveAllButton = sidebarRenderers.setActiveAllButton;
export const createAllContentButton = sidebarRenderers.createAllContentButton;
export const renderMainView = mainViewRenderers.renderMainView;
export const renderAlgorithmsView = mainViewRenderers.renderAlgorithmsView;
export const updateStats = statsRenderers.updateStats;
export const renderCombinedView = combinedViewRenderers.renderCombinedView;
export const renderSQLView = sqlViewRenderers.renderSQLView;

// Backward-compatible renderers object with error boundary integration
export const renderers = {
    ...mainViewRenderers,
    ...problemCardRenderers,
    ...htmlGenerators,
    ...sidebarRenderers,
    ...statsRenderers,
    ...sqlViewRenderers,
    ...combinedViewRenderers,
    // Error boundary utilities
    RendererErrorBoundary,
    createRendererErrorBoundaries,
};

// Initialize error boundaries for main containers on module load
export const rendererErrorBoundaries = createRendererErrorBoundaries();
