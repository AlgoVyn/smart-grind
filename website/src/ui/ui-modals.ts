// --- MODAL MANAGEMENT ---

import DOMPurify from 'dompurify';
import { state } from '../state';
import { data } from '../data';
import { sanitizeInput, sanitizeUrl, showToast, escapeHtml, hideEl } from '../utils';
import { api } from '../api';
import { errorTracker } from '../utils/error-tracker';

// Configure DOMPurify to allow only specific tags for confirm messages
const DOMPURIFY_CONFIG = {
    ALLOWED_TAGS: ['b', 'i', 'u', 'br'],
    ALLOWED_ATTR: [],
};

// Track the element that triggered the modal opening
let lastFocusedElement: HTMLElement | null = null;

// Simple focus management for modals
const trapFocus = (modalEl: HTMLElement): (() => void) => {
    // Check if element has querySelectorAll (may not exist in test mocks)
    if (!modalEl.querySelectorAll) {
        return () => {}; // Return no-op cleanup
    }

    const focusableElements = modalEl.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // If no focusable elements, return no-op
    if (focusableElements.length === 0) {
        return () => {};
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
        }
    };

    modalEl.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
        modalEl.removeEventListener('keydown', handleKeyDown);
    };
};

// Store cleanup functions for focus traps
const focusTrapCleanups = new Map<HTMLElement, (() => void) | null>();

// Modal helper functions
const showModal = (modalEl: HTMLElement | null | undefined, setup?: () => void) => {
    if (!modalEl) return;

    // Store the currently focused element before opening modal
    lastFocusedElement = document.activeElement as HTMLElement;

    setup?.();
    modalEl.classList.remove('hidden');

    // Activate focus trap
    const cleanup = trapFocus(modalEl);
    focusTrapCleanups.set(modalEl, cleanup);
};

const hideModal = (modalEl: HTMLElement | null | undefined, cleanup?: () => void) => {
    if (!modalEl) return;

    // Deactivate focus trap
    focusTrapCleanups.get(modalEl)?.();
    focusTrapCleanups.set(modalEl, null);

    modalEl.classList.add('hidden');
    cleanup?.();

    // Return focus
    lastFocusedElement?.focus();
};

// Generic modal handler factory
export const createModalHandler =
    (modalEl: HTMLElement, contentEl?: HTMLElement | null, onClose?: () => void) =>
    (e: Event | null | undefined) => {
        // Close modal when event is null/undefined or target is the modal itself
        if (e && e.target !== modalEl) {
            if (contentEl) e.stopPropagation();
            return;
        }
        modalEl.classList.add('hidden');
        onClose?.();
    };

// Signin modal
export const openSigninModal = () => showModal(state.elements['signinModal'] as HTMLElement | null);
export const closeSigninModal = () =>
    hideModal(state.elements['signinModal'] as HTMLElement | null);

// Add problem modal
let _confirmResolve: ((_value: boolean) => void) | null = null;

export const _setupAddModal = () => {
    const categoryEl = state.elements['addProbCategory'] as HTMLSelectElement | null;
    const patternEl = state.elements['addProbPattern'] as HTMLSelectElement | null;

    if (categoryEl) {
        categoryEl.innerHTML =
            '<option value="">-- Select or Type New --</option>' +
            data.topicsData
                .map(
                    (t) => `<option value="${escapeHtml(t.title)}">${escapeHtml(t.title)}</option>`
                )
                .join('');
    }

    ['addProbName', 'addProbUrl', 'addProbCategoryNew', 'addProbPatternNew'].forEach((id) => {
        const el = state.elements[id] as HTMLInputElement | null;
        if (el) el.value = '';
    });

    (state.elements['addProbCategoryNew'] as HTMLElement | null)?.classList.remove('hidden');
    if (patternEl) patternEl.innerHTML = '<option value="">-- Select Category First --</option>';
    (state.elements['addProbPatternNew'] as HTMLElement | null)?.classList.remove('hidden');
};

export const openAddModal = () =>
    showModal(state.elements['addProblemModal'] as HTMLElement | null, _setupAddModal);
export const closeAddModal = () =>
    hideModal(state.elements['addProblemModal'] as HTMLElement | null);

// Alert modal
let showAlertCalled = false;
let lastShowAlertMessage = '';
let lastShowAlertTitle = '';

