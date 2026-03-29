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

const cloneData = <T>(obj: T): T => {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
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

export { _topicsData as topicsData, ALGORITHMS_DATA as algorithmsData, SQL_DATA as sqlData };
export { TOTAL_UNIQUE_PROBLEMS, TOTAL_UNIQUE_ALGORITHMS, TOTAL_UNIQUE_SQL_PROBLEMS };
export { getAllSQLProblems, getSQLCategoryById, flattenSQLData };
export type { AlgorithmCategory, SQLCategory };

ensureOriginalData();
