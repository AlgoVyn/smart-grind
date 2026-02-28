// --- MODAL MANAGEMENT ---

import DOMPurify from 'dompurify';
import { state } from '../state';
import { data } from '../data';
import { sanitizeInput, sanitizeUrl, showToast, escapeHtml } from '../utils';
import { api } from '../api';

// Configure DOMPurify to allow only specific tags for confirm messages
const DOMPURIFY_CONFIG = {
    ALLOWED_TAGS: ['b', 'i', 'u', 'br'],
    ALLOWED_ATTR: [],
};

// Modal helper functions
const showModal = (modalEl: HTMLElement | null | undefined, setup?: () => void) => {
    if (!modalEl) return;
    setup?.();
    modalEl.classList.remove('hidden');
};

const hideModal = (modalEl: HTMLElement | null | undefined, cleanup?: () => void) => {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    cleanup?.();
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

    state.elements['addProbCategoryNew']?.classList.remove('hidden');
    if (patternEl) patternEl.innerHTML = '<option value="">-- Select Category First --</option>';
    state.elements['addProbPatternNew']?.classList.remove('hidden');
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
 */
const generateProblemId = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `custom-${timestamp}-${random}`;
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
    (state.elements['addProblemModal'] as HTMLElement | null)?.classList.add('hidden');
    const { renderers } = await import('../renderers');
    renderers.renderSidebar();
    renderers.renderMainView(state.ui.activeTopicId);
    showToast('Problem added!');
};

export const saveNewProblem = async () => {
    const inputs = _getSanitizedInputs();
    if (!_validateInputs(inputs)) return;

    const newProb = _createNewProblem(inputs.name, inputs.url, inputs.category, inputs.pattern);
    state.problems.set(newProb.id, newProb);
    api.mergeStructure();
    await api.saveProblem(newProb);
    await _updateUIAfterAddingProblem();
};
