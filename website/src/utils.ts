// --- UTILITIES MODULE ---
// Clean re-exports from specialized utility modules

// Import all utilities for the utils object
import { getToday, addDays, formatDate, getNextReviewDate } from './utils/date';
import { getUrlParameter, getBaseUrl, updateUrlParameter } from './utils/url';
import { sanitizeInput, sanitizeUrl } from './utils/sanitization';
import { copyToClipboard } from './utils/clipboard';
import { showToast } from './utils/toast';
import { scrollToTop } from './utils/scroll';
import { askAI } from './utils/ai';
import {
    countLines,
    getUniqueProblemIdsForTopic,
    getUniqueProblemsForTopic,
    getAllUniqueProblemIdsIncludingAlgorithms,
    getAllUniqueProblemsIncludingAlgorithms,
    shouldShowProblem,
    getAvailableReviewDates,
} from './utils/problems';
import { cacheElements, getElement, getElements } from './utils/elements';
import {
    safeGetItem,
    safeSetItem,
    safeRemoveItem,
    getStringItem,
    setStringItem,
    STORAGE_PREFIXES,
    getStorageKey,
    STORAGE_KEYS,
} from './utils/storage';

// Re-export all utilities individually (for tree-shaking)
export {
    getToday,
    addDays,
    formatDate,
    getNextReviewDate,
    getUrlParameter,
    getBaseUrl,
    updateUrlParameter,
    sanitizeInput,
    sanitizeUrl,
    copyToClipboard,
    showToast,
    scrollToTop,
    askAI,
    countLines,
    getUniqueProblemIdsForTopic,
    getUniqueProblemsForTopic,
    getAllUniqueProblemIdsIncludingAlgorithms,
    getAllUniqueProblemsIncludingAlgorithms,
    shouldShowProblem,
    getAvailableReviewDates,
    cacheElements,
    getElement,
    getElements,
    safeGetItem,
    safeSetItem,
    safeRemoveItem,
    getStringItem,
    setStringItem,
    STORAGE_PREFIXES,
    getStorageKey,
    STORAGE_KEYS,
};

// Consolidated utils object for backward compatibility
export const utils = {
    // Date helpers
    getToday,
    addDays,
    formatDate,
    getNextReviewDate,

    // URL helpers
    getUrlParameter,
    getBaseUrl,
    updateUrlParameter,

    // Sanitization
    sanitizeInput,
    sanitizeUrl,

    // Clipboard
    copyToClipboard,

    // Toast
    showToast,

    // Scroll
    scrollToTop,

    // AI
    askAI,

    // Problem utilities
    countLines,
    getUniqueProblemIdsForTopic,
    getUniqueProblemsForTopic,
    getAllUniqueProblemIdsIncludingAlgorithms,
    getAllUniqueProblemsIncludingAlgorithms,
    shouldShowProblem,
    getAvailableReviewDates,

    // Element utilities
    cacheElements,
    getElement,
    getElements,

    // Storage utilities
    safeGetItem,
    safeSetItem,
    safeRemoveItem,
    getStringItem,
    setStringItem,
    STORAGE_PREFIXES,
    getStorageKey,
    STORAGE_KEYS,
};
