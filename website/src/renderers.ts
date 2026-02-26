// --- RENDERERS MODULE ---
// UI rendering functions - clean barrel exports

export { ICONS } from './renderers/icons';
export { mainViewRenderers } from './renderers/main-view';
export { problemCardRenderers } from './renderers/problem-cards';
export { htmlGenerators } from './renderers/html-generators';
export { sidebarRenderers } from './renderers/sidebar';
export { statsRenderers } from './renderers/stats';

// Backward-compatible renderers object - re-exports combined
export { renderers } from './renderers/combined';
