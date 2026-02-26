// --- UTILITIES MODULE ---
// Clean re-exports from specialized utility modules

export { getToday, addDays, formatDate, getNextReviewDate } from './utils/date';

export { getUrlParameter, getBaseUrl, updateUrlParameter } from './utils/url';

export { sanitizeInput, sanitizeUrl, escapeHtml } from './utils/sanitization';

export { copyToClipboard } from './utils/clipboard';
export { showToast } from './utils/toast';
export { scrollToTop } from './utils/scroll';
export { askAI } from './utils/ai';

export {
    countLines,
    getUniqueProblemIdsForTopic,
    getUniqueProblemsForTopic,
    getAllUniqueProblemIdsIncludingAlgorithms,
    getAllUniqueProblemsIncludingAlgorithms,
    shouldShowProblem,
    getAvailableReviewDates,
} from './utils/problems';

export { cacheElements, getElement, getElements } from './utils/elements';

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
