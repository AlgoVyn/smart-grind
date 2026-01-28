// --- API MODULE ---
// API functions for data management

import { saveData, saveProblem, saveDeletedId } from './api/api-save.js';
import { loadData } from './api/api-load.js';
import { syncPlan, mergeStructure } from './api/api-sync.js';
import { resetAll, resetCategory } from './api/api-reset.js';
import { deleteCategory } from './api/api-delete.js';

export const api = {
    saveData,
    saveProblem,
    saveDeletedId,
    loadData,
    syncPlan,
    mergeStructure,
    resetAll,
    resetCategory,
    deleteCategory,
};
