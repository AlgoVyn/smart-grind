// --- MODAL MANAGEMENT ---

import { Topic, Pattern } from '../types';
import { state } from '../state';
import { data } from '../data';
import { utils } from '../utils';
import { api } from '../api';
// renderers import removed to break cycle

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

// Modal functions
export const openSigninModal = () => showModal(state.elements['signinModal']);
export const closeSigninModal = () => hideModal(state.elements['signinModal']);

let _confirmResolve: ((_value: boolean) => void) | null = null;

export const _setupAddModal = () => {
    const {
        addProbCategory: categoryEl,
        addProbCategoryNew: categoryNewEl,
        addProbPattern: patternEl,
        addProbPatternNew: patternNewEl,
    } = state.elements;

    if (categoryEl) {
        categoryEl.innerHTML =
            '<option value="">-- Select or Type New --</option>' +
            data.topicsData
                .map((t: Topic) => `<option value="${t.title}">${t.title}</option>`)
                .join('');
    }

    ['addProbName', 'addProbUrl', 'addProbCategoryNew', 'addProbPatternNew'].forEach((id) => {
        const element = state.elements[
            id as keyof typeof state.elements
        ] as HTMLInputElement | null;
        if (element) element.value = '';
    });

    categoryNewEl?.classList.remove('hidden');
    if (patternEl) patternEl.innerHTML = '<option value="">-- Select Category First --</option>';
    patternNewEl?.classList.remove('hidden');
};

export const openAddModal = () => showModal(state.elements['addProblemModal'], _setupAddModal);
export const closeAddModal = () => hideModal(state.elements['addProblemModal']);

// Alert modal functions
let showAlertCalled = false;
let lastShowAlertMessage = '';
let lastShowAlertTitle = '';

export const showAlert = (message: string, title = 'Alert') => {
    showAlertCalled = true;
    lastShowAlertMessage = message;
    lastShowAlertTitle = title;

    showModal(state.elements['alertModal'], () => {
        if (state.elements['alertTitle']) state.elements['alertTitle'].textContent = title;
        if (state.elements['alertMessage']) state.elements['alertMessage'].textContent = message;
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
export const closeAlertModal = () => hideModal(state.elements['alertModal']);

// Confirm modal functions
export const showConfirm = (message: string, title = 'Confirm Action') =>
    new Promise((resolve: (_value: boolean) => void) => {
        showModal(state.elements['confirmModal'], () => {
            if (state.elements['confirmTitle']) state.elements['confirmTitle'].textContent = title;
            if (state.elements['confirmMessage']) {
                // Sanitize but allow basic formatting
                const sanitized = message
                    .replace(/&/g, '&')
                    .replace(/</g, '<')
                    .replace(/>/g, '>')
                    .replace(/<(b|i|u|br\s*\/?)>/gi, '<$1>')
                    .replace(/<\/(b|i|u)>/gi, '</$1>');
                state.elements['confirmMessage'].innerHTML = sanitized;
            }
            _confirmResolve = resolve;
        });
    });

export const closeConfirmModal = (result: boolean) => {
    hideModal(state.elements['confirmModal'], () => {
        _confirmResolve?.(result);
        _confirmResolve = null;
    });
};

export const _toggleElementVisibility = (element: HTMLElement, hide: boolean) => {
    element.classList.toggle('hidden', hide);
};

export const handleCategoryChange = (e: Event) => {
    const val = (e.target as HTMLSelectElement).value;
    const {
        addProbCategoryNew: categoryNewEl,
        addProbPattern: patternEl,
        addProbPatternNew: patternNewEl,
    } = state.elements;

    if (categoryNewEl) _toggleElementVisibility(categoryNewEl, !!val);

    if (val && patternEl) {
        const topic = data.topicsData.find((t: Topic) => t.title === val);
        patternEl.innerHTML = topic
            ? '<option value="">-- Select or Type New --</option>' +
              topic.patterns
                  .map((p: Pattern) => `<option value="${p.name}">${p.name}</option>`)
                  .join('')
            : '<option value="">-- No Patterns Found --</option>';
    } else if (patternEl) {
        patternEl.innerHTML = '<option value="">-- Select Category First --</option>';
    }

    if (patternNewEl) _toggleElementVisibility(patternNewEl, false);
};

export const handlePatternChange = (e: Event) => {
    const patternNewEl = state.elements['addProbPatternNew'];
    if (patternNewEl)
        _toggleElementVisibility(patternNewEl, !!(e.target as HTMLSelectElement).value);
};

export const _getSanitizedInputs = () => {
    const rawName = (state.elements['addProbName'] as HTMLInputElement | null)?.value || '';
    const rawUrl = (state.elements['addProbUrl'] as HTMLInputElement | null)?.value || '';
    const rawCategory =
        (state.elements['addProbCategory'] as HTMLSelectElement | null)?.value ||
        (state.elements['addProbCategoryNew'] as HTMLInputElement | null)?.value ||
        '';
    const rawPattern =
        (state.elements['addProbPattern'] as HTMLSelectElement | null)?.value ||
        (!(state.elements['addProbCategory'] as HTMLSelectElement | null)?.value
            ? ''
            : (state.elements['addProbPatternNew'] as HTMLInputElement | null)?.value) ||
        '';

    return {
        name: utils.sanitizeInput(rawName),
        url: utils.sanitizeUrl(rawUrl),
        category: utils.sanitizeInput(rawCategory),
        pattern: utils.sanitizeInput(rawPattern),
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
        {
            value: name.trim(),
            message: 'Problem name is required and cannot be empty after sanitization.',
        },
        {
            value: url.trim(),
            message: 'Problem URL is required and cannot be empty after sanitization.',
        },
        {
            value: category.trim(),
            message: 'Category is required and cannot be empty after sanitization.',
        },
        {
            value: pattern.trim(),
            message: 'Pattern is required and cannot be empty after sanitization.',
        },
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
    state.elements['addProblemModal']?.classList.add('hidden');
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
