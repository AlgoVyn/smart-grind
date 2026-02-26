// --- COMBINED RENDERERS MODULE ---
// Backward-compatible renderers object combining all renderer modules

import { mainViewRenderers } from './main-view';
import { problemCardRenderers } from './problem-cards';
import { htmlGenerators } from './html-generators';
import { sidebarRenderers } from './sidebar';
import { statsRenderers } from './stats';

export const renderers = {
    ...mainViewRenderers,
    ...problemCardRenderers,
    ...htmlGenerators,
    ...sidebarRenderers,
    ...statsRenderers,
};