export const showAlert = (message: string, title = 'Alert') => {
    showAlertCalled = true;
    lastShowAlertMessage = message;
    lastShowAlertTitle = title;

    showModal(state.elements['alertModal'] as HTMLElement | null, () => {
        const titleEl = state.elements['alertTitle'] as HTMLElement | null;
        const msgEl = state.elements['alertMessage'] as HTMLElement | null;
        if (titleEl) titleEl.textContent = title;
        if (msgEl) msgEl.textContent = message;
    });
};

export const getShowAlertHistory = () => ({
    called: showAlertCalled,
    lastMessage: lastShowAlertMessage,
    lastTitle: lastShowAlertTitle,
});

export const clearShowAlertHistory = () => {
    showAlertCalled = false;
    lastShowAlertMessage = '';
    lastShowAlertTitle = '';
};

export const closeAlertModal = () => hideModal(state.elements['alertModal'] as HTMLElement | null);

// Confirm modal
export const sanitizeConfirmMessage = (message: string): string =>
    DOMPurify.sanitize(message, DOMPURIFY_CONFIG);

export const showConfirm = (message: string, title = 'Confirm Action') =>
    new Promise((resolve: (_value: boolean) => void) => {
        // If a previous confirm is still pending, resolve it with false
        // to prevent the Promise from hanging indefinitely.
        if (_confirmResolve) {
            _confirmResolve(false);
            _confirmResolve = null;
        }

        showModal(state.elements['confirmModal'] as HTMLElement | null, () => {
            const titleEl = state.elements['confirmTitle'] as HTMLElement | null;
            const msgEl = state.elements['confirmMessage'] as HTMLElement | null;
            if (titleEl) titleEl.textContent = title;
            if (msgEl) msgEl.innerHTML = sanitizeConfirmMessage(message);
            _confirmResolve = resolve;
        });
    });

export const closeConfirmModal = (result: boolean) => {
    hideModal(state.elements['confirmModal'] as HTMLElement | null, () => {
        _confirmResolve?.(result);
        _confirmResolve = null;
    });
};

// Form handlers
export const _toggleElementVisibility = (element: HTMLElement, hide: boolean) => {
    element.classList.toggle('hidden', hide);
};

