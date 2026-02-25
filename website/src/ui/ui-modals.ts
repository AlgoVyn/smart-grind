// --- MODAL MANAGEMENT ---

import DOMPurify from 'dompurify';
import { state } from '../state';
import { data } from '../data';
import { utils } from '../utils';
import { api } from '../api';

// Configure DOMPurify to allow only specific tags for confirm messages
const DOMPURIFY_CONFIG = {
    ALLOWED_TAGS: ['b', 'i', 'u', 'br'],
    ALLOWED_ATTR: [],
};

// Generic modal handler factory
export const createModalHandler =
    (modalEl: HTMLElement, contentEl: HTMLElement | null | undefined, closeCallback?: () => void) =>
    (_e: Event) => {
        if (_e && _e.target !== modalEl) {
            if (contentEl) _e?.stopPropagation();
            return;
        }
        modalEl.classList.add('hidden');
        closeCallback?.();
    };

// Modal helper functions
const showModal = (modalEl: HTMLElement | null | undefined, setupCallback?: () => void) => {
    if (!modalEl) return;
    setupCallback?.();
    modalEl.classList.remove('hidden');
};

const hideModal = (modalEl: HTMLElement | null | undefined, cleanupCallback?: () => void) => {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    cleanupCallback?.();
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
            data.topicsData.map((t) => `<option value="${t.title}">${t.title}</option>`).join('');
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
              topic.patterns.map((p) => `<option value="${p.name}">${p.name}</option>`).join('')
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
        name: utils.sanitizeInput(getValue('addProbName')),
        url: utils.sanitizeUrl(getValue('addProbUrl')),
        category: utils.sanitizeInput(
            getValue('addProbCategory') || getValue('addProbCategoryNew')
        ),
        pattern: utils.sanitizeInput(
            getValue('addProbPattern') ||
                (getValue('addProbCategory') ? getValue('addProbPatternNew') : '')
        ),
    };
};

export const _validateInputs = (
    {
        name,
        url,
        category,
        pattern,
    }: { name: string; url: string; category: string; pattern: string },
    alertFn = showAlert
) => {
    const fields = [
        { value: name.trim(), message: 'Problem name is required.' },
        { value: url.trim(), message: 'Problem URL is required.' },
        { value: category.trim(), message: 'Category is required.' },
        { value: pattern.trim(), message: 'Pattern is required.' },
    ];

    for (const field of fields) {
        if (!field.value) {
            alertFn(field.message);
            return false;
        }
    }

    try {
        new URL(url);
    } catch {
        alertFn('Please enter a valid URL for the problem.');
        return false;
    }

    return true;
};

export const _createNewProblem = (
    name: string,
    url: string,
    category: string,
    pattern: string
) => ({
    id: 'custom-' + Date.now(),
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
    utils.showToast('Problem added!');
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
