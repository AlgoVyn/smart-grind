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
export {
    RendererErrorBoundary,
    createRendererErrorBoundaries,
    withErrorBoundary,
    type ErrorBoundaryOptions,
    type ErrorInfo,
    type RenderResult,
} from './lib/renderer-error-boundary';

// Import for local use
import { sidebarRenderers } from './renderers/sidebar';
import { mainViewRenderers } from './renderers/main-view';
import { statsRenderers } from './renderers/stats';
import { combinedViewRenderers } from './renderers/combined-view';
import { sqlViewRenderers } from './renderers/sql-view';
import { problemCardRenderers } from './renderers/problem-cards';
import { htmlGenerators } from './renderers/html-generators';
import { createRendererErrorBoundaries } from './lib/renderer-error-boundary';

// Direct exports of commonly used functions
export const {
    renderSidebar,
    setActiveTopic,
    setActiveAlgorithmCategory,
    setActiveSQLCategory,
    setActiveAllButton,
    createAllContentButton,
} = sidebarRenderers;

export const { renderMainView, renderAlgorithmsView } = mainViewRenderers;
export const { updateStats } = statsRenderers;
export const { renderCombinedView } = combinedViewRenderers;
export const { renderSQLView } = sqlViewRenderers;

// Backward-compatible renderers object
export const renderers = {
    ...mainViewRenderers,
    ...problemCardRenderers,
    ...htmlGenerators,
    ...sidebarRenderers,
    ...statsRenderers,
    ...sqlViewRenderers,
    ...combinedViewRenderers,
};

// Initialize error boundaries
export const rendererErrorBoundaries = createRendererErrorBoundaries();