export const handleCategoryChange = (e: Event) => {
    const val = (e.target as HTMLSelectElement).value;
    const categoryNewEl = state.elements['addProbCategoryNew'] as HTMLElement | null;
    const patternEl = state.elements['addProbPattern'] as HTMLSelectElement | null;
    const patternNewEl = state.elements['addProbPatternNew'] as HTMLElement | null;

    if (categoryNewEl) _toggleElementVisibility(categoryNewEl, !!val);

    if (val && patternEl) {
        const topic = data.topicsData.find((t) => t.title === val);
        patternEl.innerHTML = topic
            ? '<option value="">-- Select or Type New --</option>' +
              topic.patterns
                  .map(
                      (p) => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`
                  )
                  .join('')
            : '<option value="">-- No Patterns Found --</option>';
    } else if (patternEl) {
        patternEl.innerHTML = '<option value="">-- Select Category First --</option>';
    }

    if (patternNewEl) _toggleElementVisibility(patternNewEl, false);
};

export const handlePatternChange = (e: Event) => {
    const patternNewEl = state.elements['addProbPatternNew'] as HTMLElement | null;
    if (patternNewEl)
        _toggleElementVisibility(patternNewEl, !!(e.target as HTMLSelectElement).value);
};

export const _getSanitizedInputs = () => {
    const getValue = (id: string) => (state.elements[id] as HTMLInputElement | null)?.value || '';

    return {
        name: sanitizeInput(getValue('addProbName')),
        url: sanitizeUrl(getValue('addProbUrl')),
        category: sanitizeInput(getValue('addProbCategory') || getValue('addProbCategoryNew')),
        pattern: sanitizeInput(
            getValue('addProbPattern') ||
                (getValue('addProbCategory') ? getValue('addProbPatternNew') : '')
        ),
    };
};

const REQUIRED_FIELDS = [
    { key: 'name', message: 'Problem name is required.' },
    { key: 'url', message: 'Problem URL is required.' },
    { key: 'category', message: 'Category is required.' },
    { key: 'pattern', message: 'Pattern is required.' },
] as const;

export const _validateInputs = (
    inputs: { name: string; url: string; category: string; pattern: string },
    alertFn = showAlert
) => {
    for (const { key, message } of REQUIRED_FIELDS) {
        if (!inputs[key].trim()) {
            alertFn(message);
            return false;
        }
    }

    try {
        new URL(inputs.url);
    } catch {
        alertFn('Please enter a valid URL for the problem.');
        return false;
    }

    return true;
};

/**
 * Generates a unique problem ID using timestamp and random component
 * Format: custom-{timestamp}-{random} to avoid collisions
 * This prevents conflicts with LeetCode problem IDs which are kebab-case strings
 */
const generateProblemId = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `custom-${timestamp}-${random}`;
};

/**
 * Check if a problem ID already exists (either in state or topicsData)
 * This prevents accidental overwrites of existing problems
 */
const checkProblemIdExists = (id: string): boolean => {
    // Check in current state
    if (state.problems.has(id)) {
        return true;
    }

    // Check in topicsData (LeetCode problems)
    for (const topic of data.topicsData) {
        // Skip if topic has no patterns (handles test mocks)
        if (!topic.patterns || !Array.isArray(topic.patterns)) {
            continue;
        }
        for (const pattern of topic.patterns) {
            // Skip if pattern has no problems
            if (!pattern.problems || !Array.isArray(pattern.problems)) {
                continue;
            }
            for (const prob of pattern.problems) {
                const probId = typeof prob === 'string' ? prob : prob.id;
                if (probId === id) {
                    return true;
                }
            }
        }
    }

    return false;
};

export const _createNewProblem = (
    name: string,
    url: string,
    category: string,
    pattern: string
) => ({
    id: generateProblemId(),
    name,
    url,
    topic: category,
    pattern,
    status: 'unsolved' as const,
    reviewInterval: 0,
    nextReviewDate: null,
    note: '',
    loading: false,
});

export const _updateUIAfterAddingProblem = async () => {
    hideEl(state.elements['addProblemModal']);
    const { renderers } = await import('../renderers');
    renderers.renderSidebar();
    renderers.renderMainView(state.ui.activeTopicId);
    showToast('Problem added!');
};

export const saveNewProblem = async () => {
    const inputs = _getSanitizedInputs();
    if (!_validateInputs(inputs)) return;

    // Generate unique ID with collision check (retry up to 5 times)
    let newProb = _createNewProblem(inputs.name, inputs.url, inputs.category, inputs.pattern);
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (checkProblemIdExists(newProb.id) && attempts < MAX_ATTEMPTS) {
        console.warn(`[Problem ID] Collision detected for ${newProb.id}, regenerating...`);
        newProb = _createNewProblem(inputs.name, inputs.url, inputs.category, inputs.pattern);
        attempts++;
    }

    if (checkProblemIdExists(newProb.id)) {
        showAlert('Failed to generate unique problem ID. Please try again.');
        return;
    }

    state.setProblem(newProb.id, newProb);
    api.mergeStructure();
    await api.saveProblem(newProb);
    await _updateUIAfterAddingProblem();
};

// Error tracking consent modal

/**
 * Shows the error tracking consent banner at the bottom of the screen
 * Called during app initialization if consent status is unknown
 */
export const showErrorTrackingConsent = (): void => {
    // Check if modal already exists
    if (document.getElementById('error-tracking-consent-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'error-tracking-consent-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Error Tracking Consent');
    // Fixed positioning at bottom with theme-compatible styling
    modal.className = 'fixed';

    // Use inline styles for the animation to ensure it works
    modal.style.cssText = `
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        animation: slide-up 0.3s ease-out;
        padding: 1rem;
    `;

    modal.innerHTML = `
        <div style="max-width: 56rem; margin: 0 auto;">
            <div class="bg-dark-800 border border-slate-700/50 rounded-lg shadow-2xl p-3 sm:p-4" style="background-color: var(--theme-bg-card); border-color: var(--theme-border);">
                <!-- Header: Title + Buttons on same row for desktop -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div class="flex-1 min-w-0" style="min-width: 0;">
                        <h2 class="text-sm sm:text-base font-semibold" style="color: var(--theme-text-bold); margin-bottom: 0.25rem;">
                            Help Improve SmartGrind
                        </h2>
                        <p class="text-xs sm:text-sm" style="color: var(--theme-text-muted);">
                            Share anonymous error reports to help us fix bugs faster. 
                            <button type="button" id="error-tracking-learn-more" class="underline cursor-pointer bg-transparent border-none p-0 text-xs sm:text-sm" style="color: var(--brand-color, #4f46e5);">
                                Learn more
                            </button>
                        </p>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button type="button" id="decline-error-tracking" class="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-colors" style="color: var(--theme-text-muted); background: transparent;">
                            No Thanks
                        </button>
                        <button type="button" id="accept-error-tracking" class="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-brand-600 hover:bg-brand-500 text-white rounded-md font-medium transition-colors shadow-md whitespace-nowrap">
                            Yes, Help Improve
                        </button>
                    </div>
                </div>
                
                <!-- Expandable Details Section -->
                <div id="error-tracking-details" class="hidden" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--theme-border);">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div class="rounded p-2.5" style="background-color: var(--theme-bg-main);">
                            <p class="font-medium mb-1.5" style="color: var(--theme-text-bold);">What we collect:</p>
                            <ul class="list-disc list-inside space-y-0.5" style="color: var(--theme-text-muted);">
                                <li>Error messages and stack traces</li>
                                <li>Browser type (for debugging)</li>
                                <li>Page URL where error occurred</li>
                            </ul>
                        </div>
                        <div class="rounded p-2.5" style="background-color: var(--theme-bg-main);">
                            <p class="font-medium mb-1.5" style="color: var(--theme-text-bold);">We do NOT collect:</p>
                            <ul class="list-disc list-inside space-y-0.5" style="color: var(--theme-text-muted);">
                                <li>Personal information</li>
                                <li>Problem notes or data</li>
                                <li>Login credentials</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add animation styles if not present
    if (!document.getElementById('error-tracking-styles')) {
        const style = document.createElement('style');
        style.id = 'error-tracking-styles';
        style.textContent = `
            @keyframes slide-up {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(modal);

    // Handle learn more toggle
    const learnMoreBtn = modal.querySelector('#error-tracking-learn-more');
    const details = modal.querySelector('#error-tracking-details');
    learnMoreBtn?.addEventListener('click', () => {
        const isHidden = details?.classList.contains('hidden');
        details?.classList.toggle('hidden', !isHidden);
        if (learnMoreBtn && isHidden) {
            (learnMoreBtn as HTMLButtonElement).textContent = 'Show less';
        } else if (learnMoreBtn) {
            (learnMoreBtn as HTMLButtonElement).textContent = 'Learn more';
        }
    });

    // Handle accept
    const acceptBtn = modal.querySelector('#accept-error-tracking');
    acceptBtn?.addEventListener('click', () => {
        errorTracker.grantConsent();
        modal.remove();
        showToast('Thank you for helping improve SmartGrind!', 'success');
    });

    // Handle decline
    const declineBtn = modal.querySelector('#decline-error-tracking');
    declineBtn?.addEventListener('click', () => {
        errorTracker.revokeConsent();
        modal.remove();
    });
};

/**
 * Check if we should show the consent dialog
 * Shows only if consent status is unknown (first visit)
 */
export const checkAndShowErrorTrackingConsent = (): void => {
    const status = errorTracker.getConsentStatus();
    if (status === 'unknown') {
        // Small delay to not interrupt initial app load
        setTimeout(() => {
            showErrorTrackingConsent();
        }, 2000);
    }
};

/**
 * Creates a settings toggle for error tracking consent
 * Call this when rendering settings/preferences UI
 */
export const createErrorTrackingToggle = (): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'flex items-center justify-between py-3';

    const hasConsent = errorTracker.hasConsent();

    container.innerHTML = `
        <div>
            <h3 class="font-medium" style="color: var(--theme-text-bold);">Anonymous Error Reports</h3>
            <p class="text-sm" style="color: var(--theme-text-muted);">Help fix bugs by sharing error data</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="error-tracking-toggle" class="sr-only peer" ${hasConsent ? 'checked' : ''}>
            <div class="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600" style="background-color: var(--theme-bg-sidebar);"></div>
        </label>
    `;

    const toggle = container.querySelector('#error-tracking-toggle');
    toggle?.addEventListener('change', (e) => {
        const isChecked = (e.target as HTMLInputElement).checked;
        if (isChecked) {
            errorTracker.grantConsent();
            showToast('Error reporting enabled', 'success');
        } else {
            errorTracker.revokeConsent();
            showToast('Error reporting disabled');
        }
    });

    return container;
};
