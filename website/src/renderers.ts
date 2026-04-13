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

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// These individual exports delegate to the renderers object for compatibility
// with code that imports functions directly. Consider using the renderers
// object pattern (import { renderers } from './renderers') for new code.
// ============================================================================

// Main view renderers
/** @deprecated Use renderers.renderMainView instead */
export const renderMainView = (topicId: string) => renderers.renderMainView(topicId);
/** @deprecated Use renderers.renderAlgorithmsView instead */
export const renderAlgorithmsView = (categoryId: string) =>
    renderers.renderAlgorithmsView(categoryId);

// SQL view renderer
/** @deprecated Use renderers.renderSQLView instead */
export const renderSQLView = (categoryId?: string) => renderers.renderSQLView(categoryId);

// Combined view renderer
/** @deprecated Use renderers.renderCombinedView instead */
export const renderCombinedView = () => renderers.renderCombinedView();

// Sidebar renderers
/** @deprecated Use renderers.renderSidebar instead */
export const renderSidebar = () => renderers.renderSidebar();
/** @deprecated Use renderers.setActiveTopic instead */
export const setActiveTopic = (id: string | null) => renderers.setActiveTopic(id);
/** @deprecated Use renderers.setActiveAlgorithmCategory instead */
export const setActiveAlgorithmCategory = (id: string | null) =>
    renderers.setActiveAlgorithmCategory(id);
/** @deprecated Use renderers.setActiveSQLCategory instead */
export const setActiveSQLCategory = (id: string | null) => renderers.setActiveSQLCategory(id);
/** @deprecated Use renderers.setActiveAllButton instead */
export const setActiveAllButton = (isActive: boolean) => renderers.setActiveAllButton(isActive);
/** @deprecated Use renderers.createAllContentButton instead */
export const createAllContentButton = () => renderers.createAllContentButton();
/** @deprecated Use renderers.createTopicButton instead */
export const createTopicButton = (id: string, title: string) =>
    renderers.createTopicButton(id, title);
/** @deprecated Use renderers.createAlgorithmCategoryButton instead */
export const createAlgorithmCategoryButton = (category: {
    id: string;
    title: string;
    algorithms: unknown[];
}) =>
    renderers.createAlgorithmCategoryButton(
        category as import('./data/algorithms-data').AlgorithmCategory
    );
/** @deprecated Use renderers.createAlgorithmAllButton instead */
export const createAlgorithmAllButton = () => renderers.createAlgorithmAllButton();
/** @deprecated Use renderers.createSQLCategoryButton instead */
export const createSQLCategoryButton = (category: {
    id: string;
    title: string;
    topics: unknown[];
}) => renderers.createSQLCategoryButton(category as import('./data/sql-data').SQLCategory);
/** @deprecated Use renderers.createSQLAllButton instead */
export const createSQLAllButton = () => renderers.createSQLAllButton();

// Stats renderers
/** @deprecated Use renderers.updateStats instead */
export const updateStats = () => renderers.updateStats();
/** @deprecated Use renderers.updateFilterBtns instead */
export const updateFilterBtns = () => renderers.updateFilterBtns();

// Problem card renderers - Note: These require proper arguments matching the original signatures
/** @deprecated Use renderers.reRenderCard(button, problem) instead */
export const reRenderCard = (button: HTMLElement, p: import('./types').Problem) =>
    renderers.reRenderCard(button, p);
/** @deprecated Use renderers.reRenderAllCards(problem, hideIfFilteredOut?) instead */
export const reRenderAllCards = (p: import('./types').Problem, hideIfFilteredOut = false) =>
    renderers.reRenderAllCards(p, hideIfFilteredOut);
/** @deprecated Use renderers.performStatusChange instead */
export const performStatusChange = (
    button: HTMLElement,
    p: import('./types').Problem,
    updateFn: (_p: import('./types').Problem) => void
) => renderers.performStatusChange(button, p, updateFn);
/** @deprecated Use renderers.handleStatusChange instead */
export const handleStatusChange = (
    button: HTMLElement,
    p: import('./types').Problem,
    newStatus: 'unsolved' | 'solved',
    interval?: number,
    nextDate?: string | null
) => renderers.handleStatusChange(button, p, newStatus, interval, nextDate);
/** @deprecated Use renderers.handleSolve instead */
export const handleSolve = (btn: HTMLElement, p: import('./types').Problem) =>
    renderers.handleSolve(btn, p);
/** @deprecated Use renderers.handleReview instead */
export const handleReview = (btn: HTMLElement, p: import('./types').Problem) =>
    renderers.handleReview(btn, p);
/** @deprecated Use renderers.handleReset instead */
export const handleReset = (btn: HTMLElement, p: import('./types').Problem) =>
    renderers.handleReset(btn, p);
/** @deprecated Use renderers.handleDeleteAction instead */
export const handleDeleteAction = (p: import('./types').Problem) => renderers.handleDeleteAction(p);
/** @deprecated Use renderers.handleNoteToggle(button, problem) instead */
export const handleNoteToggle = (button: HTMLElement, p: import('./types').Problem) =>
    renderers.handleNoteToggle(button, p);
/** @deprecated Use renderers.handleNoteSave(button, problem) instead */
export const handleNoteSave = async (button: HTMLElement, p: import('./types').Problem) =>
    renderers.handleNoteSave(button, p);
/** @deprecated Use renderers.createProblemCard instead */
export const createProblemCard = (p: import('./types').Problem) => renderers.createProblemCard(p);

// HTML generators
/** @deprecated Use renderers.isCustomItem instead */
export const isCustomItem = (type: 'pattern' | 'problem', identifier: string) =>
    renderers.isCustomItem(type, identifier);
/** @deprecated Use renderers.isCustomPattern instead */
export const isCustomPattern = (patternName: string) => renderers.isCustomPattern(patternName);
/** @deprecated Use renderers.isCustomProblem instead */
export const isCustomProblem = (problemId: string) => renderers.isCustomProblem(problemId);
/** @deprecated Use renderers.getSpinner instead */
export const getSpinner = (size?: string, color?: string) => renderers.getSpinner(size, color);

// Initialize error boundaries
export const rendererErrorBoundaries = createRendererErrorBoundaries();
