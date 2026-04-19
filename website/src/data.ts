// --- DATA MODULE ---
// Central data hub - provides the `data` object with all static data and helpers

import { Topic } from './types';
import { PROBLEMS_DATA, TOTAL_UNIQUE_PROBLEMS } from './data/problems-data';
import { ALGORITHMS_DATA, TOTAL_UNIQUE_ALGORITHMS } from './data/algorithms-data';
import {
    SQL_DATA,
    TOTAL_UNIQUE_SQL_PROBLEMS,
    getAllSQLProblems,
    getSQLCategoryById,
    flattenSQLData,
} from './data/sql-data';

/**
 * Deep clone data using structuredClone API with JSON fallback.
 * Note: structuredClone is supported in all modern browsers (Chrome 98+, Firefox 94+, Safari 15.4+, Edge 98+).
 * Falls back to JSON.parse/stringify for legacy browsers (with limitations on Date, undefined, etc.).
 */
const cloneData = <T>(obj: T): T => {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    // Fallback for legacy browsers - JSON method has limitations (Dates become strings,
    // undefined values stripped, circular refs throw). Warn to help debug data issues.
    console.warn('[Data] Using JSON fallback clone - some types may not be preserved');
    return JSON.parse(JSON.stringify(obj));
};

let originalTopicsData: Topic[] | null = null;
const _topicsData: Topic[] = cloneData(PROBLEMS_DATA);

const ensureOriginalData = () => {
    if (!originalTopicsData) {
        originalTopicsData = cloneData(PROBLEMS_DATA);
    }
};

export const resetTopicsData = () => {
    ensureOriginalData();
    if (originalTopicsData) {
        _topicsData.length = 0;
        _topicsData.push(...cloneData(originalTopicsData));
    }
};

export const getOriginalTopicsData = (): Topic[] | null => {
    ensureOriginalData();
    return originalTopicsData;
};

export const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30, 60];
export const API_BASE = '/smartgrind/api';

// Local storage keys
export const LOCAL_STORAGE_KEYS = {
    USER_TYPE: 'smartgrind-user-type',
    PROBLEMS: 'smartgrind-problems',
    DELETED_IDS: 'smartgrind-deleted-ids',
    DISPLAY_NAME: 'smartgrind-display-name',
    FLASHCARD_PROGRESS: 'smartgrind-flashcard-progress',
    SIGNED_IN_PROBLEMS: 'SIGNED_IN_smartgrind-problems',
    SIGNED_IN_DELETED_IDS: 'SIGNED_IN_smartgrind-deleted-ids',
    SIGNED_IN_DISPLAY_NAME: 'SIGNED_IN_smartgrind-display-name',
    SIGNED_IN_FLASHCARD_PROGRESS: 'SIGNED_IN_smartgrind-flashcard-progress',
};

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

ensureOriginalData();
