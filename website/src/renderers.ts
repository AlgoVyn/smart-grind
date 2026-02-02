// --- RENDERERS MODULE ---
// UI rendering functions

import { ICONS } from './renderers/icons';
import { htmlGenerators } from './renderers/html-generators';
import { sidebarRenderers } from './renderers/sidebar';
import { mainViewRenderers } from './renderers/main-view';
import { problemCardRenderers } from './renderers/problem-cards';
import { statsRenderers } from './renderers/stats';

export { ICONS };

export const renderers = {
    ...htmlGenerators,
    ...sidebarRenderers,
    ...mainViewRenderers,
    ...problemCardRenderers,
    ...statsRenderers,
};
