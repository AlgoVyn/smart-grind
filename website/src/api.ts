// --- API MODULE ---
// API functions for data management

import { saveData, saveProblem, saveDeletedId } from './api/api-save';
import { loadData } from './api/api-load';
import { syncPlan, mergeStructure } from './api/api-sync';
import { resetAll, resetCategory } from './api/api-reset';
import { deleteCategory } from './api/api-delete';

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
