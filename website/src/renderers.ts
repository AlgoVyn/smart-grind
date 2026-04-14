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

// Import sub-modules to build the combined renderers object
import { mainViewRenderers } from './renderers/main-view';
import { problemCardRenderers } from './renderers/problem-cards';
import { htmlGenerators } from './renderers/html-generators';
import { sidebarRenderers } from './renderers/sidebar';
import { statsRenderers } from './renderers/stats';
import { sqlViewRenderers } from './renderers/sql-view';
import { combinedViewRenderers } from './renderers/combined-view';
import { createRendererErrorBoundaries } from './lib/renderer-error-boundary';

// Combined renderers object for convenient access
export const renderers = {
    ...mainViewRenderers,
    ...problemCardRenderers,
    ...htmlGenerators,
    ...sidebarRenderers,
    ...statsRenderers,
    ...sqlViewRenderers,
    ...combinedViewRenderers,
};

export const rendererErrorBoundaries = createRendererErrorBoundaries();
