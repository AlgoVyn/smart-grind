// --- RENDERERS MODULE ---
// UI rendering functions - clean barrel exports

export { ICONS } from './renderers/icons';
export { mainViewRenderers } from './renderers/main-view';
export { problemCardRenderers } from './renderers/problem-cards';
export { htmlGenerators } from './renderers/html-generators';
export { sidebarRenderers } from './renderers/sidebar';
export { statsRenderers } from './renderers/stats';

// Backward-compatible renderers object
import { mainViewRenderers } from './renderers/main-view';
import { problemCardRenderers } from './renderers/problem-cards';
import { htmlGenerators } from './renderers/html-generators';
import { sidebarRenderers } from './renderers/sidebar';
import { statsRenderers } from './renderers/stats';

export const renderers = {
    ...mainViewRenderers,
    ...problemCardRenderers,
    ...htmlGenerators,
    ...sidebarRenderers,
    ...statsRenderers,
};
