// --- DATA MODULE ---
// Contains static data references and data structures

import { Topic } from './types';
import { PROBLEMS_DATA, TOTAL_UNIQUE_PROBLEMS } from './data/problems-data';
import {
    ALGORITHMS_DATA,
    TOTAL_UNIQUE_ALGORITHMS,
    AlgorithmCategory,
} from './data/algorithms-data';
import {
    SQL_DATA,
    TOTAL_UNIQUE_SQL_PROBLEMS,
    getAllSQLProblems,
    getSQLCategoryById,
    flattenSQLData,
    SQLCategory,
} from './data/sql-data';
import { STORAGE_KEYS } from './utils/storage';

/**
 * Deep clone utility using structuredClone with JSON fallback for test environments.
 * structuredClone is available in all modern browsers.
 */
const cloneData = <T>(obj: T): T => {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    // Fallback for Node.js test environment
    return JSON.parse(JSON.stringify(obj));
};

// Private storage for original topics data
let originalTopicsData: Topic[] | null = null;

// Mutable topics data - starts as a copy of PROBLEMS_DATA
const _topicsData: Topic[] = cloneData(PROBLEMS_DATA);

// Initialize original data on first access
const ensureOriginalData = () => {
    if (!originalTopicsData) {
        originalTopicsData = cloneData(PROBLEMS_DATA);
    }
};

// Reset topicsData to original
export const resetTopicsData = () => {
    ensureOriginalData();
    if (originalTopicsData) {
        _topicsData.length = 0;
        _topicsData.push(...cloneData(originalTopicsData));
    }
};

// Get original topics data (for checking custom items)
export const getOriginalTopicsData = (): Topic[] | null => {
    ensureOriginalData();
    return originalTopicsData;
};

/** Spaced repetition intervals in days for the Leitner system */
export const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30, 60];

/** Cloudflare API base */
export const API_BASE = '/smartgrind/api';

// Local storage keys - re-exported from storage.ts for backward compatibility
export const LOCAL_STORAGE_KEYS = {
    USER_TYPE: STORAGE_KEYS.USER_TYPE,
    PROBLEMS: STORAGE_KEYS.PROBLEMS(false),
    DELETED_IDS: STORAGE_KEYS.DELETED_IDS(false),
    DISPLAY_NAME: STORAGE_KEYS.DISPLAY_NAME(false),
    FLASHCARD_PROGRESS: STORAGE_KEYS.FLASHCARD_PROGRESS(false),
    SIGNED_IN_PROBLEMS: STORAGE_KEYS.PROBLEMS(true),
    SIGNED_IN_DELETED_IDS: STORAGE_KEYS.DELETED_IDS(true),
    SIGNED_IN_DISPLAY_NAME: STORAGE_KEYS.DISPLAY_NAME(true),
    SIGNED_IN_FLASHCARD_PROGRESS: STORAGE_KEYS.FLASHCARD_PROGRESS(true),
};

// Data object for backward compatibility
export const data = {
    API_BASE,
    topicsData: _topicsData,
    algorithmsData: ALGORITHMS_DATA,
    sqlData: SQL_DATA,
    init: ensureOriginalData,
    resetTopicsData,
    getOriginalTopicsData,
    SPACED_REPETITION_INTERVALS,
    TOTAL_UNIQUE_PROBLEMS,
    TOTAL_UNIQUE_ALGORITHMS,
    TOTAL_UNIQUE_SQL: TOTAL_UNIQUE_SQL_PROBLEMS,
    getAllSQLProblems,
    getSQLCategoryById,
    flattenSQLData,
    LOCAL_STORAGE_KEYS,
};

// Direct exports
export { _topicsData as topicsData, ALGORITHMS_DATA as algorithmsData, SQL_DATA as sqlData };
export { TOTAL_UNIQUE_PROBLEMS, TOTAL_UNIQUE_ALGORITHMS, TOTAL_UNIQUE_SQL_PROBLEMS };
export { getAllSQLProblems, getSQLCategoryById, flattenSQLData };
export type { AlgorithmCategory, SQLCategory };

// Initialize on module load
ensureOriginalData();
