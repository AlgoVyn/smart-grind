// --- UTILITIES MODULE ---
// Re-exports from specialized utility modules for backward compatibility

// Date utilities
export { getToday, addDays, formatDate, getNextReviewDate } from './utils/date';

// URL utilities
export { getUrlParameter, getBaseUrl, updateUrlParameter } from './utils/url';

// Sanitization utilities
export { sanitizeInput, sanitizeUrl } from './utils/sanitization';

// Clipboard utilities
export { copyToClipboard } from './utils/clipboard';

// Toast notifications
export { showToast } from './utils/toast';

// Scroll utilities
export { scrollToTop } from './utils/scroll';

// AI integration
export { askAI } from './utils/ai';

// Problem utilities
export {
    countLines,
    getUniqueProblemIdsForTopic,
    getUniqueProblemsForTopic,
    getAllUniqueProblemIdsIncludingAlgorithms,
    getAllUniqueProblemsIncludingAlgorithms,
    shouldShowProblem,
    getAvailableReviewDates,
} from './utils/problems';

// Element utilities
export { cacheElements, getElement, getElements } from './utils/elements';

// Storage utilities
export {
    safeGetItem,
    safeSetItem,
    safeRemoveItem,
    getStringItem,
    setStringItem,
    STORAGE_PREFIXES,
    getStorageKey,
    STORAGE_KEYS,
} from './utils/storage';

// Legacy utils object for backward compatibility
// This maintains the old API while delegating to new modules
import * as dateUtils from './utils/date';
import * as urlUtils from './utils/url';
import * as sanitizationUtils from './utils/sanitization';
import * as clipboardUtils from './utils/clipboard';
import * as toastUtils from './utils/toast';
import * as scrollUtils from './utils/scroll';
import * as aiUtils from './utils/ai';
import * as problemUtils from './utils/problems';

export const utils = {
    // Date helpers
    getToday: dateUtils.getToday,
    addDays: dateUtils.addDays,
    formatDate: dateUtils.formatDate,
    getNextReviewDate: dateUtils.getNextReviewDate,

    // URL helpers
    getUrlParameter: urlUtils.getUrlParameter,
    getBaseUrl: urlUtils.getBaseUrl,
    updateUrlParameter: urlUtils.updateUrlParameter,

    // Sanitization
    sanitizeInput: sanitizationUtils.sanitizeInput,
    sanitizeUrl: sanitizationUtils.sanitizeUrl,

    // Clipboard
    copyToClipboard: clipboardUtils.copyToClipboard,

    // Toast
    showToast: toastUtils.showToast,

    // Scroll
    scrollToTop: scrollUtils.scrollToTop,

    // AI
    askAI: aiUtils.askAI,

    // Problem utilities
    countLines: problemUtils.countLines,
    getUniqueProblemIdsForTopic: problemUtils.getUniqueProblemIdsForTopic,
    getUniqueProblemsForTopic: problemUtils.getUniqueProblemsForTopic,
    getAllUniqueProblemIdsIncludingAlgorithms:
        problemUtils.getAllUniqueProblemIdsIncludingAlgorithms,
    getAllUniqueProblemsIncludingAlgorithms: problemUtils.getAllUniqueProblemsIncludingAlgorithms,
    shouldShowProblem: problemUtils.shouldShowProblem,
    getAvailableReviewDates: problemUtils.getAvailableReviewDates,
};
