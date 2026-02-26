// --- DATA MODULE ---
// Contains static data references and data structures

import { Topic } from './types';
import { PROBLEMS_DATA, TOTAL_UNIQUE_PROBLEMS } from './data/problems-data';
import {
    ALGORITHMS_DATA,
    TOTAL_UNIQUE_ALGORITHMS,
    AlgorithmCategory,
} from './data/algorithms-data';
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

// Private storage for original topics data (not exported)
let originalTopicsData: Topic[] | null = null;

// Mutable topics data - starts as a copy of PROBLEMS_DATA
const _topicsData: Topic[] = cloneData(PROBLEMS_DATA);

// Algorithms data organized by category (imported from algorithms-data.ts)
export const algorithmsData: AlgorithmCategory[] = ALGORITHMS_DATA;

// Cloudflare API base
export const API_BASE = '/smartgrind/api';

/**
 * Spaced repetition intervals in days for the Leitner system.
 * Problems are reviewed at increasing intervals to optimize memory retention.
 * Day 1: First review (immediate reinforcement)
 * Day 3: Second review (short-term memory check)
 * Day 7: Third review (weekly consolidation)
 * Day 14: Fourth review (bi-weekly reinforcement)
 * Day 30: Fifth review (monthly review)
 * Day 60: Final interval before problems are considered "mastered"
 */
export const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30, 60];

/**
 * Total number of unique problems in the dataset.
 * This count represents the current total from topicsData structure.
 * Used for progress tracking and statistics calculations.
 */
export const TOTAL_UNIQUE_PROBLEMS_COUNT = TOTAL_UNIQUE_PROBLEMS;

/**
 * Total number of unique algorithms in the dataset.
 * This count represents the current total from algorithmsData structure.
 */
export const TOTAL_UNIQUE_ALGORITHMS_COUNT = TOTAL_UNIQUE_ALGORITHMS;

// Local storage keys - re-exported from storage.ts for backward compatibility
export const LOCAL_STORAGE_KEYS = {
    USER_TYPE: STORAGE_KEYS.USER_TYPE,
    // Local user keys
    PROBLEMS: STORAGE_KEYS.PROBLEMS(false),
    DELETED_IDS: STORAGE_KEYS.DELETED_IDS(false),
    DISPLAY_NAME: STORAGE_KEYS.DISPLAY_NAME(false),
    // Signed-in user keys (separate from local)
    SIGNED_IN_PROBLEMS: STORAGE_KEYS.PROBLEMS(true),
    SIGNED_IN_DELETED_IDS: STORAGE_KEYS.DELETED_IDS(true),
    SIGNED_IN_DISPLAY_NAME: STORAGE_KEYS.DISPLAY_NAME(true),
};

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
        // Clear and repopulate the array to maintain reference
        _topicsData.length = 0;
        _topicsData.push(...cloneData(originalTopicsData));
    }
};

// Get original topics data (for checking custom items)
export const getOriginalTopicsData = (): Topic[] | null => {
    ensureOriginalData();
    return originalTopicsData;
};

// Backward-compatible data object for existing code
export const data = {
    // Cloudflare API base
    API_BASE,

    // Data structure reference (mutable array)
    topicsData: _topicsData,

    // Algorithms data organized by category
    algorithmsData,

    // Initialize data module
    init: ensureOriginalData,

    // Reset topicsData to original
    resetTopicsData,

    // Get original topics data (for checking custom items)
    getOriginalTopicsData,

    // Spaced repetition intervals
    SPACED_REPETITION_INTERVALS,

    // Total counts
    TOTAL_UNIQUE_PROBLEMS: TOTAL_UNIQUE_PROBLEMS_COUNT,
    TOTAL_UNIQUE_ALGORITHMS: TOTAL_UNIQUE_ALGORITHMS_COUNT,

    // Local storage keys
    LOCAL_STORAGE_KEYS,
};

// Also export topicsData directly for tree-shaking
export { _topicsData as topicsData };

// Initialize on module load
ensureOriginalData();
