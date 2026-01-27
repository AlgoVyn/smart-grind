// --- RENDERERS MODULE ---
// UI rendering functions

import { ICONS } from './renderers/icons.js';
import { htmlGenerators } from './renderers/html-generators.js';
import { sidebarRenderers } from './renderers/sidebar.js';
import { mainViewRenderers } from './renderers/main-view.js';
import { problemCardRenderers } from './renderers/problem-cards.js';
import { statsRenderers } from './renderers/stats.js';

export { ICONS };

export const renderers = {
    ...htmlGenerators,
    ...sidebarRenderers,
    ...mainViewRenderers,
    ...problemCardRenderers,
    ...statsRenderers
};