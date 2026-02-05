// --- DATA MODULE ---
// Contains static data references and data structures

import { Topic } from './types';
import { PROBLEMS_DATA, TOTAL_UNIQUE_PROBLEMS } from './data/problems-data';

// Static problem data organized by topic (now imported from problems-data.ts)
export const data = {
    // Cloudflare API base
    API_BASE: '/smartgrind/api',

    // Data structure reference (imported from separate file for maintainability)
    topicsData: PROBLEMS_DATA as Topic[],

    // Initialize original topics data reference
    ORIGINAL_TOPICS_DATA: null as Topic[] | null,

    // Initialize data module
    init: function () {
        if (!this.ORIGINAL_TOPICS_DATA) {
            // Use JSON methods for deep cloning since we only have plain data (strings, objects, arrays)
            // This preserves the exact data structure including union types
            this.ORIGINAL_TOPICS_DATA = JSON.parse(JSON.stringify(this.topicsData));
        }
    },

    // Reset topicsData to original
    resetTopicsData: function () {
        // Ensure ORIGINAL_TOPICS_DATA is initialized before use
        if (this.ORIGINAL_TOPICS_DATA) {
            // Use JSON methods for deep cloning since we only have plain data
            this.topicsData = JSON.parse(JSON.stringify(this.ORIGINAL_TOPICS_DATA));
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

    // Local storage keys
    LOCAL_STORAGE_KEYS: {
        USER_TYPE: 'smartgrind-user-type',
        PROBLEMS: 'smartgrind-local-problems',
        DELETED_IDS: 'smartgrind-local-deleted-ids',
        DISPLAY_NAME: 'smartgrind-local-display-name',
    },
};

// Initialize the data module
data.init();
