// --- DATA MODULE ---
// Contains static data references and data structures

import { Topic } from './types';
import { PROBLEMS_DATA, TOTAL_UNIQUE_PROBLEMS } from './data/problems-data';
import {
    ALGORITHMS_DATA,
    TOTAL_UNIQUE_ALGORITHMS,
    AlgorithmCategory,
} from './data/algorithms-data';

/**
 * Deep clone utility that works in both browser and Node.js environments.
 * Uses structuredClone when available (modern browsers), falls back to
 * JSON methods for test environments.
 */
const deepClone = <T>(obj: T): T => {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    // Fallback for Node.js test environment
    return JSON.parse(JSON.stringify(obj));
};

// Static problem data organized by topic (now imported from problems-data.ts)
export const data = {
    // Cloudflare API base
    API_BASE: '/smartgrind/api',

    // Data structure reference (imported from separate file for maintainability)
    topicsData: PROBLEMS_DATA as Topic[],

    // Algorithms data organized by category (imported from algorithms-data.ts)
    algorithmsData: ALGORITHMS_DATA as AlgorithmCategory[],

    // Initialize original topics data reference
    ORIGINAL_TOPICS_DATA: null as Topic[] | null,

    // Initialize data module
    init: function () {
        if (!this.ORIGINAL_TOPICS_DATA) {
            // Use deepClone for efficient deep cloning of plain data
            this.ORIGINAL_TOPICS_DATA = deepClone(this.topicsData);
        }
    },

    // Reset topicsData to original
    resetTopicsData: function () {
        // Ensure ORIGINAL_TOPICS_DATA is initialized before use
        if (this.ORIGINAL_TOPICS_DATA) {
            // Use deepClone for efficient deep cloning
            this.topicsData = deepClone(this.ORIGINAL_TOPICS_DATA);
        }
    },

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
    SPACED_REPETITION_INTERVALS: [1, 3, 7, 14, 30, 60],

    /**
     * Total number of unique problems in the dataset.
     * This count represents the current total from topicsData structure.
     * Used for progress tracking and statistics calculations.
     */
    TOTAL_UNIQUE_PROBLEMS,

    /**
     * Total number of unique algorithms in the dataset.
     * This count represents the current total from algorithmsData structure.
     */
    TOTAL_UNIQUE_ALGORITHMS,

    // Local storage keys
    LOCAL_STORAGE_KEYS: {
        USER_TYPE: 'smartgrind-user-type',
        // Local user keys
        PROBLEMS: 'smartgrind-local-problems',
        DELETED_IDS: 'smartgrind-local-deleted-ids',
        DISPLAY_NAME: 'smartgrind-local-display-name',
        // Signed-in user keys (separate from local)
        SIGNED_IN_PROBLEMS: 'smartgrind-signedin-problems',
        SIGNED_IN_DELETED_IDS: 'smartgrind-signedin-deleted-ids',
        SIGNED_IN_DISPLAY_NAME: 'smartgrind-signedin-display-name',
    },
};

// Initialize the data module
data.init();
